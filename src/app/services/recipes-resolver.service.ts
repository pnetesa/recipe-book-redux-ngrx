import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from '../recipes/recipe.model';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { FetchRecipesAction, RecipesActions } from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    // private dataStorageService: DataStorageService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
  ) {
  }

  // public resolve(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot,
  // ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
  //   const recipes = this.recipesService.getRecipes();
  //
  //   if (!recipes.length) {
  //     return this.dataStorageService.fetchRecipes();
  //   } else {
  //     return recipes;
  //   }
  // }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    return this.store.select('recipes')
      .pipe(
        // take(1),
        map(recipesState => recipesState.recipes),
        switchMap(recipes => {
          if (recipes.length) {
            return of(recipes);
          }

          this.store.dispatch(new FetchRecipesAction());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1),
            tap(data => console.log('recipes-resolver.service:SET_RECIPES', data)),
          );
        }),
      );

  }
}
