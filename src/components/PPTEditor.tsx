import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Save, Settings, 
  BarChart2, Palette, Layout, Monitor, Trash2, Edit2, Check
} from 'lucide-react';
import { ChartData } from './charts/ChartTypes';
import { DEFAULT_CHART_DATA } from './charts/ChartConstants';
import { ChartModal } from './charts/ChartModal';
import { ChartEditor } from './charts/ChartEditor';
import { ChartToolbar } from './charts/ChartToolbar';
import { defaultThemeColors, ThemeColorPicker } from './ThemeColorPicker';
import { ThemeFontsManager } from './ThemeFontsManager';
import { ThemeFonts } from './ThemeFontsEditor';
import { Slide, SubSlide, PresentationSettings, SlideSettings } from './PPTTypes';
import './PPTEditor.css';
import SlideSettingsModal from './SlideSettingsModal';
import { toast } from 'react-toastify';


interface Theme {
  name: string;
  background: string;
  titleColor: string;
  contentColor: string;
  colors?: ThemeColors;
}

interface SlideSize {
  width: string;
  height: string;
  name: string;
}

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

interface EditingState {
  slideId: number | null;
  field: 'title' | 'content' | null;
}

const predefinedThemes: Theme[] = [
  {
    name: 'Default',
    background: '#ffffff',
    titleColor: '#000000',
    contentColor: '#333333'
  },
  {
    name: 'Dark',
    background: '#2c3e50',
    titleColor: '#ffffff',
    contentColor: '#ecf0f1'
  },
  {
    name: 'Professional',
    background: '#f8f9fa',
    titleColor: '#2c3e50',
    contentColor: '#34495e'
  },
  {
    name: 'Creative',
    background: '#f0f3f4',
    titleColor: '#e74c3c',
    contentColor: '#2c3e50'
  }
];

interface PPTEditorProps {
  onSettingsChange?: (settings: PresentationSettings) => void;
  initialSettings?: PresentationSettings | null;
  currentTheme?: {
    colors: ThemeColors;
  };
}


