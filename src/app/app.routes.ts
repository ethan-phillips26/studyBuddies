import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatchingPageComponent } from './matching-page/matching-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
import { MessengerPageComponent } from './messenger-page/messenger-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

export const routes: Routes = [
    {
        path:"",
        component: LoginPageComponent,
        title: "StudyBuddies - Login"
    },
    {
        path:"match",
        component: MatchingPageComponent,
        title: "StudyBuddies - Match"
    },
    {
        path:"group",
        component: GroupPageComponent,
        title: "StudyBuddies - GroupUp"
    },
    {
        path:"message",
        component: MessengerPageComponent,
        title: "StudyBuddies - Message"
    },
    {
        path:"profile",
        component: ProfilePageComponent,
        title: "StudyBuddies - Profile"
    },
];
