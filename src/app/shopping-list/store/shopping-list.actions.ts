import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export enum ShoppingListActions {
  ADD_INGREDIENT = '[Shopping List] Add Ingredient',
  ADD_INGREDIENTS = '[Shopping List] Add Ingredients',
  UPDATE_INGREDIENT = '[Shopping List] Update Ingredient',
  DELETE_INGREDIENT = '[Shopping List] Delete Ingredient',
  START_EDIT = '[Shopping List] Start Edit',
  STOP_EDIT = '[Shopping List] Stop Edit',
}

// Union type
export type ShoppingListAction =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit;

export class AddIngredient implements Action {
  public readonly type = ShoppingListActions.ADD_INGREDIENT;

  constructor(public payload?: Ingredient) { }
}

export class AddIngredients implements Action {
  public readonly type = ShoppingListActions.ADD_INGREDIENTS;

  constructor(public payload?: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
  public readonly type = ShoppingListActions.UPDATE_INGREDIENT;

  constructor(public payload?: { ingredient: Ingredient }) { }
}

export class DeleteIngredient implements Action {
  public readonly type = ShoppingListActions.DELETE_INGREDIENT;
}

export class StartEdit implements Action {
  public readonly type = ShoppingListActions.START_EDIT;
  constructor(public payload?: { editedIndex: number }) { }
}

export class StopEdit implements Action {
  public readonly type = ShoppingListActions.STOP_EDIT;
}
