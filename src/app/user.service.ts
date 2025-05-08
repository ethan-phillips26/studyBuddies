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

  async setClasses(classes: string[]) {
    await updateDoc(this.getUserDocRef(), { classes });
  }
  
  async setMatches(matches: string[]) {
    const userDocRef = this.getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    const existingMatches = userDoc.exists() ? userDoc.data()['matches'] || [] : [];
    const combinedMatches = [...existingMatches, ...matches];
    await updateDoc(userDocRef, { matches: combinedMatches });
  }

  async setOtherMatches(matches: string[], uid:string) {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);
    const existingMatches = userDoc.exists() ? userDoc.data()['matches'] || [] : [];
    const combinedMatches = [...existingMatches, ...matches];
    await updateDoc(userDocRef, { matches: combinedMatches });
  }
  
  async clearMatches() {
    const userDocRef = this.getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    await updateDoc(userDocRef, {matches: []});
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

  async getStreamKey(): Promise<string | null> {
    const userData = await this.getData();
    return userData ? userData['streamKey'] : null;
  }

  getUid() {
    return this.user?.uid;
  }

  // get other user's data
  private getOtherUserDocRef(uid: string) {
    return doc(this.firestore, `users/${uid}`);
  }

  async getOtherFname(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['fname'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherLname(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['lname'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherStrengths(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['strengths'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherWeaknesses(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['weaknesses'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherFreeTimes(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['freeTimes'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherBio(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['bio'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherClasses(uid: string): Promise<string[] | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['classes'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherImageURL(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['imageUrl'] : null;
    } else {
      throw new Error('User document not found');
    }
  }

  async getOtherStreamKey(uid: string): Promise<string | null> {
    const userDocRef = this.getOtherUserDocRef(uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData['streamKey'] : null;
    } else {
      throw new Error('User document not found');
    }
  }
  
  
}
