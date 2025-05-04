import { inject, Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private isLoggedIn = signal(false);
  private userSubject = signal<User | null>(null);
  user$ = this.userSubject.asReadonly();
  private firestore = inject(Firestore);

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


        // Check if user exists in Firestore using their UID
        const userDocRef = doc(this.firestore, `users/${result.user.uid}`);
        const userDoc = await getDoc(userDocRef);

        // If the user document doesn't exist, create it
        if (!userDoc.exists()) {
          const userData = {
            name: result.user.displayName || 'Unnamed User',
            email: result.user.email || 'No Email',
            fname: 'n/a',
            lname: 'n/a',
            strengths: 'n/a',
            weaknesses: 'n/a', 
            bio: 'n/a', 
            // Add additional fields we want later
          };
          
          // Add the user to Firestore
          await setDoc(userDocRef, userData);
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
}
