import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { LogoutAction } from '../auth/store/auth.actions';
import { FetchRecipesAction, SaveRecipesAction } from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  public collapsed = true;
  public isAuthenticated = false;
  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => this.isAuthenticated = !!user);
  }

  public onSaveData() {
    this.store.dispatch(new SaveRecipesAction());
  }

  public onFetchData() {
    this.store.dispatch(new FetchRecipesAction());
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onLogout() {
    this.store.dispatch(new LogoutAction())
  }
}
