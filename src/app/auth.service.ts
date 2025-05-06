import { inject, Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { StreamChat } from 'stream-chat';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private isLoggedIn = signal(false);
  private userSubject = signal<User | null>(null);
  user$ = this.userSubject.asReadonly();
  private firestore = inject(Firestore);

  http = inject(HttpClient);

  constructor() {

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userSubject.set(user);
        this.isLoggedIn.set(true);
      } else {
        this.userSubject.set(null);
        this.isLoggedIn.set(false);
      }
    });
  }

  signIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: 'ndsu.edu' });

    return signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const email = result.user.email || '';

        if (!email.endsWith('@ndsu.edu')) {
          alert('You must use your NDSU email to sign in.');
          await signOut(this.auth);
          return;
        }

        this.userSubject.set(result.user);
        this.isLoggedIn.set(true);


        // Check if user exists in Firestore using their uid
        const userDocRef = doc(this.firestore, `users/${result.user.uid}`);
        const userDoc = await getDoc(userDocRef);

        // If the user document doesn't exist then create it with fields set to empty
        if (!userDoc.exists()) {
          const streamKey = await this.generateStreamKey(result.user.uid);
          const userData = {
            name: result.user.displayName,
            email: result.user.email,
            fname: '',
            lname: '',
            strengths: '',
            weaknesses: '', 
            bio: '',
            freeTimes: '',
            classes: '',
            imageURL: '',
            streamKey: streamKey,
          };
          
          // Add the user info to Firestore database
          await setDoc(userDocRef, userData);


          const chatClient = new StreamChat('25tf5sakkgnx');
          const streamUser = {
                id: result.user.uid,
                name: "",
                image: "",
              };


              chatClient.connectUser(streamUser, streamKey);
              chatClient.upsertUser(streamUser);
        }




      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        throw error;
      });

      
  }

  signOut() {
    return signOut(this.auth)
      .then(() => {
        this.isLoggedIn.set(false);
        this.userSubject.set(null);
      })
      .catch((error) => {
        console.error('Sign-out error:', error);
      });
  }

  get isLoggedIn$() {
    return this.isLoggedIn.asReadonly();
  }

  async generateStreamKey(firebaseUid: string): Promise<string> {
    const response = await firstValueFrom(
      this.http.post('http://127.0.0.1:8000/generate-stream-key/', //add api url here when backend deployed
        { firebaseUid },
        { responseType: 'text' }
      )
    );
    return response;
  }
  
  
  

  

}
