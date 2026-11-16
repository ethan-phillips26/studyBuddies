import { Component, HostListener, input, output } from '@angular/core';

export interface MatchCardClass {
  code: string; // display form, e.g. "CSCI 161"
  title?: string;
  shared: boolean;
}

/** Turns stored class ids like "csci161" into "CSCI 161". */
export function formatClassCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/^([A-Z]+)\s*(\d)/, '$1 $2');
}

// The profile card shown on the Match page, with Skip / Like actions.
// Used by both the real matching page and the demo.
@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrl: './match-card.component.css',
})
export class MatchCardComponent {
  name = input.required<string>();
  subtitle = input<string>('');
  imageUrl = input<string>('');
  initials = input<string>('');
  color = input<string>('#005643');
  bio = input<string>('');
  strengths = input<string>('');
  weaknesses = input<string>('');
  freeTimes = input<string>('');
  classes = input<MatchCardClass[]>([]);

  like = output<void>();
  skip = output<void>();

  // Arrow keys mirror the buttons, unless the user is typing somewhere.
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight') this.like.emit();
    if (e.key === 'ArrowLeft') this.skip.emit();
  }
}