const PPTEditor: React.FC<PPTEditorProps> = ({ 
  onSettingsChange,
  initialSettings,
  currentTheme: providedTheme 
}) => {
  // Predefined slide sizes
  const slideSizes: SlideSize[] = [
    { name: 'Standard (4:3)', width: '800px', height: '600px' },
    { name: 'Widescreen (16:9)', width: '960px', height: '540px' },
    { name: 'Custom', width: '100%', height: 'auto' }
  ];


  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      background: predefinedThemes[0].background,
      titleColor: predefinedThemes[0].titleColor,
      contentColor: predefinedThemes[0].contentColor,
      titleFont: 'Arial',
      bodyFont: 'Calibri',
      slideSize: 'standard',
      customWidth: 1024,
      customHeight: 768,
      themeColors: defaultThemeColors,
      subSlides: [
        {
          id: 'slide1-bar',
          title: "Sales Performance",
          content: "This chart shows quarterly sales performance comparison.",
          chart: {
            id: 'theme1-bar-chart',
            type: 'bar',
            title: 'Sales Performance',
            data: [
              { name: 'Q1', Series1: 65, Series2: 45 },
              { name: 'Q2', Series1: 45, Series2: 55 },
              { name: 'Q3', Series1: 75, Series2: 35 },
              { name: 'Q4', Series1: 55, Series2: 65 }
            ]
          }
        },
        {
          id: 'slide1-line',
          title: "Monthly Trends",
          content: "Visualizing the monthly growth trends across different series.",
          chart: {
            id: 'theme1-line-chart',
            type: 'line',
            title: 'Monthly Trends',
            data: [
              { name: 'Jan', Series1: 30, Series2: 40 },
              { name: 'Feb', Series1: 45, Series2: 50 },
              { name: 'Mar', Series1: 55, Series2: 45 },
              { name: 'Apr', Series1: 60, Series2: 65 },
              { name: 'May', Series1: 75, Series2: 70 }
            ]
          }
        },
        {
          id: 'slide1-pie',
          title: "Market Distribution",
          content: "Breakdown of market share across different products.",
          chart: {
            id: 'theme1-pie-chart',
            type: 'pie',
            title: 'Market Distribution',
            data: [
              { name: 'Product A', value: 35 },
              { name: 'Product B', value: 25 },
              { name: 'Product C', value: 20 },
              { name: 'Product D', value: 15 },
              { name: 'Product E', value: 5 }
            ]
          }
        }
      ]
    },
  ]);

  const [showChartModal, setShowChartModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<Theme>(predefinedThemes[0]);
  // const [currentSize, setCurrentSize] = useState<SlideSize>(slideSizes[0]);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [customBackground, setCustomBackground] = useState<string>(predefinedThemes[0].background);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themes, setThemes] = useState<Theme[]>(predefinedThemes);
  const [themeFonts, setThemeFonts] = useState<ThemeFonts[]>([]);

  const [showSlideSettingsModal, setShowSlideSettingsModal] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  
  useEffect(() => {
    if (onSettingsChange) {
      const currentSettings: PresentationSettings = {
        theme: {
          name: currentTheme.name,
          background: currentTheme.background,
          titleColor: currentTheme.titleColor,
          contentColor: currentTheme.contentColor,
          colors: currentTheme.colors
        },
        // slideSize: currentSize,
        // fonts: {
        //   titleFont: slides[currentSlide]?.titleFont || 'Arial',
        //   bodyFont: slides[currentSlide]?.bodyFont || 'Calibri'
        // },
        slides: slides
      };

      onSettingsChange(currentSettings);
    }
  }, [
    slides, 
    currentTheme, 
    // currentSize, 
    currentSlide, 
    onSettingsChange
  ]);
  

  // const themeColors = slides[currentSlide]?.themeColors || currentTheme?.colors || defaultThemeColors;

  const [editingState, setEditingState] = useState<EditingState>({
    slideId: null,
    field: null
  });

  const handleEdit = (slideId: number) => {
    const slideToEdit = slides.find(s => s.id === slideId);
    if (slideToEdit) {
        setEditingSlideId(slideId);
        setShowSlideSettingsModal(true);
    }
  };

  // const saveSettingsToBackend = async (settings: SlideSettings) => {
  //     try {
  //       console.log('Saving settings:', settings);
  //         // const response = await fetch('/api/presentation/settings', {
  //         //     method: 'POST',
  //         //     headers: {
  //         //         'Content-Type': 'application/json',
  //         //     },
  //         //     body: JSON.stringify(settings)
  //         // });

  //         // if (!response.ok) {
  //         //     throw new Error('Failed to save settings');
  //         // }

  //         // const data = await response.json();
  //         // return data;
  //     } catch (error) {
  //         console.error('Error saving settings:', error);
  //         throw error;
  //     }
  // };

  // Updated to handle both settings and the full updated slide
  const handleSlideSettingsSave = async (settings: SlideSettings, updatedSlide: Slide) => {
      try {
          // await saveSettingsToBackend(settings);

          // Update the slides array with the complete updated slide
          const updatedSlides = slides.map(slide => {
              if (slide.id === editingSlideId) {
                return {
                  ...updatedSlide,
                  themeColors: updatedSlide.themeColors || defaultThemeColors,
                  titleFont: updatedSlide.titleFont || 'Arial',
                  bodyFont: updatedSlide.bodyFont || 'Calibri'
                };
              }
              return slide;
          });
          
          setSlides(updatedSlides);
          setShowSlideSettingsModal(false);
          setEditingSlideId(null);

          // Show success message
          toast.success('Settings saved successfully');

          if (editingSlideId === slides[currentSlide].id) {
            const updatedTheme = {
                ...currentTheme,
                background: updatedSlide.background,
                titleColor: updatedSlide.titleColor,
                contentColor: updatedSlide.contentColor,
                colors: updatedSlide.themeColors || defaultThemeColors
            };
            setCurrentTheme(updatedTheme);
          }
          
          if (onSettingsChange) {
              const currentSettings: PresentationSettings = {
                  theme: {
                      name: currentTheme.name,
                      background: currentTheme.background,
                      titleColor: currentTheme.titleColor,
                      contentColor: currentTheme.contentColor,
                      colors: currentTheme.colors
                  },
                  // slideSize: currentSize,
                  // fonts: {
                  //   titleFont: slides[currentSlide]?.titleFont || updatedSlide.titleFont || 'Arial',
                  //   bodyFont: slides[currentSlide]?.bodyFont || updatedSlide.bodyFont || 'Calibri'
                  // },
                  slides: updatedSlides
              };
              onSettingsChange(currentSettings);
          }
          
      } catch (error) {
          // Show error message
          toast.error('Failed to save settings. Please try again.');
          console.error('Error in handleSlideSettingsSave:', error);
      }
  };


  const handleCreateNew = () => {
    setEditingSlideId(null);
    setShowSlideSettingsModal(true);
  };

  const handleFieldEdit = (field: 'title' | 'content') => {
    setEditingState(prev => ({ ...prev, field }));
  };

  const handleFieldSave = () => {
    setEditingState({ slideId: null, field: null });
  };

  const updateSlideContent = (slideId: number, field: 'title' | 'content', value: string) => {
    setSlides(slides.map(slide => 
      slide.id === slideId 
        ? {
            ...slide,
            subSlides: slide.subSlides.map((subSlide, index) => 
              index === 0 
                ? { ...subSlide, [field]: value }
                : subSlide
            )
          }
        : slide
    ));
  };

  
  const addNewSlide = () => {
    const theme1Content = slides[currentSlide] || slides[0];
    const newSlide: Slide = {
      id: slides.length + 1,
      background: theme1Content.background,
      titleColor: theme1Content.titleColor,
      contentColor: theme1Content.contentColor,
      themeColors: theme1Content.themeColors || defaultThemeColors,
      titleFont: theme1Content.titleFont || 'Arial',
      bodyFont: theme1Content.bodyFont || 'Calibri',
      slideSize: theme1Content.slideSize || 'standard', // Copy slide size
      customWidth: theme1Content.customWidth || 1024, // Copy custom dimensions
      customHeight: theme1Content.customHeight || 768,
      subSlides: [
        {
          id: `slide${slides.length + 1}-bar`,
          title: "Sales Performance",
          content: "This chart shows quarterly sales performance comparison.",
          chart: {
            id: `theme${slides.length + 1}-bar-chart`,
            type: 'bar',
            title: 'Sales Performance',
            themeColors: theme1Content.themeColors || defaultThemeColors,
            data: [
              { name: 'Q1', Series1: 65, Series2: 45 },
              { name: 'Q2', Series1: 45, Series2: 55 },
              { name: 'Q3', Series1: 75, Series2: 35 },
              { name: 'Q4', Series1: 55, Series2: 65 }
            ]
          }
        },
        {
          id: `slide${slides.length + 1}-line`,
          title: "Monthly Trends",
          content: "Visualizing the monthly growth trends across different series.",
          chart: {
            id: `theme${slides.length + 1}-line-chart`,
            type: 'line',
            title: 'Monthly Trends',
            themeColors: theme1Content.themeColors || defaultThemeColors,
            data: [
              { name: 'Jan', Series1: 30, Series2: 40 },
              { name: 'Feb', Series1: 45, Series2: 50 },
              { name: 'Mar', Series1: 55, Series2: 45 },
              { name: 'Apr', Series1: 60, Series2: 65 },
              { name: 'May', Series1: 75, Series2: 70 }
            ]
          }
        },
        {
          id: `slide${slides.length + 1}-pie`,
          title: "Market Distribution",
          content: "Breakdown of market share across different products.",
          chart: {
            id: `theme${slides.length + 1}-pie-chart`,
            type: 'pie',
            title: 'Market Distribution',
            themeColors: theme1Content.themeColors || defaultThemeColors,
            data: [
              { name: 'Product A', value: 35 },
              { name: 'Product B', value: 25 },
              { name: 'Product C', value: 20 },
              { name: 'Product D', value: 15 },
              { name: 'Product E', value: 5 }
            ]
          }
        }
      ]
    };
    setSlides([...slides, newSlide]);
    setCurrentSlide(slides.length);
  };


  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    const updatedSlides = slides.map((slide, index) => {
      if (index === currentSlide) {
        return {
          ...slide,
          background: theme.background,
          titleColor: theme.titleColor,
          contentColor: theme.contentColor,
          themeColors: theme.colors || defaultThemeColors,
          titleFont: slide.titleFont || 'Arial',
          bodyFont: slide.bodyFont || 'Calibri'
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
    setCustomBackground(theme.background);
  };

  const updateSlideBackground = (color: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      background: color
    };
    setSlides(updatedSlides);
    setCustomBackground(color);
  };

  const handleSaveTheme = (colors: ThemeColors, name: string) => {
    const newTheme: Theme = {
      name,
      background: colors.textLight1,
      titleColor: colors.textDark1,
      contentColor: colors.textDark2,
      colors
    };
    console.log(newTheme)
    setThemes(prev => [...prev, newTheme]);
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    setShowThemeModal(false)
  };

  const navigateSlide = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === 'next' && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const savePresentation = () => {
    const presentationData = JSON.stringify({
      slides,
      theme: currentTheme,
      // slideSize: currentSize
    });
    const blob = new Blob([presentationData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  
  const applyFonts = (fonts: ThemeFonts) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index === currentSlide) {
        return {
          ...slide,
          titleFont: fonts.titleFont,
          bodyFont: fonts.bodyFont
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const updateSubSlideTitle = (slideIndex: number, subSlideIndex: number, title: string) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides[subSlideIndex].title = title;
    setSlides(updatedSlides);
  };

  const updateSubSlideContent = (slideIndex: number, subSlideIndex: number, content: string) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides[subSlideIndex].content = content;
    setSlides(updatedSlides);
  };

  const updateSubSlideChart = (slideIndex: number, subSlideIndex: number, updatedChart: ChartData) => {
    const updatedSlides = [...slides];

    const slideThemeColors = slides[slideIndex].themeColors || defaultThemeColors;
  
    const chartWithThemeColors = {
      ...updatedChart,
      themeColors: slideThemeColors
    };
  
    updatedSlides[slideIndex].subSlides[subSlideIndex].chart = chartWithThemeColors;
    setSlides(updatedSlides);
  };

  const deleteSubSlide = (slideIndex: number, subSlideIndex: number) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides.splice(subSlideIndex, 1);
    setSlides(updatedSlides);
  };

  const getSlideWidth = (slide: Slide): string => {
    switch (slide.slideSize) {
      case 'standard': return '800px';
      case 'widescreen': return '960px';
      case 'custom': return `${slide.customWidth || 800}px`;
      default: return '800px';
    }
  };

  const getSlideHeight = (slide: Slide): string => {
    switch (slide.slideSize) {
      case 'standard': return '600px';
      case 'widescreen': return '540px';
      case 'custom': return `${slide.customHeight || 600}px`;
      default: return '600px';
    }
  };

  const getChartHeightByAspectRatio = (slide: Slide): string => {
    switch (slide.slideSize) {
      case 'standard': // 4:3 aspect ratio
        return '75%'; // height = 75% of width (3/4 = 0.75)
      case 'widescreen': // 16:9 aspect ratio
        return '56.25%'; // height = 56.25% of width (9/16 = 0.5625)
      case 'custom':
        if (slide.customWidth && slide.customHeight) {
          const aspectRatio = slide.customHeight / slide.customWidth;
          return `${(aspectRatio * 100).toFixed(2)}%`;
        }
        return '75%'; // fallback to 4:3
      default:
        return '75%'; // fallback to 4:3
    }
  };

  return (
    <div className="ppt-editor">
      <div className="editor-toolbar">
        <div className="toolbar-section">
          <button 
            className="toolbar-btn"
            onClick={() => navigateSlide('prev')} 
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </span>
          <button 
            className="toolbar-btn"
            onClick={() => navigateSlide('next')} 
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="toolbar-section">
          {/* <button 
            className="toolbar-btn primary"
            onClick={addNewSlide}
          >
            <Plus size={20} />
            <span>New Slide</span>
          </button> */}
          <button 
            className="toolbar-btn success"
            onClick={savePresentation}
          >
            <Save size={20} />
            <span>Save</span>
          </button>
        </div>

        <div className="toolbar-section">
          <button 
            className={`toolbar-btn ${showCustomize ? 'active' : ''}`}
            onClick={() => setShowCustomize(!showCustomize)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
          {/* <button 
            className="toolbar-btn"
            onClick={() => setShowChartModal(true)}
          >
            <BarChart2 size={20} />
            <span>Chart</span>
          </button> */}
          <button 
            className="toolbar-btn"
            onClick={() => setShowThemeModal(true)}
          >
            <Palette size={20} />
            <span>Theme</span>
          </button>
          <ThemeFontsManager
            onThemeFontsChange={setThemeFonts}
            onApplyFonts={applyFonts}
            initialThemeFonts={themeFonts}
          />
        </div>
      </div>

      {showCustomize && (
        <div className="settings-panel">
          <div className="settings-content">
            <div className="settings-section">
              <h6>Presentation Theme</h6>
              <div className="theme-grid">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    className={`theme-btn ${currentTheme.name === theme.name ? 'active' : ''}`}
                    onClick={() => applyTheme(theme)}
                    style={{
                      backgroundColor: theme.background,
                      color: theme.titleColor
                    }}
                  >
                    <div className="theme-preview">
                      <div className="theme-title" style={{ color: theme.titleColor }}>
                        {theme.name}
                      </div>
                      <div className="theme-content" style={{ color: theme.contentColor }}>
                        Sample Text
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* <div className="settings-section">
              <h6>Slide Size</h6>
              <div className="size-options">
                {slideSizes.map((size) => (
                  <button
                    key={size.name}
                    className={`size-btn ${currentSize.name === size.name ? 'active' : ''}`}
                    onClick={() => setCurrentSize(size)}
                  >
                    <Monitor size={20} />
                    <span>{size.name}</span>
                  </button>
                ))}
              </div>
            </div> */}

            <div className="settings-section">
              <h6>Background Color</h6>
              <div className="color-picker">
                <input
                  type="color"
                  value={customBackground}
                  onChange={(e) => updateSlideBackground(e.target.value)}
                />
                <span>{customBackground.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="editor-content">
        <div className="slides-sidebar">
          {/* New Slide button remains the same */}
        <div className="slide-thumbnail new-slide-thumbnail" onClick={addNewSlide}>
          <div 
            className="thumbnail-preview"
            style={{
              backgroundColor: currentTheme.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="new-slide-content">
              <Plus size={20} style={{ color: currentTheme.titleColor }} />
              <span className="thumbnail-title" style={{ color: currentTheme.titleColor }}>
                Create New
              </span>
            </div>
          </div>
        </div>

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-thumbnail ${index === currentSlide ? 'active' : ''}`}
          >
            <div 
              className="thumbnail-preview"
              style={{
                backgroundColor: slide.background,
                cursor: editingState.slideId === slide.id ? 'default' : 'pointer',
              }}
              onClick={() => {
                if (editingState.slideId !== slide.id) {
                  setCurrentSlide(index);
                }
              }}
            >
            <div 
              className="thumbnail-content" 
              style={{ color: slide.titleColor }}
              data-editing={editingState.slideId === slide.id}
            >
              {editingState.slideId === slide.id && editingState.field === 'title' ? (
                <input
                  type="text"
                  value={slide.subSlides[0].title} // Use first subSlide's title
                  onChange={(e) => updateSubSlideTitle(index, 0, e.target.value)}
                  className="edit-input title-input"
                  autoFocus
                  onBlur={handleFieldSave}
                  onKeyPress={(e) => e.key === 'Enter' && handleFieldSave()}
                />
              ) : (
                <div className="thumbnail-title">
                  {slide.subSlides[0].title}
                </div>
              )}

              <div className="thumbnail-text" style={{ color: slide.contentColor }}>
                  {slide.subSlides[0].content.substring(0, 35) + "..."}
                </div>
              
              {/* {editingState.slideId === slide.id && editingState.field === 'content' ? (
                <textarea
                  value={slide.subSlides[0].content}
                  onChange={(e) => updateSubSlideContent(index, 0, e.target.value)}
                  className="edit-input content-input"
                  autoFocus
                  onBlur={handleFieldSave}
                />
              ) : (
                <div className="thumbnail-text" style={{ color: slide.contentColor }}>
                  {slide.subSlides[0].content.substring(0, 50)}
                </div>
              )} */}
            </div>


            </div>
            <div className="thumbnail-footer">
              <div className="thumbnail-number">Theme {index + 1}</div>
              {editingState.slideId === slide.id ? (
                <button 
                  className="edit-button active"
                  onClick={handleFieldSave}
                >
                  <Check size={16} />
                </button>
              ) : (
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(slide.id)}
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        </div>

        <div className="slide-editor">
          <div 
            className="slide-container"
            
          >
            {slides[currentSlide].subSlides.map((subSlide, index) => (
              <div 
                key={subSlide.id}
                className="slide-content mb-4"
                style={{
                  backgroundColor: slides[currentSlide].background,
                  position: 'relative'
                }}
              >
                {slides[currentSlide].logo && (
                  <div className={`logo-container logo-${slides[currentSlide].logoPosition || 'top-left'}`}>
                    <img 
                      src={slides[currentSlide].logo} 
                      alt="Logo" 
                      className="slide-logo"
                    />
                  </div>
                )}
                <input
                  type="text"
                  className="slide-title"
                  value={subSlide.title}
                  onChange={(e) => updateSubSlideTitle(currentSlide, index, e.target.value)}
                  placeholder="Click to add title"
                  style={{
                    color: slides[currentSlide].titleColor,
                    fontFamily: slides[currentSlide].titleFont || 'inherit'
                  }}
                  readOnly={editingState.slideId !== slides[currentSlide].id}
                />
                <textarea
                  className="slide-body"
                  value={subSlide.content}
                  onChange={(e) => updateSubSlideContent(currentSlide, index, e.target.value)}
                  placeholder="Click to add content"
                  style={{
                    color: slides[currentSlide].contentColor,
                    fontFamily: slides[currentSlide].bodyFont || 'inherit'
                  }}
                  readOnly={editingState.slideId !== slides[currentSlide].id}
                />
                
                <div className="chart-container" 
                  style={{
                    width: "100%",
                    height: getChartHeightByAspectRatio(slides[currentSlide])
                  }}
                >
                  <ChartEditor
                    key={`${subSlide.chart.id}-${slides[currentSlide].id}`}
                    chartData={subSlide.chart}
                    onUpdate={(updatedChart) => updateSubSlideChart(currentSlide, index, updatedChart)}
                    onDelete={() => deleteSubSlide(currentSlide, index)}
                    themeColors={slides[currentSlide].themeColors || defaultThemeColors} 
                    slideId={slides[currentSlide].id}
                    isPreviewMode={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <ThemeColorPicker
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onSave={handleSaveTheme}
      />
      <ChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        onSelectChart={(type) => {
          const newSubSlide: SubSlide = {
            id: `slide${currentSlide + 1}-${type}`,
            title: `New ${type} Chart`,
            content: `This is a new ${type} chart`,
            chart: {
              id: `chart-${Date.now()}`,
              type,
              title: `New ${type} Chart`,
              data: DEFAULT_CHART_DATA[type]
            }
          };
          
          const updatedSlides = [...slides];
          updatedSlides[currentSlide].subSlides.push(newSubSlide);
          setSlides(updatedSlides);
        }}
      />

      <SlideSettingsModal
        isOpen={showSlideSettingsModal}
        onClose={() => setShowSlideSettingsModal(false)}
        onSave={handleSlideSettingsSave}
        initialSlide={slides.find(s => s.id === editingSlideId)}
        mode={editingSlideId ? 'edit' : 'create'}
      />

    </div>
  );
};

export default PPTEditor;