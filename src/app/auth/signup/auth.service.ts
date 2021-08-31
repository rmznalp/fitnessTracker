import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TrainingService } from 'src/app/training/training.service';
import { User } from '../user.modal';
import { AuthData } from './auth-data.modal';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();
  /**
   *
   */
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  initAuthListener() {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscription();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.fireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {});
  }

  login(authData: AuthData) {
    this.fireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {});
  }

  logout() {
    this.fireAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
