import React from 'react';

function PatientInfo({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      patientInfo: { ...formData.patientInfo, [e.target.name]: e.target.value },
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Patient Information</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.patientInfo.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Personal ID</label>
        <input
          type="text"
          name="persNr"
          value={formData.patientInfo.persNr}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.patientInfo.date}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
    </div>
  );
}

export default PatientInfo;