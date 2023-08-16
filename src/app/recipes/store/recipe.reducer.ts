import { Recipe } from '../recipe.model';
import { RecipesAction, RecipesActions } from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
}

export function recipeReducer(state = initialState, action: RecipesAction) {
  console.log('recipeReducer: state', state, action);
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload.recipes],
      }
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [ ...state.recipes, action.payload.recipe ],
      }
    case RecipesActions.UPDATE_RECIPE:
      const updatedIndex = state.recipes.indexOf(action.payload.oldRecipe);
      const updatedRecipes = [ ...state.recipes ];
      updatedRecipes.splice(updatedIndex, 1, action.payload.updatedRecipe);
      return {
        ...state,
        recipes: updatedRecipes,
      }
    case RecipesActions.DELETE_RECIPE:
      const deletedIndex = state.recipes.indexOf(action.payload.recipe);
      const changedRecipes = [ ...state.recipes ];
      changedRecipes.splice(deletedIndex, 1);
      return {
        ...state,
        recipes: changedRecipes,
      }
    case RecipesActions.FETCH_RECIPES:
    default:
      return state;
  }
}
