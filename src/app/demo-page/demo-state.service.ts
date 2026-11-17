import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  DEMO_GROUPS,
  DEMO_ME,
  DEMO_REPLIES,
  DEMO_STARTING_CHATS,
  DEMO_STUDENTS,
  DemoGroup,
  DemoMessage,
  DemoStudent,
  NDSU_COURSES,
} from './demo-data';

// Holds all demo state so it survives moving between demo pages.
// Nothing is read from or written to Firebase or the backend.
@Injectable({ providedIn: 'root' })
export class DemoStateService {
  private router = inject(Router);

  /** True while the current URL is under /demo. */
  isDemoRoute = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => /^\/demo(\/|$|\?)/.test((e as NavigationEnd).urlAfterRedirects)),
    ),
    { initialValue: /\/demo(\/|$)/.test(location.pathname) },
  );

  readonly courses = NDSU_COURSES;
  readonly students = DEMO_STUDENTS;

  toast = signal('');

  me = signal<DemoStudent>({ ...DEMO_ME, classes: [...DEMO_ME.classes] });
  seen = signal<Set<string>>(new Set(Object.keys(DEMO_STARTING_CHATS)));
  matched = signal<string[]>(Object.keys(DEMO_STARTING_CHATS));
  chats = signal<Record<string, DemoMessage[]>>(structuredClone(DEMO_STARTING_CHATS));
  activeChat = signal<string>(Object.keys(DEMO_STARTING_CHATS)[0] ?? '');

  groups = signal<DemoGroup[]>(structuredClone(DEMO_GROUPS));

  // Same rule as the backend: anyone sharing at least one class you haven't swiped on yet.
  candidates = computed(() => {
    const mine = new Set(this.me().classes);
    const seen = this.seen();
    return this.students.filter((s) => !seen.has(s.id) && s.classes.some((c) => mine.has(c)));
  });
  current = computed(() => this.candidates()[0] ?? null);
  myName = computed(() => `${this.me().fname} ${this.me().lname}`);

  student(id: string) {
    return this.students.find((s) => s.id === id)!;
  }

  initials(s: { fname: string; lname: string }) {
    return (s.fname[0] ?? '') + (s.lname[0] ?? '');
  }

  courseTitle(code: string) {
    return this.courses.find((c) => c.code === code)?.title ?? '';
  }

  isShared(code: string) {
    return this.me().classes.includes(code);
  }

  flash(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast() === msg && this.toast.set(''), 2800);
  }

  private markSeen(id: string) {
    this.seen.update((s) => new Set(s).add(id));
  }

  // --- Match ---
  like() {
    const s = this.current();
    if (!s) return;
    this.markSeen(s.id);
    // After a history clear you can like someone again; keep the existing chat.
    if (this.matched().includes(s.id)) {
      this.flash(`You're already matched with ${s.fname}.`);
      return;
    }
    this.matched.update((m) => [...m, s.id]);
    const shared = s.classes.filter((c) => this.isShared(c));
    this.chats.update((c) => ({
      ...c,
      [s.id]: [
        {
          from: 'them',
          text: `Hey ${this.me().fname}! Looks like we're both in ${shared[0]}. Want to study sometime?`,
          time: this.now(),
        },
      ],
    }));
    if (!this.activeChat()) this.activeChat.set(s.id);
    this.flash(`You matched with ${s.fname}! Go to the Message page to chat with them.`);
  }

  dislike() {
    const s = this.current();
    if (s) this.markSeen(s.id);
  }

  // Same as the real app: wipe the swipe history so everyone (liked or skipped)
  // shows up again. Existing chats are kept, like the real messenger.
  resetMatches() {
    this.seen.set(new Set());
    this.flash('Match history cleared.');
  }

  // --- Groups ---
  isMember(g: DemoGroup) {
    return g.group_names.includes(this.myName());
  }

  joinGroup(g: DemoGroup) {
    if (this.isMember(g)) return;
    if (g.group_names.length >= g.max_members) {
      this.flash('This group is full!');
      return;
    }
    this.updateGroup(g.id, { group_names: [...g.group_names, this.myName()] });
    this.flash(`You joined ${g.group_name}.`);
  }

  leaveGroup(g: DemoGroup) {
    const names = g.group_names.filter((n) => n !== this.myName());
    if (names.length === 0) {
      this.groups.update((gs) => gs.filter((x) => x.id !== g.id));
      this.flash(`You left ${g.group_name}. It had no members left, so it was deleted.`);
      return;
    }
    this.updateGroup(g.id, { group_names: names });
    this.flash(`You left ${g.group_name}.`);
  }

  /** Returns true if the group was created. */
  createGroup(g: DemoGroup): boolean {
    if (!g.group_name.trim() || !g.class || !g.study_content.trim() || !g.meeting_location.trim() || !g.meeting_times.trim()) {
      this.flash('Fill out every field to create a group.');
      return false;
    }
    if (g.max_members < 2) {
      this.flash('Max members must be at least 2.');
      return false;
    }
    this.groups.update((gs) => [{ ...g, id: 'g' + Date.now(), group_names: [this.myName()] }, ...gs]);
    this.flash('Group created!');
    return true;
  }

  private updateGroup(id: string, patch: Partial<DemoGroup>) {
    this.groups.update((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  // --- Messages ---
  send(text: string) {
    const id = this.activeChat();
    text = text.trim();
    if (!id || !text) return;
    this.pushMessage(id, { from: 'me', text, time: this.now() });
    setTimeout(() => {
      const reply = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
      this.pushMessage(id, { from: 'them', text: reply, time: this.now() });
    }, 1200);
  }

  lastMessage(id: string) {
    const msgs = this.chats()[id] ?? [];
    return msgs[msgs.length - 1]?.text ?? '';
  }

  private pushMessage(id: string, m: DemoMessage) {
    this.chats.update((c) => ({ ...c, [id]: [...(c[id] ?? []), m] }));
  }

  private now() {
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // --- Profile ---
  /** Saves profile edits. Returns false (and explains) if something required is missing. */
  saveProfile(next: DemoStudent): boolean {
    const fname = next.fname.trim();
    const lname = next.lname.trim();
    if (!fname || !lname) {
      this.flash('First and last name are required.');
      return false;
    }
    if (next.classes.length === 0) {
      this.flash('Pick at least one class so you can be matched.');
      return false;
    }
    const oldName = this.myName();
    const newName = `${fname} ${lname}`;
    // Group rosters store display names, so carry a rename over to them.
    if (newName !== oldName) {
      this.groups.update((gs) =>
        gs.map((g) => ({ ...g, group_names: g.group_names.map((n) => (n === oldName ? newName : n)) })),
      );
    }
    this.me.set({
      ...next,
      fname,
      lname,
      bio: next.bio.trim(),
      strengths: next.strengths.trim(),
      weaknesses: next.weaknesses.trim(),
      freeTimes: next.freeTimes.trim(),
      classes: [...next.classes],
    });
    this.flash('Profile saved.');
    return true;
  }
}
