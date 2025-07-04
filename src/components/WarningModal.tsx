import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="warning-modal">
        <div className="warning-modal-content">
          <div className="warning-header">
            <AlertTriangle size={24} />
            <h3>Unsaved Changes</h3>
          </div>
          <div className="warning-message">
            You have unsaved changes. Are you sure you want to close without saving?
          </div>
          <div className="warning-actions">
            <button className="warning-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="warning-confirm" onClick={onConfirm}>
              Close Without Saving
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
