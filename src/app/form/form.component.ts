import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { FormService } from '../form.service';
import { FormField } from '../interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [FormService],
})
export class FormComponent implements OnInit {
  form: FormGroup;
  formFields: FormField[] = [];
  users: string[] = [];
  page = 1;
  loading = false;
  hasMoreData = true;
  bannerId: string | null = null;

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  selectedSingleItem: any = null;

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'itemName',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true
  };

  singleDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'itemName',
    allowSearchFilter: true
  };

  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private http = inject(HttpClient);

  constructor() {
    this.formFields = this.formService.getFormFields();
    this.form = this.buildForm();
  }

 ngOnInit(): void {
    this.loadDropdownItems();
  }

  loadDropdownItems(): void {
    this.loading = true;
    const url = `https://www.melivecode.com/api/users?page=${this.page}`;
    this.http.get<any[]>(url).subscribe(
      (response) => {
        if (response.length < 10) {
          this.hasMoreData = false;
        }

        this.dropdownList = [
          ...this.dropdownList,
          ...response.map((user, index) => ({
            id: index + 1,
            itemName: `${user.fname} ${user.lname}`,
          })),
        ];

        this.page++;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading dropdown items:', error);
        this.loading = false;
      }
    );
  }


  loadUsers() {
    if (this.loading || !this.hasMoreData) return;

    this.loading = true;
    const url = `https://www.melivecode.com/api/users?page=${this.page}`;

    this.http.get<any[]>(url).subscribe(
      (response) => {
        if (response.length < 10) {
          this.hasMoreData = false;
        }

        this.users = [...this.users, ...response.map((user) => `${user.fname} ${user.lname}`)];
        this.dropdownList = this.users.map((user, index) => ({
          id: index + 1,
          itemName: user
        }));

        this.page++;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    );
  }

  buildForm(): FormGroup {
    const group: any = {};
    this.formFields.forEach((field) => {
      const control = field.required ? [null, Validators.required] : [null];
      group[field.name] = control;
    });
    return this.fb.group(group);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.bannerId = `BANNER-${Math.floor(Math.random() * 10000)}`;
      console.log('Form Submitted:', this.form.value);
      this.form.reset();
      this.selectedSingleItem = null;
      this.selectedItems = [];
    } else {
      console.log('Form is invalid');
    }
  }

  onReset(): void {
    this.form.reset();
    this.selectedSingleItem = null;
    this.selectedItems = [];
    this.bannerId = '';
  }

onItemSelect(item: any) {
  this.selectedItems.push(item);
  console.log('Item selected:', item);
}

onSelectAll(items: any) {
  this.selectedItems = items;
  console.log('All items selected:', items);
}
}
