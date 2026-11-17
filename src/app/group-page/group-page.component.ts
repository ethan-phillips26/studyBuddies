import { Component, inject, signal } from '@angular/core';
import { GroupsService } from '../groups.service';
import { FormsModule } from '@angular/forms';
import { Auth, getAuth } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { MessagingService } from '../messenging.service';
import { UserService } from '../user.service';
import { GroupCardComponent } from '../group-card/group-card.component';
import { formatClassCode } from '../match-card/match-card.component';
import { NDSU_COURSES } from '../demo-page/demo-data';

@Component({
  selector: 'app-group-page',
  imports: [FormsModule, RouterLink, GroupCardComponent],
  templateUrl: './group-page.component.html',
  styleUrl: './group-page.component.css'
})
export class GroupPageComponent {
  groups: any[] = []; // Stores all groups
  filteredGroups: any[] = []; // Stored groups filtered by search bar
  searchQuery: string = '';
  showJoined = signal(false); // "Joined" filter, replaces the old joined-groups modal
  showCreate = signal(false); // inline create form, replaces the old modal

  constructor(private groupsService: GroupsService) {}
  private userService = inject(UserService);

  message = inject(MessagingService);
  user = inject(UserService);

  ngOnInit() {
    // Grab groups from Firebase and store them in the array
    this.groupsService.getGroups().subscribe((data) => {
      this.groups = data;
      this.filterGroups(); // keep the current search applied when groups update live
    })
  }

  filterGroups() {
    this.filteredGroups = this.groups.filter(group =>
      group.class.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Groups shown on the page: the search result, optionally narrowed to ones you're in.
  get visibleGroups(): any[] {
    return this.showJoined()
      ? this.filteredGroups.filter((group) => this.isMember(group))
      : this.filteredGroups;
  }

  isMember(group: any): boolean {
    const uid = getAuth().currentUser?.uid; // same source joinGroup/leaveGroup use
    return !!uid && (group.group_members ?? []).includes(uid);
  }

  // NDSU course title for codes like "CSCI 161" / "csci161"; blank for anything else.
  courseTitle(cls: string): string {
    const code = formatClassCode(cls ?? '');
    return NDSU_COURSES.find((c) => c.code === code)?.title ?? '';
  }

  async joinGroup(groupId: string) {
    const auth: Auth = getAuth();
    const user = auth.currentUser;

  
    if (!user) {
      alert('You must be logged in to join a group.');
      return;
    }
  
    const userId = user.uid;
    const userName:string = ( await this.userService.getFname() || '') + ' ' + (await this.userService.getLname() || '');
  
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
      const memberCount = group['group_members'].length;
      if(memberCount >= group['max_members']) {
        alert('This group is full!');
        return;
      }
  
      // Update group_members array with logged-in user's ID
      const updatedMembers = [...group['group_members'], userId];
      this.groupsService.addGroupChannelMember(groupId);
      this.groupsService.updateGroup(groupId, { group_members: updatedMembers })
      const updatedNames = [...group['group_names'], userName];
      this.groupsService.updateGroup(groupId, { group_members: updatedMembers, group_names: updatedNames})
        .then(() => alert('You joined the group successfully!'))
        .catch(error => console.error('Error joining group:', error));
    });
  }

  async leaveGroup(groupId: string) {
    const auth: Auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to leave a group.');
      return;
    }

    const userId = user.uid;
    const userName:string = ( await this.userService.getFname() || '') + ' ' + (await this.userService.getLname() || '');

    // Grab the group document 
    this.groupsService.getGroup(groupId).then((group) => {
      if(!group) {
        alert('Group no longer exists!');
        console.error('Group not found');
        return;
      }

      // Check if the user is actually in the group
      if (!group['group_members'].includes(userId)) {
        alert('You are not a member of this group.');
        return;
      }


      // Remove user ID from `group_members` array
      const index:number = group['group_members'].indexOf(userId);
      group['group_names'].splice(index, 1);


      const updatedNames = group['group_names'];
      const updatedMembers = group['group_members'].filter((memberId: any) => memberId !== userId);
      if (updatedMembers.length == 0) {
        const confirmDelete = confirm('Are you sure you want to leave this group? The group will be deleted.');
    
        if (!confirmDelete) {
          alert('Leave group cancelled.')
          return;
        }
        this.groupsService.deleteGroup(groupId)
        .then(() => alert('You left the group successfully!'))
        .catch(error => console.error('Error deleting group: ', error));
        return;
      }

      // Remove user from channel
      this.groupsService.leaveGroup(groupId)

      this.groupsService.updateGroup(groupId, { group_members: updatedMembers, group_names: updatedNames })
        .then(() => alert('You left the group successfully!'))
        .catch(error => console.error('Error leaving groups: ', error));
    });
  }
  
  async createGroup() {
    // Retrieve input values from the modal form 
    const groupName = (document.getElementById('groupName') as HTMLInputElement).value;
    const className = (document.getElementById('class') as HTMLInputElement).value;
    const studyContent = (document.getElementById('studyContent') as HTMLInputElement).value;
    const maxMembers = (document.getElementById('maxMembers') as HTMLInputElement).value;
    const meetingLocation = (document.getElementById('meetingLocation') as HTMLInputElement).value;
    const meetingFrequency = (document.getElementById('meetingFrequency') as HTMLSelectElement).value;
    const meetingTimes = (document.getElementById('meetingTimes') as HTMLTextAreaElement).value;
    
    if (
      groupName.replace(' ', '')         == '' ||
      className.replace(' ', '')         == '' ||
      studyContent.replace(' ', '')      == '' ||
      maxMembers                         == '' ||
      meetingLocation.replace(' ', '')   == '' ||
      meetingFrequency.replace(' ', '')  == '' ||
      meetingTimes.replace(' ', '')      == ''
    ) {
      alert('You must fill all fields.');
      return;
    }
    if (
      Number(maxMembers) < 2
    ) {
      alert('Max number of members must be at least 2');
      return;
    }

    const auth: Auth = getAuth();
    const user = auth.currentUser;


    if (!user) {
      alert('You must be logged in to leave a group.');
      return;
    }

    const userId = user.uid;
    let groupLeader:string[] = [];
    groupLeader.push(userId);
    let groupLeaderName:string[] = [];
    groupLeaderName.push(( await this.userService.getFname() || '') + ' ' + (await this.userService.getLname() || ''))


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
      group_names: groupLeaderName, // Empty array to hold names
      createdAt: new Date(),
    }

    // Save the new group to Firebase 
    this.groupsService.addGroup(groupData)
      .then(() => {
        alert('Group created successfully!');
        this.clearForm(); // Clears the form after successful submission
        this.showCreate.set(false);
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
