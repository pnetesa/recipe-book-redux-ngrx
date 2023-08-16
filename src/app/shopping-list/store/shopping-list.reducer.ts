import { Ingredient } from '../../shared/ingredient.model';
import {
  ShoppingListActions,
  ShoppingListAction,
} from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient | null,
  editedIngredientIndex: number,
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListAction) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state, // Always override old state with a new state
        ingredients: [...state.ingredients, action.payload],
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state, // Always override old state with a new state
        ingredients: [...state.ingredients, ...(action.payload as [])],

        // Reset edit state
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const editedIngredient = action.payload?.ingredient as Ingredient;

      const editedIndex = state.editedIngredientIndex;
      const updatedIngredients = [...state.ingredients];
      updatedIngredients.splice(editedIndex, 1, editedIngredient);

      return {
        ...state,
        ingredients: updatedIngredients,

        // Reset edit state
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      const deletedIndex = state.editedIngredientIndex;
      const changedIngredients = [...state.ingredients];
      changedIngredients.splice(deletedIndex, 1);

      return { ...state, ingredients: changedIngredients };
    case ShoppingListActions.START_EDIT:
      const editedIngredientIndex = action.payload?.editedIndex as number;
      return {
        ...state,
        editedIngredientIndex,
        editedIngredient: { ...state.ingredients[editedIngredientIndex] },
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    default:
      return state;
  }
}
