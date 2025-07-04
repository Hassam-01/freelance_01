import { DOMUtils } from '../utils/dom';
import { StorageUtils } from '../utils/storage';
import { Slide, Theme, ThemeColors, ChartData, SubSlide } from '../types';
import { DEFAULT_THEME_COLORS, PREDEFINED_THEMES, DEFAULT_CHART_DATA } from '../constants';
import { ChartManager } from './ChartManager';
import { ThemeManager } from './ThemeManager';
import { SlideManager } from './SlideManager';

export class PPTEditor {
  private container: HTMLElement;
  private slides: Slide[] = [];
  private currentSlide: number = 0;
  private currentTheme: Theme = PREDEFINED_THEMES[0];
  private showCustomize: boolean = false;
  
  private chartManager: ChartManager;
  private themeManager: ThemeManager;
  private slideManager: SlideManager;

  constructor(container: HTMLElement) {
    this.container = container;
    this.chartManager = new ChartManager();
    this.themeManager = new ThemeManager();
    this.slideManager = new SlideManager();
    
    this.initializeSlides();
    this.render();
    this.bindEvents();
  }

  private initializeSlides(): void {
    // Load from storage or create default slide
    const savedSlides = StorageUtils.load<Slide[]>('slides');
    
    if (savedSlides && savedSlides.length > 0) {
      this.slides = savedSlides;
    } else {
      this.slides = [this.createDefaultSlide()];
    }
  }

  private createDefaultSlide(): Slide {
    return {
      id: 1,
      background: PREDEFINED_THEMES[0].background,
      titleColor: PREDEFINED_THEMES[0].titleColor,
      contentColor: PREDEFINED_THEMES[0].contentColor,
      titleFont: 'Arial',
      bodyFont: 'Calibri',
      slideSize: 'standard',
      customWidth: 1024,
      customHeight: 768,
      themeColors: DEFAULT_THEME_COLORS,
      subSlides: [
        {
          id: 'slide1-bar',
          title: "Sales Performance",
          content: "This chart shows quarterly sales performance comparison.",
          chart: {
            id: 'theme1-bar-chart',
            type: 'bar',
            title: 'Sales Performance',
            data: DEFAULT_CHART_DATA.bar
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
            data: DEFAULT_CHART_DATA.line
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
            data: DEFAULT_CHART_DATA.pie
          }
        }
      ]
    };
  }

  private render(): void {
    this.container.innerHTML = this.getTemplate();
    this.renderSlides();
    this.renderCurrentSlide();
    this.updateToolbar();
  }

