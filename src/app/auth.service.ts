import { inject, Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private isLoggedIn = signal(false);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      if (user) {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
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
  
        this.userSubject.next(result.user);
        this.isLoggedIn.set(true);
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        throw error;
      });
  }
  

  signOut() {
    const provider = new GoogleAuthProvider();
    return signOut(this.auth);
  }

  get isLoggedIn$() {
    return this.isLoggedIn;
  }
}
