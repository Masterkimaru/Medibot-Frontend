// src/components/ConsultDocModal.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ConsultDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultDocModal: React.FC<ConsultDocModalProps> = ({ isOpen, onClose }) => {
  // Simple state for each field (you may also use one state object)
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [currentMeds, setCurrentMeds] = useState('');
  const [allergies, setAllergies] = useState('');
  const [previousTreatments, setPreviousTreatments] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultReason, setConsultReason] = useState('');
  const [preferredDoctor, setPreferredDoctor] = useState('');
  const [consultMode, setConsultMode] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [availability, setAvailability] = useState('');
  const [locationPreference, setLocationPreference] = useState('');
  const [insurance, setInsurance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You could process the form, send to backend for doctor matching, etc.
    console.log({
      fullName, dob, gender, contact, address,
      symptoms, symptomDuration, severity, existingConditions,
      currentMeds, allergies, previousTreatments,
      specialty, consultReason, preferredDoctor,
      consultMode, preferredLanguage, availability,
      locationPreference, insurance,
    });
    // Close modal after submission (or show a success message)
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-full"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition cursor-pointer"
              onClick={onClose}
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Consult Doctor
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Personal Information */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">Basic Personal Information</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Contact Details (Phone/Email)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
              </div>

              {/* Section 2: Medical Information */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">Medical Information</h3>
                <textarea
                  placeholder="Symptoms (e.g., fever, headache, chest pain)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Duration of Symptoms"
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Severity (mild, moderate, severe)"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Existing Medical Conditions"
                  value={existingConditions}
                  onChange={(e) => setExistingConditions(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Current Medications"
                  value={currentMeds}
                  onChange={(e) => setCurrentMeds(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Allergies"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <textarea
                  placeholder="Previous Diagnoses or Treatments"
                  value={previousTreatments}
                  onChange={(e) => setPreviousTreatments(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
              </div>

              {/* Section 3: Preferred Doctor */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">Preferred Doctor/Specialist</h3>
                <input
                  type="text"
                  placeholder="Medical Specialty Needed (e.g., cardiologist)"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Reason for Consultation"
                  value={consultReason}
                  onChange={(e) => setConsultReason(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Preferred Doctor's Name (Optional)"
                  value={preferredDoctor}
                  onChange={(e) => setPreferredDoctor(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
              </div>

              {/* Section 4: Logistical Preferences */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">Logistical Preferences</h3>
                <select
                  value={consultMode}
                  onChange={(e) => setConsultMode(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                >
                  <option value="">Select Consultation Mode</option>
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                </select>
                <input
                  type="text"
                  placeholder="Preferred Language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Availability / Time Slot"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Location Preference"
                  value={locationPreference}
                  onChange={(e) => setLocationPreference(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Insurance Details"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ConsultDocModal;
