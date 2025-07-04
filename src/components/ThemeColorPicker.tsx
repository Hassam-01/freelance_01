import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { X, Paintbrush, RotateCcw, Save } from 'lucide-react';
import './ThemeColorPicker.css';

interface ThemeColors {
  textDark1: string;
  textLight1: string;
  textDark2: string;
  textLight2: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;
  hyperlink: string;
  followedHyperlink: string;
}

interface ThemeColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colors: ThemeColors, name: string) => void;
}

export const defaultThemeColors: ThemeColors = {
  textDark1: '#44546A',
  textLight1: '#FFFFFF',
  textDark2: '#44546A',
  textLight2: '#E7E6E6',
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  hyperlink: '#0563C1',
  followedHyperlink: '#954F72'
};

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ isOpen, onClose, onSave }) => {
  const [colors, setColors] = React.useState<ThemeColors>(defaultThemeColors);
  const [name, setName] = React.useState('Custom 1');
  const [activeSection, setActiveSection] = React.useState<'text' | 'accent' | 'links'>('text');

  const colorSections = {
    text: ['textDark1', 'textLight1', 'textDark2', 'textLight2'],
    accent: ['accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6'],
    links: ['hyperlink', 'followedHyperlink']
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  // Sample chart data
  const generateChartData = (isDark: boolean) => [
    { name: '1', value: 30, fill: colors.accent1 },
    { name: '2', value: 45, fill: colors.accent2 },
    { name: '3', value: 65, fill: colors.accent3 },
    { name: '4', value: 50, fill: colors.accent4 },
    { name: '5', value: 40, fill: colors.accent5 },
    { name: '6', value: 25, fill: colors.accent6 }
  ];

  // Sample component that includes both chart and text
  const SamplePreview = ({ isDark }: { isDark: boolean }) => {
    const bgColor = isDark ? colors.textDark1 : colors.textLight1;
    const textColor = isDark ? colors.textLight1 : colors.textDark1;
    
    return (
      <div className="p-3" style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        height: '200px',
        borderRadius: '4px'
      }}>
        <div className="mb-2">Text</div>
        <div style={{ height: '100px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={generateChartData(isDark)}>
              <XAxis dataKey="name" tick={false} />
              <Bar dataKey="value">
                {generateChartData(isDark).map((entry, index) => (
                  <Bar
                    key={`cell-${index}`}
                    dataKey="value"
                    fill={entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ color: colors.hyperlink }}>Hyperlink</div>
        <div style={{ color: colors.followedHyperlink }}>Hyperlink</div>
      </div>
    );
  };

  return (
    <div className="theme-picker-overlay">
      <div className="theme-picker-container">
        <div className="theme-picker-content">
          <div className="theme-picker-header">
            <div className="header-content">
              <Paintbrush size={24} className="header-icon" />
              <div>
                <h4>Theme Color Editor</h4>
                <p>Customize your presentation's color scheme</p>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="theme-picker-body">
            <div className="row g-4">
              <div className="col-md-7">
                <div className="color-sections">
                  <div className="section-tabs">
                    {Object.entries(colorSections).map(([section, _]) => (
                      <button
                        key={section}
                        className={`section-tab ${activeSection === section ? 'active' : ''}`}
                        onClick={() => setActiveSection(section as 'text' | 'accent' | 'links')}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)} Colors
                      </button>
                    ))}
                  </div>

                  <div className="color-inputs">
                    {colorSections[activeSection].map((key) => (
                      <div key={key} className="color-input-group">
                        <label className="color-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <div className="color-input-wrapper">
                          <input
                            type="color"
                            value={colors[key as keyof ThemeColors]}
                            onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                            className="color-input"
                          />
                          <input
                            type="text"
                            value={colors[key as keyof ThemeColors].toUpperCase()}
                            onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                            className="color-text-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="theme-name-input">
                  <label>Theme Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter theme name"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-md-5">
                <div className="preview-section">
                  <h6>Preview</h6>
                  <div className="preview-container">
                    <div className="preview-item">
                      <label>Dark Theme</label>
                      <SamplePreview isDark={true} />
                    </div>
                    <div className="preview-item">
                      <label>Light Theme</label>
                      <SamplePreview isDark={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="theme-picker-footer">
            <button className="btn btn-reset" onClick={() => setColors(defaultThemeColors)}>
              <RotateCcw size={18} />
              Reset
            </button>
            <div className="footer-actions">
              <button className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-save" onClick={() => onSave(colors, name)}>
                <Save size={18} />
                Save Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};