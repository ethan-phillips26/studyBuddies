import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatchingPageComponent } from './matching-page/matching-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
import { MessengerPageComponent } from './messenger-page/messenger-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditGroupPageComponent } from './edit-group-page/edit-group-page.component';
import { DemoPageComponent } from './demo-page/demo-page.component';

export const routes: Routes = [
    {
        path:"",
        component: MatchingPageComponent,
        title: "StudyBuddies - Match"
    },
    {
        path:"group",
        component: GroupPageComponent,
        title: "StudyBuddies - GroupUp"
    },
    {
        path:"edit-group",
        component: EditGroupPageComponent,
        title: "StudyBuddies - EditGroup"
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
    // Demo pages: fake students and groups, no sign-in, nothing saved.
    { path:"demo", component: DemoPageComponent, data: { tab: "match" }, title: "StudyBuddies - Match (Demo)" },
    { path:"demo/group", component: DemoPageComponent, data: { tab: "group" }, title: "StudyBuddies - GroupUp (Demo)" },
    { path:"demo/message", component: DemoPageComponent, data: { tab: "message" }, title: "StudyBuddies - Message (Demo)" },
    { path:"demo/profile", component: DemoPageComponent, data: { tab: "profile" }, title: "StudyBuddies - Profile (Demo)" },

];
