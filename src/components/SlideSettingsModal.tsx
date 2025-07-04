import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle, Palette, RotateCcw } from 'lucide-react';
import { Modal, Button, Form, Nav, Spinner, Row, Col, Card } from 'react-bootstrap';
import { Slide, SlideSettings } from './PPTTypes';
import "./SlideSettingsModal.css";
import WarningModal from './WarningModal';
import { ChartEditor } from './charts/ChartEditor';
import { ThemeColors } from './PPTTypes';

interface SlideSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SlideSettings, updatedSlide: Slide) => void; // Updated to include the full slide
  initialSlide?: Slide;
  mode: 'create' | 'edit';
}

// Extended SlideSettings to include themeColors
interface ExtendedSlideSettings extends SlideSettings {
  themeColors: ThemeColors;
}

interface PreviewProps {
  settings: ExtendedSlideSettings;
  logoPreview: string;
  onUpdateSubSlide: (index: number, field: string, value: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  currentSubSlides: any[]; // Use current sub-slides from state
  defaultThemeColors: ThemeColors;
}

const Preview: React.FC<PreviewProps> = ({
  settings,
  logoPreview,
  onUpdateSubSlide,
  setHasUnsavedChanges,
  currentSubSlides,
  defaultThemeColors
}) => {
  const getSlideSize = () => {
    switch (settings.general.slideSize) {
      case 'standard': return { width: 1024, height: 768 };
      case 'widescreen': return { width: 1280, height: 720 };
      case 'custom': return {
        width: settings.general.customWidth || 1280,
        height: settings.general.customHeight || 720
      };
      default: return { width: 1024, height: 768 };
    }
  };

  const { width, height } = getSlideSize();
  const containerWidth = 800;
  const scale = containerWidth / width;
  const scaledHeight = height * scale;

  const currentThemeColors = settings.themeColors;

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h6 className="preview-title">Preview</h6>
        <div className="preview-size-info">
          {width} x {height}px
        </div>
      </div>
      
      <div className="slides-preview-wrapper">
        {currentSubSlides.map((subSlide, index) => (
          <div 
            key={subSlide.id}
            className="preview-wrapper mb-4"
            style={{
              width: `${containerWidth}px`,
              height: `${scaledHeight}px`,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              margin: '0 auto',
              transition: 'all 0.3s ease'
            }}
          >
              {logoPreview && (
                <div className={`logo-container logo-${settings.general.logoPosition}`}>
                  <img 
                    src={logoPreview} 
                    alt="Logo" 
                    className="slide-logo"
                  />
                </div>
              )}

              <div 
                className="slide-content"
                style={{
                  backgroundColor: settings.colors.background,
                  transition: 'background-color 0.3s ease'
                }}
              >
                <div 
                  className="editable-title"
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    color: settings.colors.titleColor,
                    fontFamily: settings.fonts.titleFont,
                    transition: 'color 0.3s ease, font-family 0.3s ease'
                  }}
                  onBlur={(e) => onUpdateSubSlide(index, 'title', e.currentTarget.textContent || '')}
                  onInput={() => setHasUnsavedChanges(true)}
                >
                  {subSlide.title || 'Click to edit title'}
                </div>
                
                <div 
                  className="editable-content"
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    color: settings.colors.contentColor,
                    fontFamily: settings.fonts.bodyFont,
                    transition: 'color 0.3s ease, font-family 0.3s ease'
                  }}
                  onBlur={(e) => onUpdateSubSlide(index, 'content', e.currentTarget.textContent || '')}
                  onInput={() => setHasUnsavedChanges(true)}
                >
                  {subSlide.content || 'Click to edit content'}
                </div>

