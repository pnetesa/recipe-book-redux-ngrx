import { Component, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { ClearErrorAction, LoginStartAction, RegisterStartAction } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
  public isLoginMode = true;
  public isLoading = false;

  @ViewChild(PlaceholderDirective)
  public alertHost?: PlaceholderDirective;
  private closeSubscription?: Subscription;
  private storeSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {
  }

  public ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      console.log('ngOnInit.authState', authState);
      this.isLoading = authState.loading;
      if (authState.authError) {
        this.showErrorAlert(authState.authError);
      }
    });
  }

  public onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onSubmit(form: NgForm): void {
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new LoginStartAction({email, password}));
    } else {
      this.store.dispatch(new RegisterStartAction({ email, password }));
    }

    form.reset();
  }

  // Create a Dynamic Component here
  public showErrorAlert(message: string): void {
    const viewContainerRef = this.alertHost?.viewContainerRef;
    viewContainerRef?.clear();
    const alertComponentRef = viewContainerRef?.createComponent(AlertComponent) as ComponentRef<AlertComponent>;
    alertComponentRef.instance.message = message;
    this.closeSubscription = alertComponentRef.instance.close
      .subscribe(() => {
        this.closeSubscription?.unsubscribe();
        viewContainerRef?.clear();
        this.onErrorAlertClose();
      });
  }

  public onErrorAlertClose() {
    this.store.dispatch(new ClearErrorAction());
  }

  public ngOnDestroy(): void {
    this.closeSubscription?.unsubscribe();
    this.storeSubscription?.unsubscribe();
  }
}
