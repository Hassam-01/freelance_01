import { PPTEditor } from './components/PPTEditor';
import { DOMUtils } from './utils/dom';
import { StorageUtils } from './utils/storage';

class App {
  private pptEditor: PPTEditor | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bindEvents());
    } else {
      this.bindEvents();
    }
  }

  private bindEvents(): void {
    // Open Editor buttons
    const openEditorBtn = DOMUtils.querySelector('#openEditorBtn');
    const getStartedBtn = DOMUtils.querySelector('#getStartedBtn');

    if (openEditorBtn) {
      DOMUtils.addEventListener(openEditorBtn, 'click', () => this.openPPTEditor());
    }

    if (getStartedBtn) {
      DOMUtils.addEventListener(getStartedBtn, 'click', () => this.openPPTEditor());
    }

    // Save settings button
    const saveSettingsBtn = DOMUtils.querySelector('#saveSettingsBtn');
    if (saveSettingsBtn) {
      DOMUtils.addEventListener(saveSettingsBtn, 'click', () => this.saveSettings());
    }

    // Check if we should auto-open editor (e.g., if there are saved slides)
    this.checkAutoOpen();
  }

  private checkAutoOpen(): void {
    const savedSlides = StorageUtils.load('slides');
    if (savedSlides && Array.isArray(savedSlides) && savedSlides.length > 0) {
      // Show a notification that saved data exists
      this.showNotification('You have saved presentation data. Click "Open Editor" to continue editing.', 'info');
    }
  }

  private openPPTEditor(): void {
    const modal = DOMUtils.querySelector('#pptEditorModal');
    const container = DOMUtils.querySelector('#pptEditorContainer');
    
    if (!modal || !container) {
      console.error('PPT Editor modal elements not found');
      return;
    }

    // Clear existing content
    DOMUtils.clearChildren(container);

    // Create new PPT Editor instance
    this.pptEditor = new PPTEditor(container);

    // Show modal using Bootstrap
    const bsModal = new (window as any).bootstrap.Modal(modal);
    bsModal.show();

    // Cleanup when modal is hidden
    modal.addEventListener('hidden.bs.modal', () => {
      if (this.pptEditor) {
        this.pptEditor.destroy();
        this.pptEditor = null;
      }
      DOMUtils.clearChildren(container);
    });
  }

  private async saveSettings(): void {
    if (!this.pptEditor) {
      this.showNotification('No editor instance found', 'error');
      return;
    }

    try {
      const slides = this.pptEditor.getSlides();
      const currentSlide = this.pptEditor.getCurrentSlide();
      
      if (!slides || slides.length === 0) {
        this.showNotification('No slides to save', 'warning');
        return;
      }

      // Save to localStorage
      StorageUtils.save('slides', slides);
      StorageUtils.save('lastSaved', new Date().toISOString());

      // Create downloadable backup
      const exportData = {
        slides,
        metadata: {
          version: '1.0',
          created: new Date().toISOString(),
          slideCount: slides.length
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentation-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      this.showNotification('Settings saved successfully!', 'success');

      // Close modal
      const modal = DOMUtils.querySelector('#pptEditorModal');
      if (modal) {
        const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
        bsModal?.hide();
      }

    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showNotification('Failed to save settings. Please try again.', 'error');
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const alertClass = type === 'error' ? 'danger' : type;
    
    const notification = DOMUtils.createElement('div', {
      className: `alert alert-${alertClass} alert-dismissible fade show position-fixed`,
      style: {
        top: '20px',
        right: '20px',
        zIndex: '9999',
        minWidth: '300px',
        maxWidth: '500px'
      }
    }, `
      <div class="d-flex align-items-center">
        <i class="bi bi-${this.getIconForType(type)} me-2"></i>
        <div>${message}</div>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `);

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  private getIconForType(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-triangle';
      case 'warning': return 'exclamation-triangle';
      case 'info': 
      default: return 'info-circle';
    }
  }
}

// Initialize the application
new App();

// Export for global access if needed
(window as any).App = App;