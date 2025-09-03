import React from 'react';

function GenderSelection({ setGender, setStep }) {
  const handleChange = (e) => {
    setGender(e.target.value);
    if (e.target.value) setStep(1);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-700 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Select Gender</h2>
      <select
        onChange={handleChange}
        className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-base"
        aria-label="Select patient gender"
      >
        <option value="">Select...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
  );
}

export default GenderSelection;