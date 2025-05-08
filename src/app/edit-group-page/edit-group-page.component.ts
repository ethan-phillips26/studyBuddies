import { Component } from '@angular/core';
import { GroupsService } from '../groups.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-group-page',
  imports: [RouterLink],
  templateUrl: './edit-group-page.component.html',
  styleUrl: './edit-group-page.component.css'
})
export class EditGroupPageComponent {
  createdGroups: any[] = []; // Stored groups filtered by search bar
  selectedGroup: any = null; // Stores the selected group for editing

  constructor(private groupsService: GroupsService) {}

  ngOnInit() {
    const auth: Auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to view your groups.');
      return;
    }

    const userId = user.uid;
    // Grab groups from Firebase and store them in the array
    this.groupsService.getGroups().subscribe((data) => {
      this.createdGroups = data.filter(group => group.group_members[0] === userId);    
    })
  }

  deleteGroup(groupId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this group?');
    
    if (!confirmDelete) return;

    this.groupsService.deleteGroup(groupId)
      .then(() => alert('Group deleted successfully'))
      .catch(error => console.error('Error deleting group: ', error));
  }

  openEditModal(group: any) {
    this.selectedGroup = { ...group };

    (document.getElementById('groupName') as HTMLInputElement).value = this.selectedGroup.group_name;
    (document.getElementById('class') as HTMLInputElement).value = this.selectedGroup.class;
    (document.getElementById('studyContent') as HTMLInputElement).value = this.selectedGroup.study_content;
    (document.getElementById('maxMembers') as HTMLInputElement).value = String(this.selectedGroup.max_members);
    (document.getElementById('meetingLocation') as HTMLInputElement).value = this.selectedGroup.meeting_location;
    (document.getElementById('meetingFrequency') as HTMLSelectElement).value = this.selectedGroup.meeting_frequency;
    (document.getElementById('meetingTimes') as HTMLTextAreaElement).value = this.selectedGroup.meeting_times;
  }

  updateGroup() {
    if (!this.selectedGroup) return;

    // Get updated values from the modal
    this.selectedGroup.group_name = (document.getElementById('groupName') as HTMLInputElement).value;
    this.selectedGroup.class = (document.getElementById('class') as HTMLInputElement).value;
    this.selectedGroup.study_content = (document.getElementById('studyContent') as HTMLInputElement).value;
    this.selectedGroup.max_members = Number((document.getElementById('maxMembers') as HTMLInputElement).value);
    this.selectedGroup.meeting_location = (document.getElementById('meetingLocation') as HTMLInputElement).value;
    this.selectedGroup.meeting_frequency = (document.getElementById('meetingFrequency') as HTMLSelectElement).value;
    this.selectedGroup.meeting_times = (document.getElementById('meetingTimes') as HTMLTextAreaElement).value;

    this.groupsService.updateGroup(this.selectedGroup.id, this.selectedGroup)
    .then(() => {
      alert('Group updated successfully!');
      this.selectedGroup = null; // ✅ Reset after saving
    })
    .catch(error => console.error('Error updating group:', error));
  }
}
