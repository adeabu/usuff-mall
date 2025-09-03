import React from 'react';

function PainAssessment({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      pain: { ...formData.pain, [e.target.name]: e.target.value },
    });
  };

  const handlePsfsChange = (index, field, value) => {
    const newPsfs = [...formData.pain.psfs];
    newPsfs[index] = { ...newPsfs[index], [field]: value };
    setFormData({ ...formData, pain: { ...formData.pain, psfs: newPsfs } });
  };

  const addPsfs = () => {
    setFormData({
      ...formData,
      pain: { ...formData.pain, psfs: [...formData.pain.psfs, { activity: '', score: 0 }] },
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pain Assessment</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Pain Localization</label>
        <textarea
          name="localization"
          value={formData.pain.localization}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="e.g., Lower back, left shoulder"
        />
      </div>
      <div className="mb-2">
        <h3 className="font-bold">PSFS (0 = Unable, 10 = No Problem)</h3>
        {formData.pain.psfs.map((psfs, index) => (
          <div key={index} className="flex mb-2 items-center">
            <input
              type="text"
              placeholder="Activity"
              value={psfs.activity}
              onChange={(e) => handlePsfsChange(index, 'activity', e.target.value)}
              className="border p-2 flex-1 mr-2 rounded"
            />
            <input
              type="range"
              min="0"
              max="10"
              value={psfs.score}
              onChange={(e) => handlePsfsChange(index, 'score', parseInt(e.target.value))}
              className="w-1/3"
            />
            <span className="ml-2">{psfs.score}</span>
          </div>
        ))}
        {formData.pain.psfs.length < 3 && (
          <button className="bg-blue-500 text-white p-2 rounded" onClick={addPsfs}>
            Add Activity
          </button>
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Borg CR10 Pain (0–10)</label>
        <input
          type="range"
          name="borgPain"
          min="0"
          max="10"
          value={formData.pain.borgPain}
          onChange={handleChange}
          className="w-full"
        />
        <span>{formData.pain.borgPain}</span>
      </div>
    </div>
  );
}

export default PainAssessment;