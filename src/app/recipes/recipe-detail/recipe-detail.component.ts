import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs';
import { DeleteRecipeAction } from '../store/recipe.actions';
import { AddIngredients } from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public recipe?: Recipe;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(params => parseInt(params['id'])),
        switchMap(recipeId =>
          this.store.select('recipes')
            .pipe(
              map(recipesState =>
                recipesState.recipes.find((recipe: Recipe) => recipe.id === recipeId),
              ),
            ),
        ),
      )
      .subscribe(
        recipe => this.recipe = recipe,
      );
  }

  public onAddToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipe?.ingredients));
  }

  public onDelete() {
    this.store.dispatch(new DeleteRecipeAction({ recipe: this.recipe as Recipe }));
    this.router.navigate(['/recipes']);
  }
}
