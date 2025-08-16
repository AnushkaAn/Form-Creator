import React, { useState } from 'react';
import { Trash2, Plus, Minus, Image } from 'lucide-react';
import { Question } from '../types';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (questionId: string, updatedQuestion: Question) => void;
  onDelete: (questionId: string) => void;
}

export default function QuestionEditor({ question, index, onUpdate, onDelete }: QuestionEditorProps) {
  const [expanded, setExpanded] = useState(true);

  const updateField = (field: keyof Question, value: any) => {
    onUpdate(question.id, { ...question, [field]: value });
  };

  const updateArrayField = (field: keyof Question, index: number, value: string) => {
    const array = question[field] as string[];
    const newArray = [...array];
    newArray[index] = value;
    onUpdate(question.id, { ...question, [field]: newArray });
  };

  const addArrayItem = (field: keyof Question) => {
    const array = question[field] as string[] || [];
    onUpdate(question.id, { ...question, [field]: [...array, ''] });
  };

  const removeArrayItem = (field: keyof Question, index: number) => {
    const array = question[field] as string[];
    onUpdate(question.id, { ...question, [field]: array.filter((_, i) => i !== index) });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'categorize': return 'Categorize';
      case 'cloze': return 'Cloze (Fill in the blanks)';
      case 'comprehension': return 'Comprehension';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'categorize': return 'bg-purple-100 text-purple-800';
      case 'cloze': return 'bg-green-100 text-green-800';
      case 'comprehension': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-600 hover:text-gray-900"
          >
            <span className="font-medium">Question {index + 1}</span>
          </button>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(question.type)}`}>
            {getTypeLabel(question.type)}
          </span>
        </div>
        <button
          onClick={() => onDelete(question.id)}
          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={question.text}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="h-4 w-4 inline mr-1" />
              Question Image URL (optional)
            </label>
            <input
              type="url"
              value={question.image || ''}
              onChange={(e) => updateField('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {question.type === 'categorize' && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Categories</label>
                  <button
                    onClick={() => addArrayItem('categories')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {question.categories?.map((category, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => updateArrayField('categories', idx, e.target.value)}
                        placeholder={`Category ${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {question.categories!.length > 2 && (
                        <button
                          onClick={() => removeArrayItem('categories', idx)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Items to Categorize</label>
                  <button
                    onClick={() => addArrayItem('options')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateArrayField('options', idx, e.target.value)}
                        placeholder={`Item ${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {question.options!.length > 2 && (
                        <button
                          onClick={() => removeArrayItem('options', idx)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {question.type === 'cloze' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Fill in the Blanks (use underscores _ for blanks in the question text)
                </label>
                <button
                  onClick={() => addArrayItem('blanks')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {question.blanks?.map((blank, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Blank {idx + 1}:</span>
                    <input
                      type="text"
                      value={blank}
                      onChange={(e) => updateArrayField('blanks', idx, e.target.value)}
                      placeholder="Correct answer"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {question.blanks!.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('blanks', idx)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.type === 'comprehension' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Passage
                </label>
                <textarea
                  value={question.passage || ''}
                  onChange={(e) => updateField('passage', e.target.value)}
                  placeholder="Enter the reading passage..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Answer Options</label>
                  <button
                    onClick={() => addArrayItem('options')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-8">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateArrayField('options', idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {question.options!.length > 2 && (
                        <button
                          onClick={() => removeArrayItem('options', idx)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}