import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Form, FormResponse } from '../types';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import CategorizeQuestion from './questions/CategorizeQuestion';
import ClozeQuestion from './questions/ClozeQuestion';
import ComprehensionQuestion from './questions/ComprehensionQuestion';

export default function FormRenderer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundForm = storage.getForm(id);
      if (foundForm) {
        setForm(foundForm);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (form && currentQuestion < form.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!form) return;
    
    setSubmitting(true);
    
    const response: FormResponse = {
      id: uuidv4(),
      formId: form.id,
      answers,
      submittedAt: new Date()
    };
    
    storage.saveResponse(response);
    
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Form not found</h2>
          <p className="mt-2 text-gray-600">The form you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">Your responses have been submitted successfully.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = form.questions[currentQuestion];
  const isLastQuestion = currentQuestion === form.questions.length - 1;
  const hasAnswer = answers[currentQ?.id] !== undefined && answers[currentQ?.id] !== null && answers[currentQ?.id] !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {form.headerImage && (
            <div className="h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img
                src={form.headerImage}
                alt={form.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {form.questions.length}
            </p>
            <div className="flex space-x-1">
              {form.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-8 rounded ${
                    idx < currentQuestion 
                      ? 'bg-green-500' 
                      : idx === currentQuestion 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.text}
            </h2>
            {currentQ.image && (
              <div className="mb-4">
                <img
                  src={currentQ.image}
                  alt="Question"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          {currentQ.type === 'categorize' && (
            <CategorizeQuestion
              question={currentQ}
              value={answers[currentQ.id]}
              onChange={(answer) => handleAnswerChange(currentQ.id, answer)}
            />
          )}

          {currentQ.type === 'cloze' && (
            <ClozeQuestion
              question={currentQ}
              value={answers[currentQ.id]}
              onChange={(answer) => handleAnswerChange(currentQ.id, answer)}
            />
          )}

          {currentQ.type === 'comprehension' && (
            <ComprehensionQuestion
              question={currentQ}
              value={answers[currentQ.id]}
              onChange={(answer) => handleAnswerChange(currentQ.id, answer)}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer || submitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Question
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}