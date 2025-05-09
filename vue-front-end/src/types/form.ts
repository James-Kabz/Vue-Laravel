// src/types/forms.ts
export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  description?: string;
}