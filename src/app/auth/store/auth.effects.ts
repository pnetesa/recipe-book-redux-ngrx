import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
  AuthActions,
  AuthenticateSuccessAction,
  LoginFailAction,
  LoginStartAction,
  RegisterStartAction,
} from './auth.actions';
import { catchError, switchMap, map, EMPTY, of, tap, Observable } from 'rxjs';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  private USER_DATA_KEY = 'user-data';
  private firebaseConfig = {
    apiKey: "AIzaSyAcM-3-pbCLhVQCvDU20qVzarJOqITpaTc",
    authDomain: "ng-course-recipe-book-93c81.firebaseapp.com",
    databaseURL: "https://ng-course-recipe-book-93c81-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ng-course-recipe-book-93c81",
    storageBucket: "ng-course-recipe-book-93c81.appspot.com",
    messagingSenderId: "1018850847226",
    appId: "1:1018850847226:web:f0ec3ce31f73625e6bdc43",
    measurementId: "G-5XK3YFD19J"
  };

  private readonly authLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: LoginStartAction) =>
        fromPromise(signInWithEmailAndPassword(
          getAuth(),
          authData.payload.email,
          authData.payload.password,
        ))
          .pipe(
            map((userCredential: any) => this.handleAuthentication(userCredential)),
            catchError((error: any) => this.handleError(error)),
          ),
      ),
    ),
  );

  private readonly authSuccess = createEffect(() => this.actions$
    .pipe(
      // ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((action: AuthenticateSuccessAction) => {
        if (action.payload.redirect) {
          this.router.navigate(['/']);
        }
      }),
    ),
    { dispatch: false },
  );

  private readonly logout = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.LOGOUT),
      switchMap(() =>
        fromPromise(signOut(getAuth()))
          .pipe(
            catchError((error: any) => this.handleError(error)),
          ),
      ),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem(this.USER_DATA_KEY);
        this.router.navigate(['/auth']);
      }),
    ),
    { dispatch: false },
  );

  private readonly registerStart = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.REGISTER_START),
      switchMap((authData: RegisterStartAction) =>
        fromPromise(createUserWithEmailAndPassword(
          getAuth(),
          authData.payload.email,
          authData.payload.password,
        ))
          .pipe(
            map((userCredential: any) => this.handleAuthentication(userCredential)),
            catchError((error: any) => this.handleError(error)),
          ),
      ),
    ),
  );

  private readonly autoLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const dummyAction = { type: 'DUMMY' };
        const userData = JSON.parse(localStorage.getItem(this.USER_DATA_KEY) as string);
        if (!userData) {
          return dummyAction;
        }

        const user = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (user.token) {
          return new AuthenticateSuccessAction({
            email: user.email,
            id: user.id,
            token: user.token,
            tokenExpirationDate: user.expirationDate,
            redirect: false,
          });

          const expiresIn = user.expirationDate.getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expiresIn);
        }

        return dummyAction;
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private router: Router,
    private authService: AuthService,
  ) {
    const app = initializeApp(this.firebaseConfig);
    getAnalytics(app);
  }

  private handleAuthentication(userCredential: any): AuthenticateSuccessAction {
    const payload = {
      email: userCredential.user.email,
      id: userCredential.user.uid,
      token: userCredential.user.accessToken,
      tokenExpirationDate: new Date(userCredential.user.stsTokenManager.expirationTime),
      redirect: true,
    };
    const user = new User(payload.email, payload.id, payload.token, payload.tokenExpirationDate);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));

    const expiresIn = parseInt(userCredential._tokenResponse.expiresIn) * 1000;
    this.authService.setLogoutTimer(expiresIn);

    return new AuthenticateSuccessAction(payload);
  }

  private handleError(error: any): Observable<LoginFailAction> {
    enum ErrorMessage {
      'auth/user-not-found' = 'No account corresponding to the given email.',
      'auth/wrong-password' = 'Password is invalid for the given email.',
      'auth/email-already-in-use' = 'The email address is already in use by another account.',
      'auth/too-many-requests' = 'Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.',
    }

    const message = ErrorMessage[error.code as keyof typeof ErrorMessage] || 'Unknown error.';
    return of(new LoginFailAction({authError: message}));
  }
}
