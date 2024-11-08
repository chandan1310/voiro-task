import { Component } from '@angular/core';
import { FormComponent } from "./form/form.component";
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormComponent, RouterModule, NgMultiSelectDropDownModule],
  template: `
  <router-outlet />
  <app-form></app-form>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
