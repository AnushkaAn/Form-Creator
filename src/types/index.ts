export interface Question {
  id: string;
  type: 'categorize' | 'cloze' | 'comprehension';
  text: string;
  image?: string;
  options?: string[];
  categories?: string[];
  passage?: string;
  blanks?: string[];
  correctAnswer?: any;
}

export interface Form {
  id: string;
  title: string;
  headerImage?: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submittedAt: Date;
}

export interface CategorizeAnswer {
  [category: string]: string[];
}

export interface ClozeAnswer {
  [blankIndex: number]: string;
}

export interface ComprehensionAnswer {
  selectedOption: string;
}