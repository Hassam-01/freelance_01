import React, { useState, useCallback } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Save, Settings, X, AlertCircle } from 'lucide-react';
import PPTEditor from './PPTEditor';
import { PPTSettingsService } from './PPTSettingsService';
import { PresentationSettings } from './PPTTypes';
import { toast } from 'react-toastify';
import './PPTModal.css';

interface PPTModalProps {
  show: boolean;
  onHide: () => void;
  initialSettings?: PresentationSettings;
}

const PPTModal: React.FC<PPTModalProps> = ({ 
  show, 
  onHide,
  initialSettings 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PresentationSettings | null>(initialSettings || null);

  const handleSettingsChange = useCallback((newSettings: PresentationSettings) => {
    setSettings(newSettings);
  }, []);

  const handleSave = async () => {
     console.log("handleSave");
    if (!settings) {
      toast.error('No settings to save');
      return;
    }

    if (!PPTSettingsService.validateSettings(settings)) {
      toast.error('Invalid settings configuration');
      return;
    }

    setIsSaving(true);
    try {
      console.log(settings);
      const response = await PPTSettingsService.saveSettings(settings);
      toast.success('Settings saved successfully');
      onHide();
      console.log('Save response:', response);
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      backdrop="static"
      // fullscreen="xxl-down"
      keyboard={false}
      centered
      className="ppt-editor-modal"
    >
      <Modal.Header className="border-0 px-4 pt-4 pb-0">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-2">
            <Settings className="text-primary" size={24} />
            <Modal.Title className="mb-0 h4">
              Presentation Settings
            </Modal.Title>
          </div>
          <button
            className="btn-close-custom"
            onClick={onHide}
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <div className="settings-container">
          {!settings && (
            <div className="no-settings-warning">
              <AlertCircle size={24} className="text-warning" />
              <p>No settings loaded. Start customizing your presentation.</p>
            </div>
          )}
          <div className="position-relative editor-container">
            <PPTEditor
              onSettingsChange={handleSettingsChange}
              initialSettings={settings}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4 pt-2">
        <div className="d-flex justify-content-between w-100">
          <Button 
            variant="light" 
            onClick={onHide} 
            disabled={isSaving}
            className="btn-cancel"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-save"
          >
            {isSaving ? (
              <div className="d-flex align-items-center gap-2">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Save size={18} />
                <span>Save Settings</span>
              </div>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PPTModal;