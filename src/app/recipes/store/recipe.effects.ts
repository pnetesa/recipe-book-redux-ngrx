import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RecipesActions, SetRecipesAction } from './recipe.actions';
import { map, of, switchMap, withLatestFrom } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  private URL = 'https://ng-course-recipe-book-12345-YOUR-URI.europe-west1.firebasedatabase.app/';
  private RECIPES_URL = `${this.URL}recipes.json`;
  private readonly fetchRecipes = createEffect(() => this.actions$
    .pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(fetchAction => this.http.get<Recipe[]>(this.RECIPES_URL)),
      map(recipes => {
        return recipes.map(recipe => ({ ...recipe, ingredients: recipe.ingredients || [] }));
      }),
      map(recipes => new SetRecipesAction({ recipes })),
    ),
  );

  private readonly storeRecipes = createEffect(() => this.actions$
    .pipe(
      ofType(RecipesActions.SAVE_RECIPES),
      withLatestFrom(
        this.store.select('recipes'),
        this.store.select('auth'),
      ),
      switchMap(([action, recipesState, authState]) => {
        console.log('SAVE_RECIPES / recipesState: ', recipesState);
        console.log('SAVE_RECIPES / authState: ', authState);
        return this.http.put(this.RECIPES_URL,
          (recipesState as any).recipes,
          { params: new HttpParams().set('auth', (authState as any).user.token as string) },
        );
      }),
    ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
  ) {
  }
}
