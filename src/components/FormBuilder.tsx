import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Save, Plus, ArrowLeft, Eye } from 'lucide-react';
import { Form, Question } from '../types';
import { storage } from '../utils/storage';
import QuestionEditor from './QuestionEditor';

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [form, setForm] = useState<Form>({
    id: '',
    title: '',
    headerImage: '',
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const existingForm = storage.getForm(id);
      if (existingForm) {
        setForm(existingForm);
      } else {
        navigate('/');
      }
    } else if (isNew) {
      setForm(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [id, isNew, navigate]);

  const handleSave = () => {
    setSaving(true);
    storage.saveForm(form);
    setTimeout(() => {
      setSaving(false);
      if (isNew) {
        navigate(`/builder/${form.id}`);
      }
    }, 500);
  };

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      text: '',
      options: type === 'categorize' ? ['Option 1', 'Option 2'] : 
              type === 'comprehension' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      categories: type === 'categorize' ? ['Category 1', 'Category 2'] : undefined,
      passage: type === 'comprehension' ? '' : undefined,
      blanks: type === 'cloze' ? [''] : undefined
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      )
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Create New Form' : 'Edit Form'}
            </h1>
            <p className="mt-2 text-gray-600">Build your form with different question types</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/form/${form.id}`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Form Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Form Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter form title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Image URL (optional)
              </label>
              <input
                type="url"
                value={form.headerImage}
                onChange={(e) => setForm(prev => ({ ...prev, headerImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addQuestion('categorize')}
                  className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors"
                >
                  + Categorize
                </button>
                <button
                  onClick={() => addQuestion('cloze')}
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                >
                  + Cloze
                </button>
                <button
                  onClick={() => addQuestion('comprehension')}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                >
                  + Comprehension
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {form.questions.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Add your first question to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {form.questions.map((question, index) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}