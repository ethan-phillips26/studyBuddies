import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService, Match } from '../match.service';

@Component({
  selector: 'app-matching-page',
  standalone: true,
  imports: [CommonModule],
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
        console.log('Fetched matches:', data);
      },
      error: (error) => {
        console.error('Error fetching matches', error);
      }
    });
  }
}