                {subSlide.chart && (
                  <div className="chart-container">
                    <ChartEditor
                      key={`preview-${subSlide.chart.id}-${JSON.stringify(currentThemeColors)}`}
                      chartData={subSlide.chart}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      themeColors={currentThemeColors}
                      isPreviewMode={true}
                      slideId={0}
                    />
                  </div>
                )}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ThemeColorEditor: React.FC<{
  themeColors: ThemeColors;
  onThemeColorsChange: (colors: ThemeColors) => void;
  onColorChange: (colorType: keyof ThemeColors, color: string) => void;
   slideColors: {
    background: string;
    titleColor: string;
    contentColor: string;
  };
  onSlideColorChange: (colorType: 'background' | 'titleColor' | 'contentColor', color: string) => void;
}> = ({ themeColors, onThemeColorsChange, onColorChange, slideColors, onSlideColorChange }) => {
  
  const defaultThemeColors: ThemeColors = {
    textDark1: '#000000',
    textLight1: '#FFFFFF',
    textDark2: '#333333',
    textLight2: '#F5F5F5',
    accent1: '#4472C4',
    accent2: '#ED7D31',
    accent3: '#A5A5A5',
    accent4: '#FFC000',
    accent5: '#5B9BD5',
    accent6: '#70AD47',
    hyperlink: '#0563C1',
    followedHyperlink: '#954F72'
  };

  const predefinedThemes = [
    {
      name: 'Office',
      colors: {
        textDark1: '#000000',
        textLight1: '#FFFFFF',
        textDark2: '#333333',
        textLight2: '#F5F5F5',
        accent1: '#4472C4',
        accent2: '#ED7D31',
        accent3: '#A5A5A5',
        accent4: '#FFC000',
        accent5: '#5B9BD5',
        accent6: '#70AD47',
        hyperlink: '#0563C1',
        followedHyperlink: '#954F72'
      }
    },
    {
      name: 'Colorful',
      colors: {
        textDark1: '#000000',
        textLight1: '#FFFFFF',
        textDark2: '#333333',
        textLight2: '#F5F5F5',
        accent1: '#E74C3C',
        accent2: '#F39C12',
        accent3: '#F1C40F',
        accent4: '#2ECC71',
        accent5: '#3498DB',
        accent6: '#9B59B6',
        hyperlink: '#3498DB',
        followedHyperlink: '#8E44AD'
      }
    },
    {
      name: 'Blue',
      colors: {
        textDark1: '#1F4E79',
        textLight1: '#FFFFFF',
        textDark2: '#2F5F8F',
        textLight2: '#F2F8FF',
        accent1: '#4472C4',
        accent2: '#5B9BD5',
        accent3: '#A5A5A5',
        accent4: '#70AD47',
        accent5: '#FFC000',
        accent6: '#C55A11',
        hyperlink: '#0563C1',
        followedHyperlink: '#954F72'
      }
    },
    {
      name: 'Green',
      colors: {
        textDark1: '#0F5132',
        textLight1: '#FFFFFF',
        textDark2: '#198754',
        textLight2: '#F8FFF9',
        accent1: '#70AD47',
        accent2: '#4472C4',
        accent3: '#A5A5A5',
        accent4: '#FFC000',
        accent5: '#5B9BD5',
        accent6: '#ED7D31',
        hyperlink: '#0563C1',
        followedHyperlink: '#954F72'
      }
    }
  ];

  const resetToDefault = () => {
    onThemeColorsChange(defaultThemeColors);
  };

  const applyPredefinedTheme = (theme: typeof predefinedThemes[0]) => {
    onThemeColorsChange(theme.colors);
    onSlideColorChange('background', theme.colors.textLight1);
    onSlideColorChange('titleColor', theme.colors.textDark1);
    onSlideColorChange('contentColor', theme.colors.textDark2);
  };

  const ColorPickerRow: React.FC<{
    label: string;
    colorKey: keyof ThemeColors;
    description?: string;
  }> = ({ label, colorKey, description }) => (
    <Row className="mb-3 align-items-center">
      <Col xs={4}>
        <Form.Label className="mb-0">{label}</Form.Label>
        {description && <small className="text-muted d-block">{description}</small>}
      </Col>
      <Col xs={3}>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="color"
            value={themeColors[colorKey]}
            onChange={(e) => onColorChange(colorKey, e.target.value)}
            style={{ width: '50px', height: '38px' }}
          />
          <div 
            className="color-preview"
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: themeColors[colorKey],
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </Col>
      <Col xs={5}>
        <Form.Control
          type="text"
          value={themeColors[colorKey]}
          onChange={(e) => onColorChange(colorKey, e.target.value)}
          className="font-monospace"
          style={{ fontSize: '0.875rem' }}
        />
      </Col>
    </Row>
  );

  const SlideColorPickerRow: React.FC<{
    label: string;
    colorKey: 'background' | 'titleColor' | 'contentColor';
    description?: string;
  }> = ({ label, colorKey, description }) => (
    <Row className="mb-3 align-items-center">
      <Col xs={4}>
        <Form.Label className="mb-0">{label}</Form.Label>
        {description && <small className="text-muted d-block">{description}</small>}
      </Col>
      <Col xs={3}>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="color"
            value={slideColors[colorKey]}
            onChange={(e) => onSlideColorChange(colorKey, e.target.value)}
            style={{ width: '50px', height: '38px' }}
          />
          <div 
            className="color-preview"
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: slideColors[colorKey],
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </Col>
      <Col xs={5}>
        <Form.Control
          type="text"
          value={slideColors[colorKey]}
          onChange={(e) => onSlideColorChange(colorKey, e.target.value)}
          className="font-monospace"
          style={{ fontSize: '0.875rem' }}
        />
      </Col>
    </Row>
  );

  return (
    <div className="theme-color-editor">
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Slide Colors</h6>
        </Card.Header>
        <Card.Body>
          <SlideColorPickerRow 
            label="Background" 
            colorKey="background" 
            description="Slide background color" 
          />
          <SlideColorPickerRow 
            label="Title Color" 
            colorKey="titleColor" 
            description="Color for slide titles" 
          />
          <SlideColorPickerRow 
            label="Content Color" 
            colorKey="contentColor" 
            description="Color for slide content text" 
          />
        </Card.Body>
      </Card>
      {/* Predefined Themes */}
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0 d-flex align-items-center">
            <Palette className="me-2" size={18} />
            Theme Variants
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            {predefinedThemes.map((theme) => (
              <Col xs={6} md={3} key={theme.name} className="mb-3">
                <div 
                  className="theme-variant"
                  style={{ cursor: 'pointer' }}
                  onClick={() => applyPredefinedTheme(theme)}
                >
                  <div className="theme-variant-preview mb-2">
                    <div className="d-flex" style={{ height: '40px' }}>
                      <div style={{ 
                        backgroundColor: theme.colors.textDark1, 
                        width: '20%' 
                      }} />
                      <div style={{ 
                        backgroundColor: theme.colors.accent1, 
                        width: '20%' 
                      }} />
                      <div style={{ 
                        backgroundColor: theme.colors.accent2, 
                        width: '20%' 
                      }} />
                      <div style={{ 
                        backgroundColor: theme.colors.accent3, 
                        width: '20%' 
                      }} />
                      <div style={{ 
                        backgroundColor: theme.colors.accent4, 
                        width: '20%' 
                      }} />
                    </div>
                  </div>
                  <small className="text-center d-block">{theme.name}</small>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Text Colors */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Text Colors</h6>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={resetToDefault}
          >
            <RotateCcw size={14} className="me-1" />
            Reset
          </Button>
        </Card.Header>
        <Card.Body>
          <ColorPickerRow 
            label="Dark 1" 
            colorKey="textDark1" 
            description="Primary text" 
          />
          <ColorPickerRow 
            label="Light 1" 
            colorKey="textLight1" 
            description="Background" 
          />
          <ColorPickerRow 
            label="Dark 2" 
            colorKey="textDark2" 
            description="Secondary text" 
          />
          <ColorPickerRow 
            label="Light 2" 
            colorKey="textLight2" 
            description="Light background" 
          />
        </Card.Body>
      </Card>

      {/* Accent Colors */}
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Accent Colors</h6>
        </Card.Header>
        <Card.Body>
          <ColorPickerRow label="Accent 1" colorKey="accent1" />
          <ColorPickerRow label="Accent 2" colorKey="accent2" />
          <ColorPickerRow label="Accent 3" colorKey="accent3" />
          <ColorPickerRow label="Accent 4" colorKey="accent4" />
          <ColorPickerRow label="Accent 5" colorKey="accent5" />
          <ColorPickerRow label="Accent 6" colorKey="accent6" />
        </Card.Body>
      </Card>

      {/* Link Colors */}
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Link Colors</h6>
        </Card.Header>
        <Card.Body>
          <ColorPickerRow 
            label="Hyperlink" 
            colorKey="hyperlink" 
            description="Unvisited links" 
          />
          <ColorPickerRow 
            label="Followed Hyperlink" 
            colorKey="followedHyperlink" 
            description="Visited links" 
          />
        </Card.Body>
      </Card>
    </div>
  );
};

const SlideSettingsModal: React.FC<SlideSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSlide,
  mode
}) => {
    const [activeMenu, setActiveMenu] = useState<'general' | 'colors' | 'fonts'>('general');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    const defaultThemeColors: ThemeColors = {
        textDark1: '#000000',
        textLight1: '#FFFFFF',
        textDark2: '#333333',
        textLight2: '#F5F5F5',
        accent1: '#4472C4',
        accent2: '#ED7D31',
        accent3: '#A5A5A5',
        accent4: '#FFC000',
        accent5: '#5B9BD5',
        accent6: '#70AD47',
        hyperlink: '#0563C1',
        followedHyperlink: '#954F72'
    };

    const [settings, setSettings] = useState<ExtendedSlideSettings>({
        colors: {
            background: initialSlide?.background || '#ffffff',
            titleColor: initialSlide?.titleColor || '#000000',
            contentColor: initialSlide?.contentColor || '#333333'
        },
        fonts: {
            titleFont: initialSlide?.titleFont || 'Arial',
            bodyFont: initialSlide?.bodyFont || 'Calibri'
        },
        general: {
            slideSize: initialSlide?.slideSize || 'standard',
            customWidth: initialSlide?.customWidth || 1280,
            customHeight: initialSlide?.customHeight || 720,
            logo: initialSlide?.logo || '',
            logoPosition: initialSlide?.logoPosition || 'top-left'
        },
        subSlides: initialSlide?.subSlides || [{
            id: `new-${Date.now()}`,
            title: '',
            content: ''
        }],
        themeColors: defaultThemeColors
    });

    // Keep track of current sub-slides state separately for real-time preview updates
    const [currentSubSlides, setCurrentSubSlides] = useState(
        initialSlide?.subSlides || [{
            id: `new-${Date.now()}`,
            title: '',
            content: ''
        }]
    );

    const [showWarning, setShowWarning] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(initialSlide?.logo || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setLogoPreview(base64String);
            updateSettings('general', 'logo', base64String);
        };
        reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
      if (initialSlide) {
        const newSettings = {
            colors: {
                background: initialSlide.background || '#ffffff',
                titleColor: initialSlide.titleColor || '#000000',
                contentColor: initialSlide.contentColor || '#333333'
            },
            fonts: {
                titleFont: initialSlide.titleFont || 'Arial',
                bodyFont: initialSlide.bodyFont || 'Calibri'
            },
            general: {
                slideSize: initialSlide.slideSize || 'standard',
                customWidth: initialSlide.customWidth || 1280,
                customHeight: initialSlide.customHeight || 720,
                logo: initialSlide.logo || '',
                logoPosition: initialSlide.logoPosition || 'top-left'
            },
            subSlides: initialSlide.subSlides || [{
                id: `new-${Date.now()}`,
                title: '',
                content: ''
            }],
            themeColors: initialSlide.themeColors || defaultThemeColors
        };
        
        setSettings(newSettings);
        setCurrentSubSlides(initialSlide.subSlides || [{
            id: `new-${Date.now()}`,
            title: '',
            content: ''
        }]);
        setLogoPreview(initialSlide.logo || '');
      }
    }, [initialSlide]);

