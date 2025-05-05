import { Component } from '@angular/core';

@Component({
  selector: 'app-matching-page',
  imports: [],
  templateUrl: './matching-page.component.html',
  styleUrl: './matching-page.component.css'
})
export class MatchingPageComponent {


  firstname:string = '';
  lastname:string = '';
  bio: string = '';
  strengths: string = '';
  weaknesses: string = '';
  classes: string = '';
  freeTimes: string = '';

}
