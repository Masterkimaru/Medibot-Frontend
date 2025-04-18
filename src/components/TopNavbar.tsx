// src/components/TopNavbar.tsx
import React, { useState } from 'react';
import { FaUserMd, FaAmbulance, FaBars } from 'react-icons/fa';
import ConsultDocModal from './ConsultDocModal';
import EmergencyModal from './EmergencyModal';

interface Props {
  onMenuClick?: () => void;
}

const TopNavbar: React.FC<Props> = ({ onMenuClick }) => {
  // State to control modal visibility for each action
  const [consultDocOpen, setConsultDocOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white shadow-sm px-4 py-3 flex justify-between items-center z-10">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden text-xl text-gray-700 cursor-pointer"
          onClick={onMenuClick}
        >
          <FaBars />
        </button>

        <div className="flex gap-4 ml-auto">
          {/* Consult Doc Button */}
          <button
            onClick={() => setConsultDocOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 transition text-sm cursor-pointer"
          >
            <FaUserMd />
            <span className="hidden sm:inline">Consult Doc</span>
          </button>
          {/* Emergency Button */}
          <button
            onClick={() => setEmergencyOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm cursor-pointer"
          >
            <FaAmbulance />
            <span className="hidden sm:inline">Emergency</span>
          </button>
        </div>
      </header>

      {/* Modals */}
      <ConsultDocModal
        isOpen={consultDocOpen}
        onClose={() => setConsultDocOpen(false)}
      />
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </>
  );
};

export default TopNavbar;
