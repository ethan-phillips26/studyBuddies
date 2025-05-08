import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-page',
  imports: [FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  isEditing: boolean = false;

  fname: string = '';
  lname: string = '';
  strengths: string = '';
  weaknesses: string = '';
  freeTimes: string = '';
  classes: string = '';
  bio: string = '';
  currentFname: string = '';
  currentLname: string = '';
  currentStrengths: string = '';
  currentWeaknesses: string = '';
  currentBio: string = '';
  currentFreeTimes = '';
  currentClasses: string = '';
  currentImageURL: string = '';

  private user = inject(UserService);

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if(this.isEditing) {
      this.applyUserData();
    } else {
      this.save()
    }
  }

  async ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.currentFname = (await this.user.getFname()) || '';
    this.currentLname = (await this.user.getLname()) || '';
    this.currentStrengths = (await this.user.getStrengths()) || '';
    this.currentWeaknesses = (await this.user.getWeaknesses()) || '';
    this.currentBio = (await this.user.getBio()) || '';
    this.currentFreeTimes = (await this.user.getFreeTimes()) || '';
    this.currentClasses = (await this.user.getClasses()) || '';
    this.currentImageURL = (await this.user.getImageURL()) || '';

    if (this.imagePreview == null) {
      this.imagePreview = this.currentImageURL;
    }
  }
  async applyUserData() {
    this.fname = this.currentFname;
    this.lname = this.currentLname;
    this.strengths = this.currentStrengths;
    this.weaknesses = this.currentWeaknesses;
    this.bio = this.currentBio;
    this.freeTimes = this.currentFreeTimes;
    this.classes = this.currentClasses;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
      this.selectedFile = null;
    }
  }

  async save() {
    try {
      if (this.selectedFile) {
        await this.user.uploadProfileImage(this.selectedFile);
      }
      await this.user.setFname(this.fname);
      await this.user.setLname(this.lname);
      await this.user.setStrengths(this.strengths);
      await this.user.setWeaknesses(this.weaknesses);
      await this.user.setFreeTimes(this.freeTimes);
      const formattedClasses = this.classes
        .split(',')
        .map((cls) => cls.trim().toLowerCase().replace(/\s+/g, ''));

      await this.user.setClasses(formattedClasses);

      await this.user.setBio(this.bio);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }
}
