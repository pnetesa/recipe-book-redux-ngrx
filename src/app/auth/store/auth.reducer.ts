import { User } from '../user.model';
import { AuthAction, AuthActions } from './auth.actions';

export interface State {
  user: User | null,
  authError: string | null,
  loading: boolean,
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(state = initialState, action: AuthAction) {
  switch (action.type) {
    case AuthActions.REGISTER_START:
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.id,
        action.payload.token,
        action.payload.tokenExpirationDate,
      );
      return {
        ...state,
        user,
        authError: null,
        loading: false,
      };
    case AuthActions.LOGOUT:
      console.log('---> LOGOUT!');
      return {
        ...state,
        user: null,
        authError: null,
        loading: false,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload.authError,
        loading: false,
      }
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      }
    default:
      return state;
  }
}
