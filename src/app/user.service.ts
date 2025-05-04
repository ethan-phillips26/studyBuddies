import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Firestore, doc, updateDoc,
  setDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private userDocRef;

  constructor() {
    const currentUser = this.authService.user$;
    const uid = currentUser()?.uid;
    const name = currentUser()?.displayName;
    this.userDocRef = doc(this.firestore, `users/${uid}`);

  }

  setFname(fname: string) {
    updateDoc(this.userDocRef, {fname: fname})
  }

  setLname(lname: string) {
    updateDoc(this.userDocRef, {lname: lname})
  }

  setStrengths(strengths: string) {
    updateDoc(this.userDocRef, {strengths: strengths})
  }

  setWeaknesses(weaknessess: string) {
    updateDoc(this.userDocRef, {weaknessess: weaknessess})
  }
  
  setBio(bio: string) {
    updateDoc(this.userDocRef, {bio: bio})
  }


}
