import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private auth = inject(AuthService)

  signInWithGoogle() {
    this.auth.signIn();
  }
}
