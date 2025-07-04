import { Slide, SlideSettings, ThemeColors } from '../types';
import { DEFAULT_THEME_COLORS, COMMON_FONTS } from '../constants';
import { DOMUtils } from '../utils/dom';

export class SlideManager {
  public showSlideSettingsModal(
    slide: Slide | null,
    mode: 'create' | 'edit',
    onSave: (settings: SlideSettings, updatedSlide: Slide) => void
  ): void {
    const modal = this.createSlideSettingsModal(slide, mode, onSave);
    document.body.appendChild(modal);
    
    // Show modal using Bootstrap
    const bsModal = new (window as any).bootstrap.Modal(modal);
    bsModal.show();

    // Cleanup on hide
    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
    });
  }

  private createSlideSettingsModal(
    initialSlide: Slide | null,
    mode: 'create' | 'edit',
    onSave: (settings: SlideSettings, updatedSlide: Slide) => void
  ): HTMLElement {
    const modal = DOMUtils.createElement('div', {
      className: 'modal fade',
      id: 'slideSettingsModal',
      tabIndex: -1
    });

    let activeTab = 'general';
    let hasUnsavedChanges = false;

    const settings: SlideSettings & { themeColors: ThemeColors } = {
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
      subSlides: initialSlide?.subSlides?.map(sub => ({
        id: sub.id,
        title: sub.title,
        content: sub.content
      })) || [{
        id: `new-${Date.now()}`,
        title: '',
        content: ''
      }],
      themeColors: initialSlide?.themeColors || DEFAULT_THEME_COLORS
    };

    let logoPreview = initialSlide?.logo || '';

    const updatePreview = () => {
      const previewContainer = modal.querySelector('#slidePreview');
      if (!previewContainer) return;

      const { width, height } = this.getSlideSize(settings.general);
      const containerWidth = 600;
      const scale = containerWidth / width;
      const scaledHeight = height * scale;

      previewContainer.innerHTML = `
        <div class="preview-header mb-3">
          <h6 class="mb-0">Preview</h6>
          <small class="text-muted">${width} x ${height}px</small>
        </div>
        <div class="preview-wrapper" style="width: ${containerWidth}px; height: ${scaledHeight}px; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 0 auto;">
          ${settings.subSlides.map((subSlide, index) => `
            <div class="slide-content" style="
              background-color: ${settings.colors.background};
              width: 100%;
              height: 100%;
              padding: 2rem;
              position: relative;
              ${index > 0 ? 'display: none;' : ''}
            ">
              ${logoPreview ? `
                <div class="logo-container logo-${settings.general.logoPosition}" style="position: absolute; max-width: 80px; max-height: 80px; padding: 8px;">
                  <img src="${logoPreview}" alt="Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
              ` : ''}
              
              <div class="editable-title" style="
                color: ${settings.colors.titleColor};
                font-family: ${settings.fonts.titleFont};
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 1rem;
                padding: 8px;
                border-radius: 4px;
                min-height: 40px;
              ">
                ${subSlide.title || 'Click to edit title'}
              </div>
              
              <div class="editable-content" style="
                color: ${settings.colors.contentColor};
                font-family: ${settings.fonts.bodyFont};
                font-size: 16px;
                padding: 8px;
                border-radius: 4px;
                min-height: 60px;
              ">
                ${subSlide.content || 'Click to edit content'}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    };

    const renderTabContent = () => {
      const tabContent = modal.querySelector('#tabContent');
      if (!tabContent) return;

      switch (activeTab) {
        case 'general':
          tabContent.innerHTML = this.getGeneralTabContent(settings);
          this.bindGeneralTabEvents(modal, settings, updatePreview);
          break;
        case 'colors':
          tabContent.innerHTML = this.getColorsTabContent(settings);
          this.bindColorsTabEvents(modal, settings, updatePreview);
          break;
        case 'fonts':
          tabContent.innerHTML = this.getFontsTabContent(settings);
          this.bindFontsTabEvents(modal, settings, updatePreview);
          break;
      }
    };

    modal.innerHTML = `
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-sliders me-2"></i>
              ${mode === 'create' ? 'Create New Slide' : 'Edit Slide'}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0">
            <div class="d-flex h-100">
              <div class="bg-light p-3" style="width: 200px;">
                <ul class="nav nav-pills flex-column">
                  <li class="nav-item">
                    <button class="nav-link ${activeTab === 'general' ? 'active' : ''}" data-tab="general">
                      <i class="bi bi-gear me-2"></i>General
                    </button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link ${activeTab === 'colors' ? 'active' : ''}" data-tab="colors">
                      <i class="bi bi-palette me-2"></i>Colors
                    </button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link ${activeTab === 'fonts' ? 'active' : ''}" data-tab="fonts">
                      <i class="bi bi-fonts me-2"></i>Fonts
                    </button>
                  </li>
                </ul>
              </div>
              
              <div class="flex-grow-1 p-4">
                <div id="tabContent"></div>
                <div id="slidePreview" class="mt-4"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveSlideBtn">
              <i class="bi bi-save me-2"></i>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind tab events
    modal.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        activeTab = target.dataset.tab || 'general';
        
        // Update active tab
        modal.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        target.classList.add('active');
        
        renderTabContent();
      });
    });

    // Save button
    modal.querySelector('#saveSlideBtn')?.addEventListener('click', () => {
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
        subSlides: initialSlide?.subSlides || [],
        themeColors: settings.themeColors
      };

      const { themeColors, ...slideSettings } = settings;
      onSave(slideSettings, updatedSlide);
      
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      bsModal.hide();
    });

    // Initial render
    renderTabContent();
    updatePreview();

    return modal;
  }

  private getGeneralTabContent(settings: SlideSettings & { themeColors: ThemeColors }): string {
    return `
      <h6>Slide Size</h6>
      <div class="mb-3">
        <select class="form-select" id="slideSize">
          <option value="standard" ${settings.general.slideSize === 'standard' ? 'selected' : ''}>Standard (4:3)</option>
          <option value="widescreen" ${settings.general.slideSize === 'widescreen' ? 'selected' : ''}>Widescreen (16:9)</option>
          <option value="custom" ${settings.general.slideSize === 'custom' ? 'selected' : ''}>Custom</option>
        </select>
      </div>
      
      <div id="customSizeInputs" class="mb-3" style="display: ${settings.general.slideSize === 'custom' ? 'block' : 'none'};">
        <div class="row">
          <div class="col-md-6">
            <label class="form-label">Width (px)</label>
            <input type="number" class="form-control" id="customWidth" value="${settings.general.customWidth}" min="100" max="3840">
          </div>
          <div class="col-md-6">
            <label class="form-label">Height (px)</label>
            <input type="number" class="form-control" id="customHeight" value="${settings.general.customHeight}" min="100" max="2160">
          </div>
        </div>
      </div>

      <h6>Logo</h6>
      <div class="row mb-3">
        <div class="col-md-4">
          <div class="logo-preview border rounded p-3 text-center" style="height: 120px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
            ${settings.general.logo ? 
              `<img src="${settings.general.logo}" alt="Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">` :
              '<span class="text-muted">No logo</span>'
            }
          </div>
          <input type="file" class="form-control mt-2" id="logoUpload" accept="image/*">
        </div>
        <div class="col-md-8">
          <label class="form-label">Logo Position</label>
          <select class="form-select" id="logoPosition">
            <option value="top-left" ${settings.general.logoPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
            <option value="top-center" ${settings.general.logoPosition === 'top-center' ? 'selected' : ''}>Top Center</option>
            <option value="top-right" ${settings.general.logoPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
            <option value="bottom-left" ${settings.general.logoPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
            <option value="bottom-center" ${settings.general.logoPosition === 'bottom-center' ? 'selected' : ''}>Bottom Center</option>
            <option value="bottom-right" ${settings.general.logoPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
          </select>
        </div>
      </div>
    `;
  }

  private getColorsTabContent(settings: SlideSettings & { themeColors: ThemeColors }): string {
    return `
      <h6>Slide Colors</h6>
      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">Background</label>
          <input type="color" class="form-control form-control-color" id="backgroundColor" value="${settings.colors.background}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Title Color</label>
          <input type="color" class="form-control form-control-color" id="titleColor" value="${settings.colors.titleColor}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Content Color</label>
          <input type="color" class="form-control form-control-color" id="contentColor" value="${settings.colors.contentColor}">
        </div>
      </div>

      <h6>Theme Colors</h6>
      <div class="row">
        ${Object.entries(settings.themeColors).map(([key, value]) => `
          <div class="col-md-3 mb-3">
            <label class="form-label">${this.formatColorLabel(key)}</label>
            <input type="color" class="form-control form-control-color" data-theme-color="${key}" value="${value}">
          </div>
        `).join('')}
      </div>
    `;
  }

  private getFontsTabContent(settings: SlideSettings & { themeColors: ThemeColors }): string {
    return `
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Title Font</label>
          <select class="form-select" id="titleFont">
            ${COMMON_FONTS.map(font => `
              <option value="${font.name}" ${settings.fonts.titleFont === font.name ? 'selected' : ''}>
                ${font.name} (${font.category})
              </option>
            `).join('')}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Body Font</label>
          <select class="form-select" id="bodyFont">
            ${COMMON_FONTS.map(font => `
              <option value="${font.name}" ${settings.fonts.bodyFont === font.name ? 'selected' : ''}>
                ${font.name} (${font.category})
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;
  }

  private bindGeneralTabEvents(
    modal: HTMLElement, 
    settings: SlideSettings & { themeColors: ThemeColors }, 
    updatePreview: () => void
  ): void {
    const slideSizeSelect = modal.querySelector('#slideSize') as HTMLSelectElement;
    const customSizeInputs = modal.querySelector('#customSizeInputs') as HTMLElement;
    const customWidthInput = modal.querySelector('#customWidth') as HTMLInputElement;
    const customHeightInput = modal.querySelector('#customHeight') as HTMLInputElement;
    const logoUpload = modal.querySelector('#logoUpload') as HTMLInputElement;
    const logoPosition = modal.querySelector('#logoPosition') as HTMLSelectElement;

    slideSizeSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      settings.general.slideSize = target.value as any;
      customSizeInputs.style.display = target.value === 'custom' ? 'block' : 'none';
      updatePreview();
    });

    customWidthInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      settings.general.customWidth = parseInt(target.value);
      updatePreview();
    });

    customHeightInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      settings.general.customHeight = parseInt(target.value);
      updatePreview();
    });

    logoUpload?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          settings.general.logo = e.target?.result as string;
          updatePreview();
        };
        reader.readAsDataURL(file);
      }
    });

    logoPosition?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      settings.general.logoPosition = target.value as any;
      updatePreview();
    });
  }

  private bindColorsTabEvents(
    modal: HTMLElement, 
    settings: SlideSettings & { themeColors: ThemeColors }, 
    updatePreview: () => void
  ): void {
    const backgroundInput = modal.querySelector('#backgroundColor') as HTMLInputElement;
    const titleColorInput = modal.querySelector('#titleColor') as HTMLInputElement;
    const contentColorInput = modal.querySelector('#contentColor') as HTMLInputElement;

    backgroundInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      settings.colors.background = target.value;
      updatePreview();
    });

    titleColorInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      settings.colors.titleColor = target.value;
      updatePreview();
    });

    contentColorInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      settings.colors.contentColor = target.value;
      updatePreview();
    });

    // Theme color inputs
    modal.querySelectorAll('[data-theme-color]').forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const colorKey = target.dataset.themeColor as keyof ThemeColors;
        settings.themeColors[colorKey] = target.value;
        updatePreview();
      });
    });
  }

  private bindFontsTabEvents(
    modal: HTMLElement, 
    settings: SlideSettings & { themeColors: ThemeColors }, 
    updatePreview: () => void
  ): void {
    const titleFontSelect = modal.querySelector('#titleFont') as HTMLSelectElement;
    const bodyFontSelect = modal.querySelector('#bodyFont') as HTMLSelectElement;

    titleFontSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      settings.fonts.titleFont = target.value;
      updatePreview();
    });

    bodyFontSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      settings.fonts.bodyFont = target.value;
      updatePreview();
    });
  }

  private getSlideSize(general: SlideSettings['general']): { width: number; height: number } {
    switch (general.slideSize) {
      case 'standard': return { width: 1024, height: 768 };
      case 'widescreen': return { width: 1280, height: 720 };
      case 'custom': return {
        width: general.customWidth || 1280,
        height: general.customHeight || 720
      };
      default: return { width: 1024, height: 768 };
    }
  }

  private formatColorLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}