    useEffect(() => {
        if (isOpen) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'unset';
        }
        return () => {
        document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        if (hasUnsavedChanges) {
            setShowWarning(true);
        } else {
            onClose();
        }
    };

  const handleSave = async () => {
      try {
          setIsSaving(true);
          
          // Create the updated slide object with all current data
          const updatedSlide: Slide = {
              id: initialSlide?.id || Date.now(),
              background: settings.colors.background,
              titleColor: settings.colors.titleColor,
              contentColor: settings.colors.contentColor,
              titleFont: settings.fonts.titleFont,
              bodyFont: settings.fonts.bodyFont,
              logo: settings.general.logo,
              logoPosition: settings.general.logoPosition as Slide['logoPosition'],
              slideSize: settings.general.slideSize as Slide['slideSize'],
              customWidth: settings.general.customWidth,
              customHeight: settings.general.customHeight,
              subSlides: currentSubSlides.map(subSlide => ({
                ...subSlide,
                chart: subSlide.chart ? {
                  ...subSlide.chart,
                  themeColors: settings.themeColors
                } : subSlide.chart
              })),
              themeColors: settings.themeColors
          };

          const { themeColors, ...slideSettings } = settings;
          
          slideSettings.subSlides = currentSubSlides;
          
          await onSave(slideSettings, updatedSlide);
          setHasUnsavedChanges(false);
          onClose();
      } catch (error) {
          console.error('Error saving settings:', error);
      } finally {
        setIsSaving(false);
      }
  };

  const updateSettings = (
    section: keyof ExtendedSlideSettings,
    field: string,
    value: string | any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateSubSlide = (index: number, field: string, value: string) => {
    // Update both the settings and the current sub-slides for real-time preview
    const updatedSubSlides = currentSubSlides.map((subSlide, i) => 
      i === index ? { ...subSlide, [field]: value } : subSlide
    );
    
    setCurrentSubSlides(updatedSubSlides);
    
    setSettings(prev => ({
      ...prev,
      subSlides: updatedSubSlides
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleThemeColorsChange = (newThemeColors: ThemeColors) => {
    setSettings(prev => ({
      ...prev,
      themeColors: newThemeColors,
      // colors: {
      //   ...prev.colors,
      //   background: newThemeColors.textLight1,
      //   titleColor: newThemeColors.textDark1,
      //   contentColor: newThemeColors.textDark2
      // }
    }));
    setHasUnsavedChanges(true);
  };

  const handleThemeColorChange = (colorType: keyof ThemeColors, color: string) => {
    const newThemeColors = {
      ...settings.themeColors,
      [colorType]: color
    };
    
    setSettings(prev => ({
      ...prev,
      themeColors: newThemeColors
    }));
    setHasUnsavedChanges(true);

    if (colorType === 'textLight1') {
      handleSlideColorChange('background', color);
    } else if (colorType === 'textDark1') {
      handleSlideColorChange('titleColor', color);
    } else if (colorType === 'textDark2') {
      handleSlideColorChange('contentColor', color);
    }
  };

  const handleSlideColorChange = (colorType: 'background' | 'titleColor' | 'contentColor', color: string) => {
    updateSettings('colors', colorType, color);
  };

  const renderGeneralSettings = () => (
    <Form>
      <Form.Group className="mb-4">
        <Form.Label>Slide Size</Form.Label>
        <Form.Select
          value={settings.general.slideSize}
          onChange={(e) => updateSettings('general', 'slideSize', e.target.value)}
          className="mb-2"
        >
          <option value="standard">Standard (4:3)</option>
          <option value="widescreen">Widescreen (16:9)</option>
          <option value="custom">Custom</option>
        </Form.Select>

        {settings.general.slideSize === 'custom' && (
          <div className="d-flex gap-3 mt-2">
            <Form.Group>
              <Form.Label>Width (px)</Form.Label>
              <Form.Control
                type="number"
                value={settings.general.customWidth}
                onChange={(e) => updateSettings('general', 'customWidth', parseInt(e.target.value))}
                min="100"
                max="3840"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Height (px)</Form.Label>
              <Form.Control
                type="number"
                value={settings.general.customHeight}
                onChange={(e) => updateSettings('general', 'customHeight', parseInt(e.target.value))}
                min="100"
                max="2160"
              />
            </Form.Group>
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Logo</Form.Label>
        <div className="d-flex gap-3 align-items-start">
          <div className="logo-upload-container">
            <div 
              className="logo-preview"
              style={{
                width: '100px',
                height: '100px',
                border: '1px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <span className="text-muted">No logo</span>
              )}
            </div>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mb-2"
            />
          </div>
          
          <Form.Group>
            <Form.Label>Logo Position</Form.Label>
            <Form.Select
              value={settings.general.logoPosition}
              onChange={(e) => updateSettings('general', 'logoPosition', e.target.value)}
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </Form.Select>
          </Form.Group>
        </div>
      </Form.Group>
    </Form>
  );

  if (!isOpen) return null;

  const renderPreview = () => {
     return <Preview
        settings={settings}
        logoPreview={logoPreview}
        onUpdateSubSlide={updateSubSlide}
        setHasUnsavedChanges={setHasUnsavedChanges}
        currentSubSlides={currentSubSlides} // Pass current sub-slides
        defaultThemeColors={defaultThemeColors}
    />
  };

  return (
      <>
          <Modal 
              show={isOpen} 
              onHide={handleClose}
              size="xl"
              className="settings-modal"
          >
              <Modal.Header closeButton>
              <Modal.Title>{mode === 'create' ? 'Create New Slide' : 'Edit Slide'}</Modal.Title>
              </Modal.Header>

              <Modal.Body className="p-0">
              <div className="d-flex h-100">
                  <Nav 
                  className="flex-column settings-sidebar"
                  variant="pills"
                  >
                  <Nav.Item>
                      <Nav.Link 
                      active={activeMenu === 'general'}
                      onClick={() => setActiveMenu('general')}
                      >
                      General
                      </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link 
                      active={activeMenu === 'colors'}
                      onClick={() => setActiveMenu('colors')}
                      >
                      Colors
                      </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link 
                      active={activeMenu === 'fonts'}
                      onClick={() => setActiveMenu('fonts')}
                      >
                      Fonts
                      </Nav.Link>
                  </Nav.Item>
                  </Nav>

                  <div className="settings-main flex-grow-1 p-3">
                  
                      <div className="settings-form mt-4">
                          {activeMenu === 'general' && renderGeneralSettings()}
                          
                          {activeMenu === 'colors' && (
                            <ThemeColorEditor
                              themeColors={settings.themeColors}
                              onThemeColorsChange={handleThemeColorsChange}
                              onColorChange={handleThemeColorChange}
                              slideColors={settings.colors}
                              onSlideColorChange={handleSlideColorChange}
                            />
                          )}

                          {activeMenu === 'fonts' && (
                          <Form>
                              <Form.Group className="mb-3">
                              <Form.Label>Title Font</Form.Label>
                              <Form.Select
                                  value={settings.fonts.titleFont}
                                  onChange={(e) => updateSettings('fonts', 'titleFont', e.target.value)}
                              >
                                  <option value="Arial">Arial</option>
                                  <option value="Helvetica">Helvetica</option>
                                  <option value="Times New Roman">Times New Roman</option>
                                  <option value="Calibri">Calibri</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Verdana">Verdana</option>
                              </Form.Select>
                              </Form.Group>
                              <Form.Group>
                              <Form.Label>Body Font</Form.Label>
                              <Form.Select
                                  value={settings.fonts.bodyFont}
                                  onChange={(e) => updateSettings('fonts', 'bodyFont', e.target.value)}
                              >
                                                                    <option value="Calibri">Calibri</option>
                                  <option value="Arial">Arial</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Times New Roman">Times New Roman</option>
                                  <option value="Helvetica">Helvetica</option>
                                  <option value="Verdana">Verdana</option>
                              </Form.Select>
                              </Form.Group>
                          </Form>
                          )}
                      </div>
                        {renderPreview()}
                  </div>
              </div>
              </Modal.Body>

              <Modal.Footer>
                <Button 
                  variant="secondary" 
                  onClick={handleClose}
                  disabled={isSaving}
                >
                    Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                      <>
                          <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                          />
                          Saving...
                      </>
                  ) : (
                      'Save Settings'
                  )}
                </Button>
              </Modal.Footer>
          </Modal>

          <Modal 
              show={showWarning} 
              onHide={() => setShowWarning(false)} 
              centered
              className="warning-modal"
          >
              <Modal.Header closeButton>
                  <Modal.Title>
                      <div className="d-flex align-items-center gap-2 text-danger">
                          <AlertTriangle size={24} />
                          Unsaved Changes
                      </div>
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  Are you sure you want to close? Your changes will be lost.
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" className="btn-cancel" onClick={() => setShowWarning(false)}>
                      Cancel
                  </Button>
                  <Button 
                      variant="danger"
                      className="btn-discard"
                      onClick={() => {
                          setShowWarning(false);
                          onClose();
                      }}
                  >
                      Discard Changes
                  </Button>
              </Modal.Footer>
          </Modal>
      </>
    );
};

export default SlideSettingsModal;