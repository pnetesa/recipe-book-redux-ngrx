import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export enum RecipesActions {
  SET_RECIPES = '[Recipes] Set Recipes',
  FETCH_RECIPES = '[Recipes] Fetch Recipes',
  ADD_RECIPE = '[Recipes] Add Recipe',
  UPDATE_RECIPE = '[Recipes] Update Recipe',
  DELETE_RECIPE = '[Recipes] Delete Recipe',
  SAVE_RECIPES = '[Recipes] Save Recipes',
}

export class SetRecipesAction implements Action {
  public readonly type = RecipesActions.SET_RECIPES;

  constructor(public payload: { recipes: Recipe[] }) {
  }
}

export class FetchRecipesAction implements Action {
  public readonly type = RecipesActions.FETCH_RECIPES;
}

export class AddRecipeAction implements Action {
  public readonly type = RecipesActions.ADD_RECIPE;

  constructor(public payload: { recipe: Recipe }) {
  }
}

export class UpdateRecipeAction implements Action {
  public readonly type = RecipesActions.UPDATE_RECIPE;

  constructor(public payload: { oldRecipe: Recipe, updatedRecipe: Recipe }) {
  }
}

export class DeleteRecipeAction implements Action {
  public readonly type = RecipesActions.DELETE_RECIPE;

  constructor(public payload: { recipe: Recipe }) {
  }
}

export class SaveRecipesAction implements Action {
  public readonly type = RecipesActions.SAVE_RECIPES;
}

export type RecipesAction =
  | SetRecipesAction
  | FetchRecipesAction
  | AddRecipeAction
  | UpdateRecipeAction
  | DeleteRecipeAction
  | SaveRecipesAction;
