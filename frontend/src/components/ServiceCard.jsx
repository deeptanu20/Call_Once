import React from 'react';

const ServiceCard = ({ service }) => (
  <div className="border p-4 rounded">
    <h2 className="text-xl font-bold">{service.title}</h2>
    <p>{service.description}</p>
    <button className="bg-blue-500 text-white px-4 py-2 mt-2">Book Now</button>
  </div>
);

export default ServiceCard;
