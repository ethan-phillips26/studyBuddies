import { Component, computed, input, output } from '@angular/core';

// One study group as shown on the Group up page. Used by the real page and the demo.
@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css',
})
export class GroupCardComponent {
  name = input.required<string>();
  classCode = input<string>('');
  courseTitle = input<string>('');
  about = input<string>('');
  location = input<string>('');
  times = input<string>('');
  frequency = input<string>('');
  members = input<string[]>([]);
  maxMembers = input<number>(0);
  isMember = input<boolean>(false);

  join = output<void>();
  leave = output<void>();

  isFull = computed(() => this.maxMembers() > 0 && this.members().length >= this.maxMembers());
}
