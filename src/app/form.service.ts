import { Injectable } from '@angular/core';
import { FormField } from './interfaces';  
@Injectable({
  providedIn: 'root',
})
export class FormService {
  getFormFields(): FormField[] {
    return [
      { name: 'name', label: 'LEAD NAME *', type: 'textbox', required: true },
      { name: 'type', label: 'LEAD TYPE *', type: 'textbox', required: true },
      { name: 'singleDropdown', label: 'SALESPERSON *', type: 'single-select', required: true },
      { name: 'multiDropdown', label: 'CONTACT', type: 'multi-select', required: true },
    ];
  }
}
