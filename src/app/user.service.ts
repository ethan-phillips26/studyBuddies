import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Firestore, doc, getDoc, updateDoc, } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private user = this.authService.user$();


  private getUserDocRef() {
    
    if (!this.user) throw new Error('User not logged in');
    return doc(this.firestore, `users/${this.user.uid}`);
  }

  async setFname(fname: string) {
    await updateDoc(this.getUserDocRef(), { fname });
  }

  async setLname(lname: string) {
    await updateDoc(this.getUserDocRef(), { lname });
  }

  async setStrengths(strengths: string) {
    await updateDoc(this.getUserDocRef(), { strengths });
  }

  async setWeaknesses(weaknesses: string) {
    await updateDoc(this.getUserDocRef(), { weaknesses });
  }

  async setBio(bio: string) {
    await updateDoc(this.getUserDocRef(), { bio });
  }

  async setFreeTimes(freeTimes: string) {
    await updateDoc(this.getUserDocRef(), { freeTimes });
  }

  async setClasses(classes: string) {
    await updateDoc(this.getUserDocRef(), { classes });
  }

  async uploadProfileImage(file: File): Promise<string> {
    const user = this.authService.user$();
    if (!user) throw new Error('User not logged in');
  
    const filePath = `profile_images/${user.uid}.jpg`;
    const fileRef = ref(this.storage, filePath);
  
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
  
    await updateDoc(this.getUserDocRef(), { imageUrl: downloadURL });
    return downloadURL;
  }

  async getData() {
    const userDocRef = await this.getUserDocRef();
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User document not found');
    }
  }

  async getFname(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['fname'] : null;
  }

  async getLname(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['lname'] : null;
  }

  async getStrengths(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['strengths'] : null;
  }

  async getWeaknesses(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['weaknesses'] : null;
  }

  async getFreeTimes(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['freeTimes'] : null;
  }

  async getBio(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['bio'] : null;
  }

  async getClasses(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['classes'] : null;
  }

  async getImageURL(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['imageUrl'] : null;
  }

  
  
}
