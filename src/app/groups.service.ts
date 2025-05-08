import { createEnvironmentInjector, inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { MessagingService } from './messenging.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private firestore = inject(Firestore);
  private groupsCollection = collection(this.firestore, 'Groups'); // Reference to "Groups" collection 
  message = inject(MessagingService);
  user = inject(UserService);

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
    createdAt: Date;
  }) {
  
    await addDoc(this.groupsCollection, groupData);
    this.message.createGroupChannel(this.user.getUid() || '', groupData.group_name, groupData['createdAt'].toISOString().replace(/[^a-zA-Z0-9]/g, ''));

  }

  // Update a group 
  async updateGroup(groupId: string, updateData: any) {
    const groupDocRef = doc(this.firestore, `Groups/${groupId}`);
    return await updateDoc(groupDocRef, updateData);
  }

  // Delete a group 
  async deleteGroup(groupId: string) {
    
      const groupData = await this.getGroup(groupId);
  
      if (groupData) {
        const createdAtString = (groupData['createdAt']).toDate().toISOString().replace(/[^a-zA-Z0-9]/g, '');
        const channelId = (groupData['group_name'] + createdAtString).replace(/\s+/g, '');
  
        await this.message.deleteChannel(channelId);
  
        const groupDocRef = doc(this.firestore, `Groups/${groupId}`);
        await deleteDoc(groupDocRef);
  
        console.log('Group deleted');
      } else {
        console.error('Group not found');
      
    }
  }

  // Leave a group
  async leaveGroup(groupId: string) {
    const groupData = await this.getGroup(groupId);
  
    if (groupData) {
      const createdAtString = groupData['createdAt'].toDate().toISOString().replace(/[^a-zA-Z0-9]/g, '');
      const channelId = (groupData['group_name'] + createdAtString).replace(/\s+/g, '');
      const userId = this.user.getUid();
  
     
        await this.message.removeGroupChannelMember(userId || '', channelId);
    } else {
      console.error('Group not found');
    }
  }

  async addGroupChannelMember(groupId: string) {
    const groupData = await this.getGroup(groupId);
  
    if (groupData) {
      const createdAtString = groupData['createdAt'].toDate().toISOString().replace(/[^a-zA-Z0-9]/g, '');
      const channelId = (groupData['group_name'] + createdAtString).replace(/\s+/g, '');
      const userId = this.user.getUid();
  
     
        await this.message.addGroupChannelMember(userId || '', channelId);
    } else {
      console.error('Group not found');
    }
  }
  
  
}