  private getTemplate(): string {
    return `
      <div class="ppt-editor">
        <div class="editor-toolbar">
          <div class="toolbar-section">
            <button class="toolbar-btn" id="prevSlideBtn" ${this.currentSlide === 0 ? 'disabled' : ''}>
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="slide-counter">
              ${this.currentSlide + 1} / ${this.slides.length}
            </span>
            <button class="toolbar-btn" id="nextSlideBtn" ${this.currentSlide === this.slides.length - 1 ? 'disabled' : ''}>
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <div class="toolbar-section">
            <button class="toolbar-btn btn-primary" id="addSlideBtn">
              <i class="bi bi-plus"></i>
              <span>New Slide</span>
            </button>
            <button class="toolbar-btn btn-success" id="saveBtn">
              <i class="bi bi-save"></i>
              <span>Save</span>
            </button>
          </div>

          <div class="toolbar-section">
            <button class="toolbar-btn ${this.showCustomize ? 'active' : ''}" id="settingsBtn">
              <i class="bi bi-gear"></i>
              <span>Settings</span>
            </button>
            <button class="toolbar-btn" id="chartBtn">
              <i class="bi bi-bar-chart"></i>
              <span>Chart</span>
            </button>
            <button class="toolbar-btn" id="themeBtn">
              <i class="bi bi-palette"></i>
              <span>Theme</span>
            </button>
          </div>
        </div>

        ${this.showCustomize ? this.getSettingsPanel() : ''}

        <div class="editor-content">
          <div class="slides-sidebar">
            <div id="slidesList"></div>
          </div>
          <div class="slide-editor">
            <div class="slide-container">
              <div id="currentSlideContent"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getSettingsPanel(): string {
    return `
      <div class="settings-panel">
        <div class="settings-content">
          <div class="settings-section">
            <h6>Presentation Theme</h6>
            <div class="theme-grid" id="themeGrid">
              ${PREDEFINED_THEMES.map(theme => `
                <button class="theme-btn ${this.currentTheme.name === theme.name ? 'active' : ''}" 
                        data-theme="${theme.name}"
                        style="background-color: ${theme.background}; color: ${theme.titleColor}">
                  <div class="theme-preview">
                    <div class="theme-title" style="color: ${theme.titleColor}">
                      ${theme.name}
                    </div>
                    <div class="theme-content" style="color: ${theme.contentColor}">
                      Sample Text
                    </div>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="settings-section">
            <h6>Background Color</h6>
            <div class="color-picker">
              <input type="color" id="backgroundColorPicker" value="${this.slides[this.currentSlide]?.background || '#ffffff'}">
              <span id="backgroundColorValue">${this.slides[this.currentSlide]?.background?.toUpperCase() || '#FFFFFF'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderSlides(): void {
    const slidesList = DOMUtils.querySelector('#slidesList');
    if (!slidesList) return;

    slidesList.innerHTML = `
      <div class="slide-thumbnail new-slide-thumbnail" id="newSlideBtn">
        <div class="thumbnail-preview" style="background-color: ${this.currentTheme.background}; display: flex; align-items: center; justify-content: center;">
          <div class="new-slide-content">
            <i class="bi bi-plus" style="color: ${this.currentTheme.titleColor}; font-size: 1.5rem;"></i>
            <span class="thumbnail-title" style="color: ${this.currentTheme.titleColor};">
              Create New
            </span>
          </div>
        </div>
      </div>

      ${this.slides.map((slide, index) => `
        <div class="slide-thumbnail ${index === this.currentSlide ? 'active' : ''}" data-slide-index="${index}">
          <div class="thumbnail-preview" style="background-color: ${slide.background};">
            <div class="thumbnail-content" style="color: ${slide.titleColor};">
              <div class="thumbnail-title">
                ${slide.subSlides[0]?.title || 'Untitled'}
              </div>
              <div class="thumbnail-text" style="color: ${slide.contentColor};">
                ${(slide.subSlides[0]?.content || '').substring(0, 35)}...
              </div>
            </div>
          </div>
          <div class="thumbnail-footer">
            <div class="thumbnail-number">Theme ${index + 1}</div>
            <button class="edit-button" data-slide-id="${slide.id}">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
        </div>
      `).join('')}
    `;
  }

  private renderCurrentSlide(): void {
    const currentSlideContent = DOMUtils.querySelector('#currentSlideContent');
    if (!currentSlideContent || !this.slides[this.currentSlide]) return;

    const slide = this.slides[this.currentSlide];
    
    currentSlideContent.innerHTML = slide.subSlides.map((subSlide, index) => `
      <div class="slide-content mb-4" style="background-color: ${slide.background}; position: relative;">
        ${slide.logo ? `
          <div class="logo-container logo-${slide.logoPosition || 'top-left'}">
            <img src="${slide.logo}" alt="Logo" class="slide-logo">
          </div>
        ` : ''}
        
        <input type="text" 
               class="slide-title" 
               value="${subSlide.title}"
               placeholder="Click to add title"
               style="color: ${slide.titleColor}; font-family: ${slide.titleFont || 'inherit'};"
               data-subslide-index="${index}"
               data-field="title">
               
        <textarea class="slide-body"
                  placeholder="Click to add content"
                  style="color: ${slide.contentColor}; font-family: ${slide.bodyFont || 'inherit'};"
                  data-subslide-index="${index}"
                  data-field="content">${subSlide.content}</textarea>
        
        <div class="chart-container" id="chart-${subSlide.id}">
          <!-- Chart will be rendered here -->
        </div>
      </div>
    `).join('');

    // Render charts
    slide.subSlides.forEach((subSlide, index) => {
      if (subSlide.chart) {
        this.chartManager.renderChart(
          `chart-${subSlide.id}`,
          subSlide.chart,
          slide.themeColors || DEFAULT_THEME_COLORS
        );
      }
    });
  }

  private updateToolbar(): void {
    const prevBtn = DOMUtils.querySelector('#prevSlideBtn') as HTMLButtonElement;
    const nextBtn = DOMUtils.querySelector('#nextSlideBtn') as HTMLButtonElement;
    const slideCounter = DOMUtils.querySelector('.slide-counter');

    if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    if (slideCounter) slideCounter.textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
  }

  private bindEvents(): void {
    // Navigation
    DOMUtils.addEventListener(
      DOMUtils.querySelector('#prevSlideBtn')!,
      'click',
      () => this.navigateSlide('prev')
    );

    DOMUtils.addEventListener(
      DOMUtils.querySelector('#nextSlideBtn')!,
      'click',
      () => this.navigateSlide('next')
    );

    // Add slide
    DOMUtils.addEventListener(
      DOMUtils.querySelector('#addSlideBtn')!,
      'click',
      () => this.addNewSlide()
    );

    // Save
    DOMUtils.addEventListener(
      DOMUtils.querySelector('#saveBtn')!,
      'click',
      () => this.savePresentation()
    );

    // Settings toggle
    DOMUtils.addEventListener(
      DOMUtils.querySelector('#settingsBtn')!,
      'click',
      () => this.toggleSettings()
    );

    // Theme selection
    const themeGrid = DOMUtils.querySelector('#themeGrid');
    if (themeGrid) {
      DOMUtils.addEventListener(themeGrid, 'click', (e) => {
        const target = e.target as HTMLElement;
        const themeBtn = target.closest('.theme-btn') as HTMLElement;
        if (themeBtn) {
          const themeName = themeBtn.dataset.theme;
          const theme = PREDEFINED_THEMES.find(t => t.name === themeName);
          if (theme) {
            this.applyTheme(theme);
          }
        }
      });
    }

    // Background color picker
    const backgroundColorPicker = DOMUtils.querySelector('#backgroundColorPicker') as HTMLInputElement;
    if (backgroundColorPicker) {
      DOMUtils.addEventListener(backgroundColorPicker, 'change', (e) => {
        const target = e.target as HTMLInputElement;
        this.updateSlideBackground(target.value);
      });
    }

    // Slide selection
    DOMUtils.addEventListener(this.container, 'click', (e) => {
      const target = e.target as HTMLElement;
      const slideThumbnail = target.closest('.slide-thumbnail') as HTMLElement;
      
      if (slideThumbnail && slideThumbnail.dataset.slideIndex) {
        const slideIndex = parseInt(slideThumbnail.dataset.slideIndex);
        this.setCurrentSlide(slideIndex);
      }
    });

    // Content editing
    DOMUtils.addEventListener(this.container, 'input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      
      if (target.dataset.subslideIndex && target.dataset.field) {
        const subSlideIndex = parseInt(target.dataset.subslideIndex);
        const field = target.dataset.field as 'title' | 'content';
        this.updateSubSlideContent(this.currentSlide, subSlideIndex, field, target.value);
      }
    });
  }

  private navigateSlide(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.currentSlide > 0) {
      this.setCurrentSlide(this.currentSlide - 1);
    } else if (direction === 'next' && this.currentSlide < this.slides.length - 1) {
      this.setCurrentSlide(this.currentSlide + 1);
    }
  }

  private setCurrentSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.renderSlides();
      this.renderCurrentSlide();
      this.updateToolbar();
    }
  }

  private addNewSlide(): void {
    const currentSlideData = this.slides[this.currentSlide] || this.slides[0];
    const newSlide: Slide = {
      id: this.slides.length + 1,
      background: currentSlideData.background,
      titleColor: currentSlideData.titleColor,
      contentColor: currentSlideData.contentColor,
      themeColors: currentSlideData.themeColors || DEFAULT_THEME_COLORS,
      titleFont: currentSlideData.titleFont || 'Arial',
      bodyFont: currentSlideData.bodyFont || 'Calibri',
      slideSize: currentSlideData.slideSize || 'standard',
      customWidth: currentSlideData.customWidth || 1024,
      customHeight: currentSlideData.customHeight || 768,
      subSlides: [
        {
          id: `slide${this.slides.length + 1}-default`,
          title: "New Slide Title",
          content: "Add your content here...",
          chart: {
            id: `chart-${Date.now()}`,
            type: 'bar',
            title: 'Sample Chart',
            data: DEFAULT_CHART_DATA.bar
          }
        }
      ]
    };

    this.slides.push(newSlide);
    this.setCurrentSlide(this.slides.length - 1);
    this.saveToStorage();
  }

  private applyTheme(theme: Theme): void {
    this.currentTheme = theme;
    const updatedSlides = this.slides.map((slide, index) => {
      if (index === this.currentSlide) {
        return {
          ...slide,
          background: theme.background,
          titleColor: theme.titleColor,
          contentColor: theme.contentColor,
          themeColors: theme.colors || DEFAULT_THEME_COLORS
        };
      }
      return slide;
    });
    
    this.slides = updatedSlides;
    this.renderCurrentSlide();
    this.saveToStorage();
  }

  private updateSlideBackground(color: string): void {
    const updatedSlides = [...this.slides];
    updatedSlides[this.currentSlide] = {
      ...updatedSlides[this.currentSlide],
      background: color
    };
    
    this.slides = updatedSlides;
    this.renderCurrentSlide();
    
    const colorValue = DOMUtils.querySelector('#backgroundColorValue');
    if (colorValue) {
      colorValue.textContent = color.toUpperCase();
    }
    
    this.saveToStorage();
  }

  private updateSubSlideContent(
    slideIndex: number,
    subSlideIndex: number,
    field: 'title' | 'content',
    value: string
  ): void {
    const updatedSlides = [...this.slides];
    updatedSlides[slideIndex].subSlides[subSlideIndex][field] = value;
    this.slides = updatedSlides;
    this.renderSlides(); // Update thumbnails
    this.saveToStorage();
  }

  private toggleSettings(): void {
    this.showCustomize = !this.showCustomize;
    this.render();
  }

  private savePresentation(): void {
    this.saveToStorage();
    
    // Also create downloadable JSON
    const presentationData = JSON.stringify({
      slides: this.slides,
      theme: this.currentTheme,
      timestamp: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([presentationData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Show success message
    this.showNotification('Presentation saved successfully!', 'success');
  }

  private saveToStorage(): void {
    StorageUtils.save('slides', this.slides);
    StorageUtils.save('currentTheme', this.currentTheme);
    StorageUtils.save('currentSlide', this.currentSlide);
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Create a simple notification
    const notification = DOMUtils.createElement('div', {
      className: `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`,
      style: {
        top: '20px',
        right: '20px',
        zIndex: '9999',
        minWidth: '300px'
      }
    }, `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `);

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  // Public methods for external access
  public getCurrentSlide(): Slide | null {
    return this.slides[this.currentSlide] || null;
  }

  public getSlides(): Slide[] {
    return [...this.slides];
  }

  public setSlides(slides: Slide[]): void {
    this.slides = slides;
    this.currentSlide = 0;
    this.render();
    this.saveToStorage();
  }

  public destroy(): void {
    // Cleanup event listeners and resources
    DOMUtils.clearChildren(this.container);
  }
}