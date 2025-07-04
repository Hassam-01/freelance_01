import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown , Trash2 } from 'lucide-react';
import { ThemeFontsEditor } from './ThemeFontsEditor';

interface ThemeFonts {
  titleFont: string;
  bodyFont: string;
  name?: string;
  id?: string;
}

interface ThemeFontsManagerProps {
  onThemeFontsChange: (fonts: ThemeFonts[]) => void;
  onApplyFonts: (fonts: ThemeFonts) => void;  
  initialThemeFonts?: ThemeFonts[];
}

export const ThemeFontsManager: React.FC<ThemeFontsManagerProps> = ({
  onThemeFontsChange,
  onApplyFonts,
  initialThemeFonts = []
}) => {
  const [themeFontsList, setThemeFontsList] = useState<ThemeFonts[]>(initialThemeFonts);
  const [showEditor, setShowEditor] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editingFonts, setEditingFonts] = useState<ThemeFonts | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = (fonts: ThemeFonts) => {
    const newFonts = { ...fonts, id: `theme-fonts-${Date.now()}` };
    const updatedList = [...themeFontsList, newFonts];
    
    setThemeFontsList(updatedList);
    onThemeFontsChange(updatedList);
    onApplyFonts(newFonts);
    setShowEditor(false);
    setShowDropdown(false);
  };

  const handleCustomThemeClick = () => {
    setShowEditor(true);
    setShowDropdown(false);
  };

  const handleApply = (fonts: ThemeFonts) => {
    onApplyFonts(fonts);
  };

  const handleEdit = (fonts: ThemeFonts) => {
    setEditingFonts(fonts);
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    const updatedList = themeFontsList.filter((fonts) => fonts.id !== id);
    setThemeFontsList(updatedList);
    onThemeFontsChange(updatedList);
  };

return (
    <div className="theme-fonts-dropdown position-relative" ref={dropdownRef}>
      <button
        className="btn btn-primary d-flex align-items-center gap-1"
        onMouseEnter={() => setShowDropdown(true)}
      >
        <Plus size={16} />
        Create New Theme Fonts
        <ChevronDown size={16} />
      </button>

      {showDropdown && (
        <div 
          className="dropdown-menu show position-absolute w-100"
          style={{ minWidth: '250px' }}
        >
          {themeFontsList.map((fonts) => (
            <button
              key={fonts.id}
              className="dropdown-item d-flex justify-content-between align-items-center"
              onClick={() => {
                onApplyFonts(fonts);
                setShowDropdown(false);
              }}
            >
              <div>
                <div>{fonts.name || 'Unnamed Theme'}</div>
                <small className="text-muted">
                  {fonts.titleFont} / {fonts.bodyFont}
                </small>
              </div>
            </button>
          ))}
          
          {themeFontsList.length > 0 && (
            <div className="dropdown-divider"></div>
          )}
          
          <button
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={handleCustomThemeClick}
          >
            <Plus size={16} />
            Custom Theme Selection
          </button>
        </div>
      )}

      {showEditor && (
        <ThemeFontsEditor
          onSave={handleSave}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};