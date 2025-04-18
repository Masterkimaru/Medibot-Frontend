// src/components/SymptomTrackerModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { trackSymptom, SymptomEntry } from '../services/api';

interface SymptomTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SymptomTrackerModal: React.FC<SymptomTrackerModalProps> = ({ isOpen, onClose }) => {
  const [entry, setEntry] = useState<SymptomEntry>({
    date: new Date().toISOString().slice(0, 16),
    symptom: '',
    severity: 5,
    duration: '',
    triggers: [],
    medications: '',
    notes: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addTrigger = () => {
    const t = tagInput.trim();
    if (!t) return;
    setEntry({ ...entry, triggers: [...entry.triggers!, t] });
    setTagInput('');
  };

  const handleChange = <K extends keyof SymptomEntry>(key: K, value: SymptomEntry[K]) => {
    setEntry(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await trackSymptom(entry);
      if (res.status === 'ok') setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setEntry({
      date: new Date().toISOString().slice(0, 16),
      symptom: '',
      severity: 5,
      duration: '',
      triggers: [],
      medications: '',
      notes: '',
    });
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Symptom Tracker</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium mb-1">Date &amp; Time</label>
              <input
                type="datetime-local"
                value={entry.date}
                onChange={e => handleChange('date', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {/* Symptom */}
            <div>
              <label className="block text-sm font-medium mb-1">Symptom</label>
              <input
                type="text"
                value={entry.symptom}
                onChange={e => handleChange('symptom', e.target.value)}
                placeholder="e.g. Headache"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium mb-1">Severity (1–10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={entry.severity}
                onChange={e => handleChange('severity', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm font-medium">{entry.severity}</div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                value={entry.duration}
                onChange={e => handleChange('duration', e.target.value)}
                placeholder="e.g. 2 hours"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium mb-1">Triggers</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="e.g. Stress"
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={addTrigger}
                  className="px-3 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.triggers!.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                    {t}
                    <button
                      type="button"
                      onClick={() =>
                        handleChange('triggers', entry.triggers!.filter((_, j) => j !== i))
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <label className="block text-sm font-medium mb-1">Medications / Treatments</label>
              <input
                type="text"
                value={entry.medications}
                onChange={e => handleChange('medications', e.target.value)}
                placeholder="e.g. Ibuprofen 200mg"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                rows={4}
                value={entry.notes}
                onChange={e => handleChange('notes', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                placeholder="Any additional context..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Log Symptom'}
              </button>
            </div>

            {/* Success */}
            {success && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-center">
                ✔️ Symptom logged successfully!
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default SymptomTrackerModal;