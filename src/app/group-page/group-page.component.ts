import { Component, inject } from '@angular/core';
import { GroupsService } from '../groups.service';
import { FormsModule } from '@angular/forms';
import { Auth, getAuth } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { MessagingService } from '../messenging.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-group-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './group-page.component.html',
  styleUrl: './group-page.component.css'
})
export class GroupPageComponent {
  groups: any[] = []; // Stores all groups
  joinedGroups: any[] = []; // Stores only the groups the user has joined
  filteredGroups: any[] = []; // Stored groups filtered by search bar
  searchQuery: string = '';

  constructor(private groupsService: GroupsService) {}

  message = inject(MessagingService);
  user = inject(UserService);

  ngOnInit() {
    // Grab groups from Firebase and store them in the array
    this.groupsService.getGroups().subscribe((data) => {
      this.groups = data;
      this.filteredGroups = data; // Initialize filtered list
    })
  }

  filterGroups() {
    this.filteredGroups = this.groups.filter(group =>
      group.class.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  joinGroup(groupId: string) {
    const auth: Auth = getAuth();
    const user = auth.currentUser;

  
    if (!user) {
      alert('You must be logged in to join a group.');
      return;
    }
  
    const userId = user.uid;
  
    // Grab the group document
    this.groupsService.getGroup(groupId).then((group) => {
      if (!group) {
        console.error('Group not found');
        return;
      }
  
      // Check if user is already in the group
      if (group['group_members'].includes(userId)) {
        alert('You are already a member of this group!');
        return;
      }
  
      // Update group_members array with logged-in user's ID
      const updatedMembers = [...group['group_members'], userId];
      this.message.addGroupChannelMember(this.user.getUid() || '', group['group_members'][0], group['group_name'].replace(/\s+/g, ''))
  
      this.groupsService.updateGroup(groupId, { group_members: updatedMembers })
        .then(() => alert('You joined the group successfully!'))
        .catch(error => console.error('Error joining group:', error));
    });
  }

  viewJoinedGroups() {
    const auth: Auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to view your joined groups.');
      return;
    }

    const userId = user.uid;

    // Grab groups where the `group_members` array includes the user's ID
    this.joinedGroups = this.groups.filter(group => group.group_members.includes(userId));
  }

  leaveGroup(groupId: string) {
    const auth: Auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to leave a group.');
      return;
    }

    const userId = user.uid;

    // Grab the group document 
    this.groupsService.getGroup(groupId).then((group) => {
      if(!group) {
        console.error('Group not found');
        return;
      }

      // Check if the user is actually in the group
      if (!group['group_members'].includes(userId)) {
        alert('You are not a member of this group.');
        return;
      }

      // Remove user ID from `group_members` array
      const updatedMembers = group['group_members'].filter((memberId: any) => memberId !== userId);

      this.groupsService.updateGroup(groupId, { group_members: updatedMembers })
        .then(() => alert('You left the group successfully!'))
        .catch(error => console.error('Error leaving groups: ', error));
    });
  }
  
  createGroup() {
    // Retrieve input values from the modal form 
    const groupName = (document.getElementById('groupName') as HTMLInputElement).value;
    const className = (document.getElementById('class') as HTMLInputElement).value;
    const studyContent = (document.getElementById('studyContent') as HTMLInputElement).value;
    const maxMembers = (document.getElementById('maxMembers') as HTMLInputElement).value;
    const meetingLocation = (document.getElementById('meetingLocation') as HTMLInputElement).value;
    const meetingFrequency = (document.getElementById('meetingFrequency') as HTMLSelectElement).value;
    const meetingTimes = (document.getElementById('meetingTimes') as HTMLTextAreaElement).value;
    
    const auth: Auth = getAuth();
    const user = auth.currentUser;


    if (!user) {
      alert('You must be logged in to leave a group.');
      return;
    }

    const userId = user.uid;
    let groupLeader:string[] = [];
    groupLeader.push(userId);

    // Build the group object with Firebase field names
    const groupData = {
      group_name: groupName,
      class: className,
      study_content: studyContent,
      max_members: Number(maxMembers),
      meeting_location: meetingLocation,
      meeting_frequency: meetingFrequency,
      meeting_times: meetingTimes,
      group_members: groupLeader, // Array that holds initially just the group creator
      createdAt: new Date(),
    }

    // Save the new group to Firebase 
    this.groupsService.addGroup(groupData)
      .then(() => {
        alert('Group created successfully!');
        this.clearForm(); // Clears the form after successful submission
      })
      .catch(error => console.error('Error creating group:', error));
    
  }

  clearForm() {
    (document.getElementById('groupName') as HTMLInputElement).value = '';
    (document.getElementById('class') as HTMLInputElement).value = '';
    (document.getElementById('studyContent') as HTMLInputElement).value = '';
    (document.getElementById('maxMembers') as HTMLInputElement).value = '';
    (document.getElementById('meetingLocation') as HTMLInputElement).value = '';
    (document.getElementById('meetingFrequency') as HTMLSelectElement).value = '';
    (document.getElementById('meetingTimes') as HTMLTextAreaElement).value = '';
  }


}
