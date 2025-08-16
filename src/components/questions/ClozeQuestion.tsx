import React, { useState, useEffect } from 'react';
import { Question, ClozeAnswer } from '../../types';

interface ClozeQuestionProps {
  question: Question;
  value?: ClozeAnswer;
  onChange: (answer: ClozeAnswer) => void;
}

export default function ClozeQuestion({ question, value, onChange }: ClozeQuestionProps) {
  const [answers, setAnswers] = useState<ClozeAnswer>({});

  useEffect(() => {
    if (value) {
      setAnswers(value);
    } else {
      // Initialize empty answers for all blanks
      const initialAnswers: ClozeAnswer = {};
      question.blanks?.forEach((_, index) => {
        initialAnswers[index] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [value, question.blanks]);

  const handleInputChange = (blankIndex: number, inputValue: string) => {
    const newAnswers = { ...answers, [blankIndex]: inputValue };
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const renderQuestionWithBlanks = () => {
    const parts = question.text.split('_');
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < parts.length - 1) {
        result.push(
          <input
            key={`blank-${i}`}
            type="text"
            value={answers[i] || ''}
            onChange={(e) => handleInputChange(i, e.target.value)}
            className="mx-1 px-2 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none focus:border-blue-700 min-w-[100px] text-center"
            placeholder="Fill in"
          />
        );
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="text-lg leading-relaxed">
        {renderQuestionWithBlanks()}
      </div>
      
      {question.blanks && question.blanks.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Fill in the blanks:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.blanks.map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-blue-700 font-medium min-w-[60px]">
                  Blank {index + 1}:
                </span>
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your answer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}