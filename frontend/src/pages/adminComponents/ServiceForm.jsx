/* eslint-disable react/prop-types */
import { IndianRupee, Upload, X } from 'lucide-react';

const ServiceForm = ({
  newService,
  categories,
  editingService,
  handleInputChange,
  handleSubmit,
  handleImageUpload,
  handleRemoveExistingImage,
  handleRemoveNewImage,
  handleIconUpload,
  handleRemoveIcon,
}) => {
  const remainingImages = 5 - (newService.existingImages.length + newService.images.length);

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        {editingService ? 'Edit Service' : 'Add New Service'}
      </h2>
      
      {/* Icon Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Icon
        </label>
        
        {/* Existing or New Icon Preview */}
        {(newService.existingIcon || newService.icon) && (
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={newService.icon ? URL.createObjectURL(newService.icon) : newService.existingIcon}
              alt="Service icon"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveIcon}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Icon Upload Button */}
        {!newService.icon && !newService.existingIcon && (
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload service icon</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleIconUpload}
              />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Existing form fields... */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter service name"
            value={newService.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>

        {/* Rest of the existing form fields... */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter service description"
            value={newService.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="0.00"
              value={newService.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
        </div>

        {/* Category and Availability fields... */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={newService.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none bg-white"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="availability"
                value="Available"
                checked={newService.availability === "Available"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Available</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="availability"
                value="Unavailable"
                checked={newService.availability === "Unavailable"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Unavailable</span>
            </label>
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images ({5 - remainingImages}/5)
          </label>
          
          {/* Existing Images */}
          {newService.existingImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {newService.existingImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Service ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(imageUrl)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* New Images Preview */}
          {newService.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {newService.images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload Button */}
          {remainingImages > 0 && (
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Upload up to {remainingImages} more image{remainingImages !== 1 ? 's' : ''}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 transform hover:scale-105"
        >
          {editingService ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;

