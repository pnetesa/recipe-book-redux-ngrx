import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { AddRecipeAction, UpdateRecipeAction } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  public recipeForm = new FormGroup<any>({});
  public id?: number;
  public get isEditMode(): boolean {
    return !!this.id;
  }
  private editedRecipe?: Recipe;

  private storeSub?: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) { }

  public get ingredientControls(): AbstractControl<any, any>[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  public ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = parseInt(params['id']);
          this.initForm();
        },
      );
  }

  private initForm(): void {
    let recipeName = '';
    let imagePath = '';
    let description = '';
    let recipeIngredients = new FormArray<any>([]);

    if (this.isEditMode) {
      // const recipe = this.recipeService.getRecipe(this.id as number);
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(
            recipeState => recipeState.recipes.find((recipe) => recipe.id === this.id) as Recipe
          ),
        )
        .subscribe(recipe => {
          this.editedRecipe = recipe;

          recipeName = recipe.name;
          imagePath = recipe.imagePath;
          description = recipe.description;

          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup<any>({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
            }));
          }
        });
    }

    this.recipeForm = new FormGroup<any>({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  public onSubmit() {
    console.log(this.recipeForm);
    if (this.isEditMode) {
      this.store.dispatch(new UpdateRecipeAction({
        oldRecipe: this.editedRecipe as Recipe,
        updatedRecipe: { ...this.recipeForm.value, id: this.editedRecipe?.id },
      }));
    } else {
      this.store.dispatch(new AddRecipeAction({
        recipe: {
          ...this.recipeForm.value,
          id: new Date().valueOf(),
        },
      }));
    }
    this.navigateAway();
  }

  public onCancel() {
    this.navigateAway();
  }

  private navigateAway() {
    // Go 'up' is better!
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  public onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  public onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  public ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
  }
}
