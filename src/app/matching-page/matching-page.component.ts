import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessagingService } from '../messenging.service';

@Component({
  selector: 'app-matching-page',
  templateUrl: './matching-page.component.html',
  styleUrls: ['./matching-page.component.css'],
})
export class MatchingPageComponent implements OnInit {
  matches: string[] = [];
  user = inject(UserService);
  private apiUrl = 'http://127.0.0.1:8000/match/';
  http = inject(HttpClient);
  message = inject(MessagingService);

  firstname: string = '';
  lastname: string = '';
  bio: string = '';
  strengths: string = '';
  weaknesses: string = '';
  classes: string[] = [''];
  freeTimes: string = '';
  imageUrl: string = '';
  currentUserIndex: number = 0;

  currentMatches = signal(false);
  profileComplete = signal(false);

  async ngOnInit() {
    const uid = this.user.getUid();
    if (uid) {
      this.getStudyPartners(uid).subscribe((response: any) => {
        console.log('Matching Users:', response);
        this.matches = response;

        if (this.matches.length >= 1) {
          this.currentMatches.set(true);
          this.getUserData(this.matches[this.currentUserIndex]);
        } else {
          this.currentMatches.set(false);
        }
      });
    }

    this.profileComplete.set(await this.checkProfileCompleteness());
  }

  async checkProfileCompleteness() {
    const fname = await this.user.getFname();
    const lname = await this.user.getLname();
    const strengths = await this.user.getStrengths();
    const weaknesses = await this.user.getWeaknesses();
    const bio = await this.user.getBio();
    const imageUrl = await this.user.getImageURL();
    const classes = await this.user.getClasses();
    const freeTimes = await this.user.getFreeTimes();

    if(fname == "" || lname == "" || strengths == "" || weaknesses == "" || bio == "" || imageUrl == "" || classes == "" || freeTimes == "") {
      return false;
    } else {
      return true;
    }
  }

  async like() {
    const uid = await this.user.getUid();
    const fname = await this.user.getFname();
    const streamKey = await this.user.getStreamKey();
    
    if (uid && fname && streamKey) {
      this.message.initChat(uid, this.matches[this.currentUserIndex], fname, this.firstname, streamKey);
      
      this.user.setMatches([this.matches[this.currentUserIndex]]);
      
      if (this.matches.length > this.currentUserIndex + 1) {
        this.currentUserIndex++;
        this.getNextMatch(this.currentUserIndex);
      } else {
        this.currentMatches.set(false);
      }
  
      alert(
        `${this.firstname} ${this.lastname} has been liked! Go to the Message page to chat with them!`
      );
    } else {
      console.error("Error: Unable to get user details.");
    }
  }
  
  dislike() {
    if (this.matches.length > this.currentUserIndex + 1) {
      this.currentUserIndex++;
      this.getNextMatch(this.currentUserIndex);
    } else {
      this.currentMatches.set(false);
    }
  }

  getNextMatch(index: number) {
    this.getUserData(this.matches[index]);
  }

  async getUserData(uid: string) {
    this.firstname = (await this.user.getOtherFname(uid)) || '';
    this.lastname = (await this.user.getOtherLname(uid)) || '';
    this.strengths = (await this.user.getOtherStrengths(uid)) || '';
    this.weaknesses = (await this.user.getOtherWeaknesses(uid)) || '';
    this.bio = (await this.user.getOtherBio(uid)) || '';
    this.freeTimes = (await this.user.getOtherFreeTimes(uid)) || '';
    const result = await this.user.getOtherClasses(uid);
    this.classes = Array.isArray(result) ? result : [];
    this.imageUrl = (await this.user.getOtherImageURL(uid)) || '';
  }

  getStudyPartners(uid: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { uid: uid },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
