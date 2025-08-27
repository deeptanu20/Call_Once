import React from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';

const CategoryList = ({ categories, handleEditCategory, handleDeleteCategory }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
              <div className="flex justify-end space-x-2">
                <button
                  className="flex items-center justify-center p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors duration-300"
                  onClick={() => handleEditCategory(category)}
                >
                  <PencilIcon className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </button>
                <button
                  className="flex items-center justify-center p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-300"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <TrashIcon className="h-5 w-5" />
                  <span className="sr-only">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {categories.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No categories found. Add a category to get started.</p>
      )}
    </div>
  );
};

export default CategoryList;

