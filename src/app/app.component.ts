import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoginPageComponent } from './login-page/login-page.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoginPageComponent,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'studyBuddies';
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('footer', { static: true }) footer!: ElementRef;

  navbarHeight: number = 0;
  footerHeight: number = 0;

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
}
