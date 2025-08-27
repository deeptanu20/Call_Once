/* eslint-disable react/prop-types */
import { useState } from 'react';

const BookingForm = ({ booking, handleUpdateBooking }) => {
  const [updatedBooking, setUpdatedBooking] = useState({
    ...booking,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking({ ...updatedBooking, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateBooking(booking._id, updatedBooking);
  };

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            name="status"
            value={updatedBooking.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
