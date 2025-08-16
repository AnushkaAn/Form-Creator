import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { Form } from '../types';
import { storage } from '../utils/storage';

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    setForms(storage.getForms());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      storage.deleteForm(id);
      setForms(storage.getForms());
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          <p className="mt-2 text-gray-600">Create and manage your forms</p>
        </div>
        <Link
          to="/builder/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
          <div className="mt-6">
            <Link
              to="/builder/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div key={form.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              {form.headerImage && (
                <div className="h-32 bg-gray-200 overflow-hidden">
                  <img
                    src={form.headerImage}
                    alt={form.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {form.title || 'Untitled Form'}
                  </h3>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(form.updatedAt || form.createdAt)}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/form/${form.id}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Link>
                  <Link
                    to={`/builder/${form.id}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}