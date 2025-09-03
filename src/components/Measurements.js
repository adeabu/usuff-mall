import React from 'react';

function Measurements({ formData, setFormData, gender }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      measurements: { ...formData.measurements, [name]: value },
    });
  };

  const { age, height, weight } = formData.measurements;
  const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(2) : '';
  const maxHr = age ? 220 - parseInt(age) : '';
  const weight55 = weight ? (weight * 0.55).toFixed(2) : '';

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Measurements</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Age (years)</label>
        <input
          type="number"
          name="age"
          value={age}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          min="0"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Height (cm)</label>
        <input
          type="number"
          name="height"
          value={height}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          min="0"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Weight (kg)</label>
        <input
          type="number"
          name="weight"
          value={weight}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          min="0"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">BMI</label>
        <input type="text" value={bmi} readOnly className="border p-2 w-full rounded bg-gray-100" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Max Heart Rate (bpm)</label>
        <input type="text" value={maxHr} readOnly className="border p-2 w-full rounded bg-gray-100" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">55% of Body Weight (kg)</label>
        <input type="text" value={weight55} readOnly className="border p-2 w-full rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default Measurements;