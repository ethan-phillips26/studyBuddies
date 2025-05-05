import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//define match information
export interface Match {
  name: string;
  interest: string;
}
@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private apiUrl = 'http://127.0.0.1:8000/api/matches/'; //api url, change when deployed. Currently local.

  constructor(private http: HttpClient) {}

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }
}
