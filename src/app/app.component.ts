// Angular modules
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
// import { MatBadgeModule } from '@angular/material/badge';

// Custom imports
import { AllSyllabus, FlatProblem, ProblemFlattener } from './models/AllSyllabus';
import data from '../assets/tuf.json';
import { ProblemUtils } from './utils/ProblemUtils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    // MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  isDarkMode = true;

  totalProblems: number = 0;

  allSyllabus: AllSyllabus = data;

  flatProblems: FlatProblem[] = [];

  // sortBy: string[] = ['difficulty', 'category_id', 'subcategory_id', 'problem_id'];
  sortByOptions = [
    { key: 'difficulty', value: 'Difficulty' },
    { key: 'category_id', value: 'Category' },
    { key: 'subcategory_id', value: 'Subcategory' },
    { key: 'problem_id', value: 'Problem' }
  ];

  selectedsortBy: string = this.sortByOptions[0].key;

  searchTerm: string = '';

  sortDirection: 'asc' | 'desc' = 'asc';

  readonly separatorKeysCodes = [ENTER, COMMA];

  // --- Difficulty chip grid ---
  difficultyChipCtrl = new FormControl('');
  selectedDifficultyChips: string[] = [];
  difficultiesList: string[] = [];
  filteredDifficultyOptions!: Observable<string[]>;
  @ViewChild('difficultyChipInput') difficultyChipInput!: ElementRef<HTMLInputElement>;

  // --- Category chip grid ---
  categoryChipCtrl = new FormControl('');
  selectedCategorychips: string[] = [];
  categoriesList: string[] = [];
  filteredCategoryOptions!: Observable<string[]>;
  @ViewChild('CategoryChipInput') CategoryChipInput!: ElementRef<HTMLInputElement>;

  // --- Sub-Category chip grid ---
  subCatgoryChipCtrl = new FormControl('');
  selectedSubCatgoryChips: string[] = [];
  subcategoriesList: string[] = [];
  filteredSubCatgoryOptions!: Observable<string[]>;
  @ViewChild('subCategoryChipInput') subCategoryChipInput!: ElementRef<HTMLInputElement>;

  // --- Tags chip grid ---
  tagsChipCtrl = new FormControl('');
  selectedTagsChips: string[] = [];
  tagsList: string[] = [];
  filteredTagsOptions!: Observable<string[]>;
  @ViewChild('tagsChipInput') tagsChipInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredDifficultyOptions = this.difficultyChipCtrl.valueChanges.pipe(
      startWith(null),
      map(value => this._chipsDropDownfilter(value, this.difficultiesList, this.selectedDifficultyChips))
    );

    this.filteredCategoryOptions = this.categoryChipCtrl.valueChanges.pipe(
      startWith(null),
      map(value => this._chipsDropDownfilter(value, this.categoriesList, this.selectedCategorychips))
    );

    this.filteredSubCatgoryOptions = this.subCatgoryChipCtrl.valueChanges.pipe(
      startWith(null),
      map(value => this._chipsDropDownfilter(value, this.subcategoriesList, this.selectedSubCatgoryChips))
    );

    this.filteredTagsOptions = this.tagsChipCtrl.valueChanges.pipe(
      startWith(null),
      map(value => this._chipsDropDownfilter(value, this.tagsList, this.selectedTagsChips))
    );
  }

  ngOnInit() {
    this.flatProblems = ProblemFlattener.flatten(this.allSyllabus);
    this.totalProblems = this.flatProblems.length;
    this.difficultiesList = ProblemUtils.getUniqueDifficulties(this.flatProblems);
    this.categoriesList = ProblemUtils.getUniqueCategoryNames(this.flatProblems);
    this.subcategoriesList = ProblemUtils.getUniqueSubCategoryNames(this.flatProblems);
    this.tagsList = ProblemUtils.getUniqueTags(this.flatProblems);
  }

  /* HELPER FUNCTIONS */

  private filterProblems(selectedDifficultyChips: string[], selectedCategorychips: string[], selectedSubCatgoryChips: string[], selectedTagsChips: string[], sortBy: string, order: string) {
    this.flatProblems = ProblemFlattener.flattenAndFilter(this.searchTerm, this.allSyllabus, selectedDifficultyChips, selectedCategorychips, selectedSubCatgoryChips, selectedTagsChips, sortBy, order);
  }

  // Generic chips filter function
  private _chipsDropDownfilter(value: string | null, options: string[], selected: string[]): string[] {
    const filterValue = (value || '').toLowerCase();
    return options.filter(
      option => option.toLowerCase().includes(filterValue) && !selected.includes(option)
    );
  }

  onSearch() {
    this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    this.flatProblems = [...this.flatProblems];
  }

  onSortChange(selectedKey: string) {
    this.selectedsortBy = selectedKey;
    this.sortFlatProblems();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortFlatProblems();
  }

  resetFilter() {
    this.searchTerm = '';
    this.selectedDifficultyChips = [];
    this.selectedCategorychips = [];
    this.selectedSubCatgoryChips = [];
    this.selectedTagsChips = [];
    this.selectedsortBy = this.sortByOptions[0].key;
    this.sortDirection = 'asc';
    this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
  }

  sortFlatProblems() {
    // Step 1: Filter
    let filtered = this.flatProblems.filter(problem => {
      const term = this.searchTerm.trim().toLowerCase();
      return (
        problem.problem_id.toLowerCase().includes(term) ||
        problem.problem_name.toLowerCase().includes(term) ||
        problem.problem_slug.toLowerCase().includes(term)
      );
    });

    this.flatProblems.sort((a, b) => {
      const field = this.selectedsortBy;
      let valueA = (a as any)[field];
      let valueB = (b as any)[field];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Step 3: Update displayed data
    this.flatProblems = [...this.flatProblems];
  }


  // --- Difficulty chip grid handlers ---
  addDifficultyChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedDifficultyChips.includes(value)) {
      this.selectedDifficultyChips.push(value);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
    this.difficultyChipCtrl.setValue(null);
  }

  removeDifficultyChip(chip: string): void {
    const index = this.selectedDifficultyChips.indexOf(chip);
    if (index >= 0) {
      this.selectedDifficultyChips.splice(index, 1);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.difficultyChipCtrl.setValue(null);
  }

  selectedDifficultyChip(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.selectedDifficultyChips.includes(value)) {
      this.selectedDifficultyChips.push(value);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.difficultyChipInput.nativeElement.value = '';
    this.difficultyChipCtrl.setValue(null);
  }

  // --- Category chip grid handlers ---
  addCategoryChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedCategorychips.includes(value)) {
      this.selectedCategorychips.push(value);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
    this.categoryChipCtrl.setValue(null);
  }

  removeCategoryChip(chip: string): void {
    const index = this.selectedCategorychips.indexOf(chip);
    if (index >= 0) {
      this.selectedCategorychips.splice(index, 1);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.categoryChipCtrl.setValue(null);
  }

  selectedCategoryChip(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.selectedCategorychips.includes(value)) {
      this.selectedCategorychips.push(value);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.CategoryChipInput.nativeElement.value = '';
    this.categoryChipCtrl.setValue(null);
  }

  // --- Sub-Category chip grid handlers ---
  addSubcategoryChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedSubCatgoryChips.includes(value)) {
      this.selectedSubCatgoryChips.push(value);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
    this.subCatgoryChipCtrl.setValue(null);
  }

  removeSubcategoryChip(chip: string): void {
    const index = this.selectedSubCatgoryChips.indexOf(chip);
    if (index >= 0) {
      this.selectedSubCatgoryChips.splice(index, 1);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.subCatgoryChipCtrl.setValue(null);
  }

  selectedSubcategoryChip(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.selectedSubCatgoryChips.includes(value)) {
      this.selectedSubCatgoryChips.push(value);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.subCategoryChipInput.nativeElement.value = '';
    this.subCatgoryChipCtrl.setValue(null);
  }

  // --- Tags chip grid handlers ---
  addTagsChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedTagsChips.includes(value)) {
      this.selectedTagsChips.push(value);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
    this.tagsChipCtrl.setValue(null);
  }

  removeTagsChip(chip: string): void {
    const index = this.selectedTagsChips.indexOf(chip);
    if (index >= 0) {
      this.selectedTagsChips.splice(index, 1);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.tagsChipCtrl.setValue(null);
  }

  selectedChip4(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.selectedTagsChips.includes(value)) {
      this.selectedTagsChips.push(value);
      this.filterProblems(this.selectedDifficultyChips, this.selectedCategorychips, this.selectedSubCatgoryChips, this.selectedTagsChips, 'problemName', 'asc');
    }
    this.tagsChipInput.nativeElement.value = '';
    this.tagsChipCtrl.setValue(null);
  }

  // Table
  displayedColumns = ['id', 'difficulty', 'category_name', 'subcategory_name', 'tuf_link', 'problem_name'];
}