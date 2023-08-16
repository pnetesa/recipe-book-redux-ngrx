import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { LogoutAction } from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimeoutId?: NodeJS.Timeout | null;

  constructor(private store: Store<fromApp.AppState>) {
  }

  public setLogoutTimer(expirationDuration: number): void {
    // For test - logout after 3.6 seconds
    // expirationDuration = expirationDuration / 1000;
    this.tokenExpirationTimeoutId = setTimeout(
      () => this.store.dispatch(new LogoutAction()),
      expirationDuration
    );
  }

  public clearLogoutTimer(): void {
    if (this.tokenExpirationTimeoutId) {
      clearTimeout(this.tokenExpirationTimeoutId);
      this.tokenExpirationTimeoutId = null;
    }
  }
}
