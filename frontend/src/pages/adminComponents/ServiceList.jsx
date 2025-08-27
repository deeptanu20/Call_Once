import { Edit2, Trash2, DollarSign, Calendar, Clock } from 'lucide-react';

const ServiceList = ({ services, handleDeleteService }) => { // handleEditService,
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Services</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    {service.availability}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-lg font-bold text-gray-800">${service.price}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mb-4">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex space-x-2">
                    {/* <button
                      onClick={() => handleEditService(service)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-300"
                      aria-label="Edit service"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button> */}
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-300"
                      aria-label="Delete service"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;

