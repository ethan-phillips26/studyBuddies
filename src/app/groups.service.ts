import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private firestore = inject(Firestore);
  private groupsCollection = collection(this.firestore, 'Groups'); // Reference to "Groups" collection 

  // Get all groups 
  getGroups(): Observable<any[]> {
    return collectionData(this.groupsCollection, { idField: 'id' });
  }

  // Get a single group by ID
  async getGroup(groupId: string) {
    const groupDocRef = doc(this.firestore, `Groups/${groupId}`);
    const groupDoc = await getDoc(groupDocRef);
    return groupDoc.exists() ? groupDoc.data() : null;
  }

  // Add a new group
  async addGroup(groupData: {
    group_name: string; 
    class: string; 
    study_content: string; 
    max_members: number; 
    meeting_location: string; 
    meeting_frequency: string; 
    meeting_times: string; 
    group_members: string[];
  }) {
    return await addDoc(this.groupsCollection, groupData);
  }

  // Update a group 
  async updateGroup(groupId: string, updateData: any) {
    const groupDocRef = doc(this.firestore, `Groups/${groupId}`);
    return await updateDoc(groupDocRef, updateData);
  }

  // Update a group 
  async deleteGroup(groupId: string) {
    const groupDocRef = doc(this.firestore, `Groups/${groupId}`);
    return await deleteDoc(groupDocRef);
  }
}
