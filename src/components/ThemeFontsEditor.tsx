import React, { useState } from 'react';
import { X, Type, Save, Check } from 'lucide-react';
import './ThemeFontsEditor.css';

export interface ThemeFonts {
  titleFont: string;
  bodyFont: string;
  name?: string;
}

interface ThemeFontsEditorProps {
  onSave: (fonts: ThemeFonts) => void;
  onClose: () => void;
  initialFonts?: ThemeFonts;
}

const commonFonts = [
  { name: 'Arial', category: 'Sans-serif' },
  { name: 'Calibri', category: 'Sans-serif' },
  { name: 'Times New Roman', category: 'Serif' },
  { name: 'Helvetica', category: 'Sans-serif' },
  { name: 'Georgia', category: 'Serif' },
  { name: 'Verdana', category: 'Sans-serif' },
  { name: 'Tahoma', category: 'Sans-serif' },
  { name: 'Trebuchet MS', category: 'Sans-serif' },
  { name: 'Century Gothic', category: 'Sans-serif' },
  { name: 'Garamond', category: 'Serif' }
];

export const ThemeFontsEditor: React.FC<ThemeFontsEditorProps> = ({
  onSave,
  onClose,
  initialFonts
}) => {
  const [themeFonts, setThemeFonts] = useState<ThemeFonts>(
    initialFonts || {
      name: '',
      titleFont: 'Arial',
      bodyFont: 'Calibri'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(themeFonts);
  };

  const FontPreview = ({ font, type }: { font: string; type: 'title' | 'body' }) => {
    const sampleText = type === 'title' 
      ? 'Main Heading Sample'
      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';
    
    const fontSize = type === 'title' ? '24px' : '16px';
    
    return (
      <div className="font-preview">
        <div className="font-info">
          <div className="font-name">{font}</div>
          <div className="font-category">
            {commonFonts.find(f => f.name === font)?.category}
          </div>
        </div>
        <div 
          className="preview-text"
          style={{ 
            fontFamily: font,
            fontSize
          }}
        >
          {sampleText}
        </div>
      </div>
    );
  };

  return (
    <div className="fonts-editor-overlay">
      <div className="fonts-editor-container">
        <div className="fonts-editor-content">
          <div className="fonts-editor-header">
            <div className="header-content">
              <Type size={24} className="header-icon" />
              <div>
                <h4>Theme Fonts Editor</h4>
                <p>Customize your presentation's typography</p>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fonts-editor-body">
              <div className="theme-name-section">
                <label htmlFor="themeName">Theme Name</label>
                <input
                  type="text"
                  id="themeName"
                  value={themeFonts.name || ''}
                  onChange={(e) => setThemeFonts({ ...themeFonts, name: e.target.value })}
                  placeholder="Enter theme name"
                />
              </div>

              <div className="fonts-section">
                <div className="font-group">
                  <label htmlFor="titleFont">Heading Font</label>
                  <select
                    id="titleFont"
                    value={themeFonts.titleFont}
                    onChange={(e) => setThemeFonts({ ...themeFonts, titleFont: e.target.value })}
                  >
                    {commonFonts.map(({ name, category }) => (
                      <option key={name} value={name}>
                        {name} ({category})
                      </option>
                    ))}
                  </select>
                  <FontPreview font={themeFonts.titleFont} type="title" />
                </div>

                <div className="font-group">
                  <label htmlFor="bodyFont">Body Font</label>
                  <select
                    id="bodyFont"
                    value={themeFonts.bodyFont}
                    onChange={(e) => setThemeFonts({ ...themeFonts, bodyFont: e.target.value })}
                  >
                    {commonFonts.map(({ name, category }) => (
                      <option key={name} value={name}>
                        {name} ({category})
                      </option>
                    ))}
                  </select>
                  <FontPreview font={themeFonts.bodyFont} type="body" />
                </div>
              </div>
            </div>

            <div className="fonts-editor-footer">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-save">
                <Save size={18} />
                Save Theme Fonts
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};