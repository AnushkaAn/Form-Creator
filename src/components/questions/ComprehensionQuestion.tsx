import React, { useState, useEffect } from 'react';
import { Question, ComprehensionAnswer } from '../../types';

interface ComprehensionQuestionProps {
  question: Question;
  value?: ComprehensionAnswer;
  onChange: (answer: ComprehensionAnswer) => void;
}

export default function ComprehensionQuestion({ question, value, onChange }: ComprehensionQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (value?.selectedOption) {
      setSelectedOption(value.selectedOption);
    }
  }, [value]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onChange({ selectedOption: option });
  };

  return (
    <div className="space-y-6">
      {/* Reading Passage */}
      {question.passage && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reading Passage:</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {question.passage}
            </p>
          </div>
        </div>
      )}

      {/* Multiple Choice Options */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose the best answer:</h3>
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <span className="font-medium text-blue-600 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}