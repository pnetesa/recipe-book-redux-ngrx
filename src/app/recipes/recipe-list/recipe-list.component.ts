import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  public recipes: Recipe[] = [];
  public subscription?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) { }

  ngOnInit(): void {
    this.subscription = this.store
      .select('recipes')
      .pipe(
        tap(recipesState => console.log('---> recipesState', recipesState)),
        map(recipesState => recipesState.recipes),
      )
      .subscribe(
        (recipes => this.recipes = recipes),
      );
  }

  public onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
