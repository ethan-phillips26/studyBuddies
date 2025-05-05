import { Component, OnInit } from '@angular/core';
import { MatchService, Match } from '../match.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@Component({
  selector: 'app-matching-page',
  imports: [],
  templateUrl: './matching-page.component.html',
  styleUrl: './matching-page.component.css'
})
export class MatchingPageComponent implements OnInit {
  matches: Match[] = [];

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
      },
      error: (error) => {
        console.error('Error fetching matches', error);
      },
      complete: () => {
        console.log('Data fetching complete');
      }
    });
  }


  firstname:string = '';
  lastname:string = '';
  bio: string = '';
  strengths: string = '';
  weaknesses: string = '';
  classes: string = '';
  freeTimes: string = '';

}
