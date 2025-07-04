import React, { useState } from 'react';
import { Presentation } from 'lucide-react';
import PPTModal from './PPTModal';

const PresentationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Presentation size={24} />
            Open settings
          </button>
        </div>
      </div>

      <PPTModal 
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PresentationPage;