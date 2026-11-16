// Fake data for the /demo page. Nothing here touches Firebase.
// Course codes and titles come from the NDSU course catalog
// (https://catalog.ndsu.edu/course-catalog/descriptions/csci/) and the
// Computer Science B.S. curriculum page.

export interface Course {
  code: string;
  title: string;
  credits: number;
}

export interface DemoStudent {
  id: string;
  fname: string;
  lname: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  major: string;
  bio: string;
  strengths: string;
  weaknesses: string;
  freeTimes: string;
  classes: string[]; // course codes, e.g. "CSCI 161"
  color: string; // avatar background
  imageUrl?: string; // demo user only: local preview of a picked photo
}

export interface DemoGroup {
  id: string;
  group_name: string;
  class: string;
  study_content: string;
  max_members: number;
  meeting_location: string;
  meeting_frequency: string;
  meeting_times: string;
  group_names: string[];
}

export interface DemoMessage {
  from: 'me' | 'them';
  text: string;
  time: string;
}

export const NDSU_COURSES: Course[] = [
  { code: 'CSCI 160', title: 'Computer Science I', credits: 4 },
  { code: 'CSCI 161', title: 'Computer Science II', credits: 4 },
  { code: 'CSCI 213', title: 'Modern Software Development With AI Tools', credits: 3 },
  { code: 'CSCI 222', title: 'Discrete Mathematics', credits: 3 },
  { code: 'CSCI 277', title: 'Introduction to UNIX', credits: 3 },
  { code: 'CSCI 313', title: 'Software Development with Frameworks', credits: 3 },
  { code: 'CSCI 336', title: 'Theoretical Computer Science', credits: 3 },
  { code: 'CSCI 366', title: 'Database Systems', credits: 3 },
  { code: 'CSCI 372', title: 'Comparative Programming Languages', credits: 3 },
  { code: 'CSCI 445', title: 'Software Projects Capstone', credits: 3 },
  { code: 'CSCI 455', title: 'Networking and Parallel Computation', credits: 3 },
  { code: 'MATH 165', title: 'Calculus I', credits: 4 },
  { code: 'MATH 166', title: 'Calculus II', credits: 4 },
  { code: 'STAT 367', title: 'Probability', credits: 3 },
];

export const DEMO_ME: DemoStudent = {
  id: 'me',
  fname: 'Jordan',
  lname: 'Reyes',
  year: 'Sophomore',
  major: 'Computer Science',
  bio: 'Sophomore in CS from Moorhead. I like building small web apps and I am trying to get better at proofs.',
  strengths: 'Java, debugging, explaining code out loud',
  weaknesses: 'Induction proofs, anything with pointers',
  freeTimes: 'Mon/Wed after 3pm, Sunday afternoons',
  classes: ['CSCI 161', 'CSCI 222', 'CSCI 277', 'MATH 166'],
  color: '#005643',
};

export const DEMO_STUDENTS: DemoStudent[] = [
  {
    id: 's1', fname: 'Maya', lname: 'Lindqvist', year: 'Sophomore', major: 'Computer Science',
    bio: 'Grew up in Bismarck. Usually at the library 2nd floor with way too much coffee.',
    strengths: 'Discrete math, set theory, writing clean proofs',
    weaknesses: 'Recursion in Java, time management',
    freeTimes: 'Tue/Thu 1-5pm, Saturday mornings',
    classes: ['CSCI 222', 'CSCI 161', 'MATH 166'], color: '#2b6cb0',
  },
  {
    id: 's2', fname: 'Tyler', lname: 'Okafor', year: 'Freshman', major: 'Computer Science',
    bio: 'First year, came in with some Python. Looking for people to grind CSCI 160 labs with.',
    strengths: 'Python, picking up new tools fast',
    weaknesses: 'Java syntax, calculus limits',
    freeTimes: 'Weekday evenings after 6pm',
    classes: ['CSCI 160', 'MATH 165'], color: '#c05621',
  },
  {
    id: 's3', fname: 'Priya', lname: 'Raman', year: 'Junior', major: 'Computer Science',
    bio: 'TA for 160 last year. Into databases and backend stuff. Happy to help with SQL.',
    strengths: 'SQL, data modeling, Linux command line',
    weaknesses: 'Automata and Turing machines',
    freeTimes: 'Mon/Wed/Fri 10am-12pm',
    classes: ['CSCI 366', 'CSCI 336', 'CSCI 277'], color: '#6b46c1',
  },
  {
    id: 's4', fname: 'Ben', lname: 'Halvorson', year: 'Sophomore', major: 'Computer Science',
    bio: 'From Fargo. I play intramural hockey and need a study group so I stop cramming.',
    strengths: 'Data structures, linked lists, trees',
    weaknesses: 'Shell scripting, vim',
    freeTimes: 'Sunday 2-6pm, Thursday nights',
    classes: ['CSCI 161', 'CSCI 277', 'STAT 367'], color: '#2f855a',
  },
  {
    id: 's5', fname: 'Aisha', lname: 'Mohamed', year: 'Senior', major: 'Computer Science',
    bio: 'Working on capstone right now. Interned doing Angular, so ask me about frameworks.',
    strengths: 'Angular, TypeScript, Git workflows',
    weaknesses: 'Networking theory, parallel programming',
    freeTimes: 'Tue/Thu after 4pm',
    classes: ['CSCI 445', 'CSCI 455', 'CSCI 313'], color: '#b83280',
  },
  {
    id: 's6', fname: 'Lucas', lname: 'Brandt', year: 'Junior', major: 'Computer Science',
    bio: 'Like comparing languages for fun. Currently obsessed with Haskell.',
    strengths: 'Functional programming, type systems',
    weaknesses: 'Probability and stats',
    freeTimes: 'Mon/Wed 5-8pm',
    classes: ['CSCI 372', 'CSCI 336', 'STAT 367'], color: '#975a16',
  },
  {
    id: 's7', fname: 'Emma', lname: 'Johnsrud', year: 'Sophomore', major: 'Computer Science',
    bio: 'Transferred from MSUM. Still learning my way around the Quentin Burdick building.',
    strengths: 'Calculus, logic, organizing notes',
    weaknesses: 'Big-O analysis, Java generics',
    freeTimes: 'Weekends, Friday afternoon',
    classes: ['CSCI 222', 'MATH 166', 'CSCI 213'], color: '#2c7a7b',
  },
  {
    id: 's8', fname: 'Noah', lname: 'Vang', year: 'Freshman', major: 'Computer Science',
    bio: 'I build Minecraft mods and want to actually understand what I am doing.',
    strengths: 'Java, game logic',
    weaknesses: 'Math proofs, writing documentation',
    freeTimes: 'Mon-Thu after 7pm',
    classes: ['CSCI 160', 'CSCI 213', 'MATH 165'], color: '#c53030',
  },
  {
    id: 's9', fname: 'Grace', lname: 'Thorson', year: 'Junior', major: 'Computer Science',
    bio: 'Into web dev and UI design. Looking for a group for 313 projects.',
    strengths: 'React, CSS, design',
    weaknesses: 'Database normalization',
    freeTimes: 'Tue/Thu 11am-2pm',
    classes: ['CSCI 313', 'CSCI 366', 'CSCI 277'], color: '#4c51bf',
  },
  {
    id: 's10', fname: 'Sam', lname: 'Kowalski', year: 'Sophomore', major: 'Computer Science',
    bio: 'Night owl. If you are up at 1am fighting a segfault, me too.',
    strengths: 'C, memory management, gdb',
    weaknesses: 'Discrete math counting problems',
    freeTimes: 'Late nights, basically always online',
    classes: ['CSCI 161', 'CSCI 222', 'CSCI 277'], color: '#285e61',
  },
];

