import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStorage, getStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBMyVeEsJM4tw7DitWOWLAd1ACAyPpXXCg',
  authDomain: 'studybuddies-1150c.firebaseapp.com',
  projectId: 'studybuddies-1150c',
  storageBucket: 'studybuddies-1150c.firebasestorage.app',
  messagingSenderId: '159344652152',
  appId: '1:159344652152:web:068c56d52db7fa3d60628d',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    importProvidersFrom(TranslateModule.forRoot()),
    provideHttpClient(withInterceptorsFromDi()),
    provideStorage(() => getStorage()),
  ],
};