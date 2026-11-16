import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';
import { DemoStateService } from '../demo-page/demo-state.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private auth = inject(AuthService);

  // In demo mode the same buttons point at the /demo pages.
  isDemo = inject(DemoStateService).isDemoRoute;
  link(path: string) {
    return this.isDemo() ? '/demo' + (path ? '/' + path : '') : '/' + path;
  }

  // Page links only make sense once signed in (or inside the demo).
  showLinks = computed(() => this.isDemo() || this.auth.isLoggedIn$());

  signOut() {
    this.auth.signOut();
  }
}
