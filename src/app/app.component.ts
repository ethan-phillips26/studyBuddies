import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoStateService } from './demo-page/demo-state.service';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from './auth.service';



@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoginPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'studyBuddies';
  @ViewChild('navbar', { static: true, read: ElementRef }) navbar!: ElementRef;
  @ViewChild('footer', { static: true, read: ElementRef }) footer!: ElementRef;

  navbarHeight: number = 0;
  footerHeight: number = 0;

 auth = inject(AuthService);
  // The demo pages work without signing in.
  isDemo = inject(DemoStateService).isDemoRoute;


  ngAfterViewInit() {
    this.navbarHeight = this.navbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;

    document.documentElement.style.setProperty(
      '--navbar-height',
      `${this.navbarHeight}px`
    );
    document.documentElement.style.setProperty(
      '--footer-height',
      `${this.footerHeight}px`
    );
  }
  
  loggedIn: boolean = this.auth.isLoggedIn$()
}
