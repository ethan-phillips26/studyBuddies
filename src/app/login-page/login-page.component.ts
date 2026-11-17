import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private auth = inject(AuthService)

  signInWithGoogle() {
    this.auth.signIn();
  }
}
