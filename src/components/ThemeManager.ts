import { Theme, ThemeColors } from '../types';
import { DEFAULT_THEME_COLORS, PREDEFINED_THEMES } from '../constants';
import { DOMUtils } from '../utils/dom';

export class ThemeManager {
  private themes: Theme[] = [...PREDEFINED_THEMES];
  private currentTheme: Theme = PREDEFINED_THEMES[0];

  constructor() {
    this.loadCustomThemes();
  }

  public showThemeColorPicker(onSave: (colors: ThemeColors, name: string) => void): void {
    const modal = this.createThemeColorModal(onSave);
    document.body.appendChild(modal);
    
    // Show modal using Bootstrap
    const bsModal = new (window as any).bootstrap.Modal(modal);
    bsModal.show();

    // Cleanup on hide
    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
    });
  }

  private createThemeColorModal(onSave: (colors: ThemeColors, name: string) => void): HTMLElement {
    const modal = DOMUtils.createElement('div', {
      className: 'modal fade',
      id: 'themeColorPickerModal',
      tabIndex: -1
    });

    const colors = { ...DEFAULT_THEME_COLORS };
    let themeName = 'Custom Theme';
    let activeSection: 'text' | 'accent' | 'links' = 'text';

    const colorSections = {
      text: ['textDark1', 'textLight1', 'textDark2', 'textLight2'],
      accent: ['accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6'],
      links: ['hyperlink', 'followedHyperlink']
    };

    const updatePreview = () => {
      const darkPreview = modal.querySelector('#darkPreview') as HTMLElement;
      const lightPreview = modal.querySelector('#lightPreview') as HTMLElement;
      
      if (darkPreview) {
        darkPreview.style.backgroundColor = colors.textDark1;
        darkPreview.style.color = colors.textLight1;
      }
      
      if (lightPreview) {
        lightPreview.style.backgroundColor = colors.textLight1;
        lightPreview.style.color = colors.textDark1;
      }
    };

    const renderColorInputs = () => {
      const container = modal.querySelector('#colorInputsContainer');
      if (!container) return;

      container.innerHTML = colorSections[activeSection].map(key => `
        <div class="color-input-group mb-3">
          <label class="color-label">${this.formatColorLabel(key)}</label>
          <div class="color-input-wrapper">
            <input type="color" 
                   class="form-control form-control-color" 
                   value="${colors[key as keyof ThemeColors]}"
                   data-color-key="${key}">
            <input type="text" 
                   class="form-control font-monospace" 
                   style="width: 100px;"
                   value="${colors[key as keyof ThemeColors].toUpperCase()}"
                   data-color-text="${key}">
          </div>
        </div>
      `).join('');

      // Bind color input events
      container.querySelectorAll('input[type="color"]').forEach(input => {
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          const key = target.dataset.colorKey as keyof ThemeColors;
          colors[key] = target.value;
          
          const textInput = container.querySelector(`input[data-color-text="${key}"]`) as HTMLInputElement;
          if (textInput) {
            textInput.value = target.value.toUpperCase();
          }
          
          updatePreview();
        });
      });

      container.querySelectorAll('input[data-color-text]').forEach(input => {
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          const key = target.dataset.colorText as keyof ThemeColors;
          if (this.isValidColor(target.value)) {
            colors[key] = target.value;
            
            const colorInput = container.querySelector(`input[data-color-key="${key}"]`) as HTMLInputElement;
            if (colorInput) {
              colorInput.value = target.value;
            }
            
            updatePreview();
          }
        });
      });
    };

    modal.innerHTML = `
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-palette me-2"></i>
              Theme Color Editor
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-7">
                <div class="mb-4">
                  <label for="themeName" class="form-label">Theme Name</label>
                  <input type="text" class="form-control" id="themeName" value="${themeName}">
                </div>
                
                <ul class="nav nav-pills mb-3">
                  ${Object.keys(colorSections).map(section => `
                    <li class="nav-item">
                      <button class="nav-link ${section === activeSection ? 'active' : ''}" 
                              data-section="${section}">
                        ${section.charAt(0).toUpperCase() + section.slice(1)} Colors
                      </button>
                    </li>
                  `).join('')}
                </ul>
                
                <div id="colorInputsContainer"></div>
              </div>
              
              <div class="col-md-5">
                <h6>Preview</h6>
                <div class="mb-3">
                  <label class="form-label">Dark Theme</label>
                  <div id="darkPreview" class="p-3 rounded" style="background-color: ${colors.textDark1}; color: ${colors.textLight1};">
                    <div class="mb-2">Sample Title</div>
                    <div class="mb-2" style="font-size: 0.9rem;">Sample content text</div>
                    <div style="color: ${colors.hyperlink};">Hyperlink</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Light Theme</label>
                  <div id="lightPreview" class="p-3 rounded border" style="background-color: ${colors.textLight1}; color: ${colors.textDark1};">
                    <div class="mb-2">Sample Title</div>
                    <div class="mb-2" style="font-size: 0.9rem;">Sample content text</div>
                    <div style="color: ${colors.hyperlink};">Hyperlink</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="resetColorsBtn">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Reset
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveThemeBtn">
              <i class="bi bi-save me-2"></i>
              Save Theme
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind events
    const themeNameInput = modal.querySelector('#themeName') as HTMLInputElement;
    themeNameInput.addEventListener('input', (e) => {
      themeName = (e.target as HTMLInputElement).value;
    });

    // Section tabs
    modal.querySelectorAll('[data-section]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        activeSection = target.dataset.section as 'text' | 'accent' | 'links';
        
        // Update active tab
        modal.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        target.classList.add('active');
        
        renderColorInputs();
      });
    });

    // Reset button
    modal.querySelector('#resetColorsBtn')?.addEventListener('click', () => {
      Object.assign(colors, DEFAULT_THEME_COLORS);
      renderColorInputs();
      updatePreview();
    });

    // Save button
    modal.querySelector('#saveThemeBtn')?.addEventListener('click', () => {
      onSave(colors, themeName);
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      bsModal.hide();
    });

    // Initial render
    renderColorInputs();
    updatePreview();

    return modal;
  }

  private formatColorLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  private isValidColor(color: string): boolean {
    const style = new Option().style;
    style.color = color;
    return style.color !== '';
  }

  public addTheme(theme: Theme): void {
    this.themes.push(theme);
    this.saveCustomThemes();
  }

  public getThemes(): Theme[] {
    return [...this.themes];
  }

  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  public setCurrentTheme(theme: Theme): void {
    this.currentTheme = theme;
  }

  private loadCustomThemes(): void {
    // Load from localStorage if available
    const saved = localStorage.getItem('ppt-theme-custom-themes');
    if (saved) {
      try {
        const customThemes = JSON.parse(saved);
        this.themes = [...PREDEFINED_THEMES, ...customThemes];
      } catch (error) {
        console.error('Failed to load custom themes:', error);
      }
    }
  }

  private saveCustomThemes(): void {
    const customThemes = this.themes.filter(theme => 
      !PREDEFINED_THEMES.some(predefined => predefined.name === theme.name)
    );
    localStorage.setItem('ppt-theme-custom-themes', JSON.stringify(customThemes));
  }
}