import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DemoGroup, DemoStudent } from './demo-data';
import { DemoStateService } from './demo-state.service';
import { MatchCardClass, MatchCardComponent } from '../match-card/match-card.component';
import { GroupCardComponent } from '../group-card/group-card.component';

export type DemoTab = 'match' | 'group' | 'message' | 'profile';

// One component for every /demo route; the route's data.tab picks the page.
// The real navbar handles moving between them.
@Component({
  selector: 'app-demo-page',
  imports: [FormsModule, RouterLink, MatchCardComponent, GroupCardComponent],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.css',
})
export class DemoPageComponent {
  demo = inject(DemoStateService);
  private route = inject(ActivatedRoute);

  tab = toSignal(this.route.data.pipe(map((d) => (d['tab'] ?? 'match') as DemoTab)), {
    initialValue: 'match' as DemoTab,
  });

  groupSearch = signal('');
  showCreate = signal(false);
  newGroup = this.blankGroup();
  draft = '';

  // Profile editing mirrors the real page: Edit, change fields, Save.
  editing = signal(false);
  form: DemoStudent = this.demo.me();

  showJoined = signal(false);

  filteredGroups = computed(() => {
    const q = this.groupSearch().toLowerCase().replace(/\s+/g, '');
    return this.demo.groups().filter(
      (g) =>
        (!this.showJoined() || this.demo.isMember(g)) &&
        (g.class + g.group_name).toLowerCase().replace(/\s+/g, '').includes(q),
    );
  });

  cardClasses(codes: string[]): MatchCardClass[] {
    return codes.map((code) => ({
      code,
      title: this.demo.courseTitle(code),
      shared: this.demo.isShared(code),
    }));
  }

  createGroup() {
    if (this.demo.createGroup(this.newGroup)) {
      this.newGroup = this.blankGroup();
      this.showCreate.set(false);
    }
  }

  send() {
    this.demo.send(this.draft);
    this.draft = '';
  }

  startEdit() {
    this.form = { ...this.demo.me(), classes: [...this.demo.me().classes] };
    this.editing.set(true);
  }

  cancelEdit() {
    this.editing.set(false);
  }

  saveEdit() {
    if (this.demo.saveProfile(this.form)) this.editing.set(false);
  }

  toggleFormClass(code: string) {
    const c = this.form.classes;
    this.form.classes = c.includes(code) ? c.filter((x) => x !== code) : [...c, code];
  }

  // Photo stays in the browser as a data URL; nothing is uploaded.
  onPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => (this.form = { ...this.form, imageUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  private blankGroup(): DemoGroup {
    return {
      id: '', group_name: '', class: '', study_content: '', max_members: 4,
      meeting_location: '', meeting_frequency: 'Weekly', meeting_times: '', group_names: [],
    };
  }
}
