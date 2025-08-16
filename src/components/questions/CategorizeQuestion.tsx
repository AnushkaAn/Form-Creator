import React, { useState, useEffect } from 'react';
import { Question, CategorizeAnswer } from '../../types';

interface CategorizeQuestionProps {
  question: Question;
  value?: CategorizeAnswer;
  onChange: (answer: CategorizeAnswer) => void;
}

export default function CategorizeQuestion({ question, value, onChange }: CategorizeQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategorizeAnswer>({});

  useEffect(() => {
    if (value) {
      setCategories(value);
    } else {
      // Initialize empty categories
      const initialCategories: CategorizeAnswer = {};
      question.categories?.forEach(category => {
        initialCategories[category] = [];
      });
      setCategories(initialCategories);
    }
  }, [value, question.categories]);

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove item from all categories first
    const newCategories = { ...categories };
    Object.keys(newCategories).forEach(category => {
      newCategories[category] = newCategories[category].filter(item => item !== draggedItem);
    });

    // Add to target category
    if (!newCategories[targetCategory]) {
      newCategories[targetCategory] = [];
    }
    newCategories[targetCategory] = [...newCategories[targetCategory], draggedItem];

    setCategories(newCategories);
    onChange(newCategories);
    setDraggedItem(null);
  };

  const moveItemToCategory = (item: string, targetCategory: string) => {
    const newCategories = { ...categories };
    
    // Remove item from all categories first
    Object.keys(newCategories).forEach(category => {
      newCategories[category] = newCategories[category].filter(i => i !== item);
    });

    // Add to target category
    if (!newCategories[targetCategory]) {
      newCategories[targetCategory] = [];
    }
    newCategories[targetCategory] = [...newCategories[targetCategory], item];

    setCategories(newCategories);
    onChange(newCategories);
  };

  const getUnassignedItems = () => {
    const assignedItems = new Set();
    Object.values(categories).forEach(items => {
      items.forEach(item => assignedItems.add(item));
    });
    return question.options?.filter(item => !assignedItems.has(item)) || [];
  };

  const unassignedItems = getUnassignedItems();

  return (
    <div className="space-y-6">
      {/* Items to categorize */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Items to categorize:</h3>
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg min-h-[60px]">
          {unassignedItems.map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(item)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow select-none"
            >
              {item}
            </div>
          ))}
          {unassignedItems.length === 0 && (
            <p className="text-gray-500 text-sm">All items have been categorized</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.categories?.map((category, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px]"
          >
            <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
            <div className="space-y-2">
              {categories[category]?.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md flex items-center justify-between group"
                >
                  <span>{item}</span>
                  <select
                    value={category}
                    onChange={(e) => moveItemToCategory(item, e.target.value)}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-xs bg-white border border-gray-300 rounded px-1 py-0.5 transition-opacity"
                  >
                    <option value="">Move to...</option>
                    {question.categories?.map((cat) => (
                      <option key={cat} value={cat} disabled={cat === category}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}