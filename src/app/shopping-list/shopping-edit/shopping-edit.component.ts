import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient, DeleteIngredient, StopEdit, UpdateIngredient } from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f')
  shoppingListForm?: NgForm;
  public isEditMode = false;
  private subscription?: Subscription;
  private editedItem?: Ingredient;
  // Now manage index inside state
  // private editedIndex = -1;

  constructor(
    // private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>,
  ) { }

  public ngOnInit(): void {
    this.subscription = this.store.select('shoppingList')
      .subscribe(stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.isEditMode = true;
          this.editedItem = stateData.editedIngredient as Ingredient;
          // this.editedIndex = stateData.editedIngredientIndex;
          this.shoppingListForm?.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.isEditMode = false;
        }
      });

    // this.subscription = this.shoppingListService.startedEditing
    //   .subscribe(
    //     (ingredient: Ingredient) => {
    //       this.editedItem = ingredient;
    //       this.isEditMode = true;
    //       console.log('this.editedItem: ', this.editedItem);
    //       this.shoppingListForm?.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount,
    //       });
    //     }
    //   );
  }

  public onSubmit(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);
    if (this.isEditMode) {
      // this.shoppingListService.updateIngredient(this.editedItem as Ingredient, ingredient);
      this.store.dispatch(new UpdateIngredient({
        // editedIndex: this.editedIndex,
        ingredient,
      }));
    } else {
      // this.shoppingListService.addIngredient(ingredient);
      this.store.dispatch(new AddIngredient(ingredient));
    }
    this.onClear();
  }

  public onClear() {
    this.shoppingListForm?.reset();
    this.isEditMode = false;
    this.store.dispatch(new StopEdit());
  }

  public onDelete() {
    // this.shoppingListService.deleteIngredient(this.editedItem as Ingredient);
    // this.store.dispatch(new DeleteIngredient({ deletedIndex: this.editedIndex }));
    this.store.dispatch(new DeleteIngredient());
    this.onClear();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.store.dispatch(new StopEdit());
  }
}
