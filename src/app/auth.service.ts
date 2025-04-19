import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
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
    return signInWithPopup(this.auth, provider)
  }

  signOut() {
    const provider = new GoogleAuthProvider();
    return signOut(this.auth);
  }

  get isLoggedIn$() {
    return this.isLoggedIn;
  }
}
