import { Form, FormResponse } from '../types';

const FORMS_KEY = 'forms';
const RESPONSES_KEY = 'responses';

export const storage = {
  // Forms
  getForms: (): Form[] => {
    const stored = localStorage.getItem(FORMS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getForm: (id: string): Form | null => {
    const forms = storage.getForms();
    return forms.find(form => form.id === id) || null;
  },

  saveForm: (form: Form): void => {
    const forms = storage.getForms();
    const existingIndex = forms.findIndex(f => f.id === form.id);
    
    if (existingIndex >= 0) {
      forms[existingIndex] = { ...form, updatedAt: new Date() };
    } else {
      forms.push({ ...form, createdAt: new Date(), updatedAt: new Date() });
    }
    
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  },

  deleteForm: (id: string): void => {
    const forms = storage.getForms().filter(form => form.id !== id);
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  },

  // Responses
  getResponses: (formId?: string): FormResponse[] => {
    const stored = localStorage.getItem(RESPONSES_KEY);
    const responses = stored ? JSON.parse(stored) : [];
    return formId ? responses.filter((r: FormResponse) => r.formId === formId) : responses;
  },

  saveResponse: (response: FormResponse): void => {
    const responses = storage.getResponses();
    responses.push({ ...response, submittedAt: new Date() });
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  }
};