export const DEMO_GROUPS: DemoGroup[] = [
  {
    id: 'g1', group_name: 'Discrete Proof Club', class: 'CSCI 222',
    study_content: 'Induction, pigeonhole, counting. We work through the homework set before it is due.',
    max_members: 5, meeting_location: 'Main Library, Room 204', meeting_frequency: 'Weekly',
    meeting_times: 'Tuesdays 6-8pm', group_names: ['Maya Lindqvist', 'Emma Johnsrud', 'Sam Kowalski'],
  },
  {
    id: 'g2', group_name: 'CS II Lab Grind', class: 'CSCI 161',
    study_content: 'Lab help, linked lists, stacks/queues, exam review.',
    max_members: 6, meeting_location: 'QBB 104', meeting_frequency: 'Twice a week',
    meeting_times: 'Mon/Wed 4-6pm', group_names: ['Ben Halvorson', 'Sam Kowalski'],
  },
  {
    id: 'g3', group_name: 'SQL & Chill', class: 'CSCI 366',
    study_content: 'ER diagrams, normalization, writing queries for the project.',
    max_members: 4, meeting_location: 'Memorial Union, 2nd floor', meeting_frequency: 'Weekly',
    meeting_times: 'Thursdays 3-5pm', group_names: ['Priya Raman', 'Grace Thorson', 'Lucas Brandt', 'Aisha Mohamed'],
  },
  {
    id: 'g4', group_name: 'Intro CS Survivors', class: 'CSCI 160',
    study_content: 'Getting through the first Java labs together. Beginners welcome.',
    max_members: 8, meeting_location: 'Discord + QBB study lounge', meeting_frequency: 'Weekly',
    meeting_times: 'Sundays 7-9pm', group_names: ['Tyler Okafor', 'Noah Vang'],
  },
  {
    id: 'g5', group_name: 'Terminal Wizards', class: 'CSCI 277',
    study_content: 'Bash scripting, permissions, regex. Bring your laptop.',
    max_members: 5, meeting_location: 'Main Library, Room 112', meeting_frequency: 'Every other week',
    meeting_times: 'Fridays 2-4pm', group_names: ['Priya Raman'],
  },
  {
    id: 'g6', group_name: 'Capstone Standup', class: 'CSCI 445',
    study_content: 'Sprint check-ins and code review swaps for capstone teams.',
    max_members: 6, meeting_location: 'QBB 202', meeting_frequency: 'Weekly',
    meeting_times: 'Wednesdays 5-6pm', group_names: ['Aisha Mohamed'],
  },
];

// Students who already matched with the demo user before the demo starts.
export const DEMO_STARTING_CHATS: Record<string, DemoMessage[]> = {
  s10: [
    { from: 'them', text: 'hey! saw we are both in 161. you doing the linked list lab yet?', time: '9:42 PM' },
    { from: 'me', text: 'just started, my remove() keeps losing the tail lol', time: '9:45 PM' },
    { from: 'them', text: 'classic. check if you update tail when you remove the last node', time: '9:46 PM' },
  ],
};

export const DEMO_REPLIES: string[] = [
  'Sounds good! Want to meet at the library?',
  'I am free after 4 tomorrow if that works.',
  'Nice, I was stuck on that too.',
  'Let me check my schedule and get back to you.',
  'Yeah let us do it, I will bring my notes.',
];
