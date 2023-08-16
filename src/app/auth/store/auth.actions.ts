import { Action } from '@ngrx/store';

export enum AuthActions {
  LOGIN_START = '[Auth] Login Start',
  AUTHENTICATE_SUCCESS = '[Auth] Authenticate',
  AUTHENTICATE_FAIL = '[Auth] Authenticate Fail',
  LOGOUT = '[Auth] Logout',
  REGISTER_START = '[Auth] Register Start',
  CLEAR_ERROR = '[Auth] Clear Error',
  AUTO_LOGIN = '[Auth] Auto Login',
}

export class LoginStartAction implements Action {
  public readonly type = AuthActions.LOGIN_START;
  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateSuccessAction implements Action {
  public readonly type = AuthActions.AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      email: string,
      id: string,
      token: string,
      tokenExpirationDate: Date,
      redirect: boolean,
    },
  ) { }
}

export class LogoutAction implements Action {
  public readonly type = AuthActions.LOGOUT;
}

export class LoginFailAction implements Action {
  public readonly type = AuthActions.AUTHENTICATE_FAIL;

  constructor(public payload: { authError: string }) {
  }
}

export class RegisterStartAction implements Action {
  public readonly type = AuthActions.REGISTER_START;
  constructor(public payload: { email: string, password: string }) {
  }
}

export class ClearErrorAction implements Action {
  public readonly type = AuthActions.CLEAR_ERROR;
}

export class AutoLoginAction implements Action {
  public readonly type = AuthActions.AUTO_LOGIN;
}

export type AuthAction =
  | AuthenticateSuccessAction
  | LogoutAction
  | LoginStartAction
  | LoginFailAction
  | RegisterStartAction
  | ClearErrorAction
  | AutoLoginAction;
