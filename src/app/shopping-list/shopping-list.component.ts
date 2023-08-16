import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StartEdit } from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  public ingredients?: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private store: Store<fromApp.AppState>,
  ) { }

  public ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  public onEditItem(editedIngredientIndex: number) {
    this.store.dispatch(new StartEdit({ editedIndex: editedIngredientIndex }));
  }
}
