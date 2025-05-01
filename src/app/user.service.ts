import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Firestore
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  constructor() {
    const currentUser = this.authService.user$;
    const uid = currentUser()?.uid;
    const name = currentUser()?.displayName;

  }

  

}
