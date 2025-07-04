import { PresentationSettings, APIResponse, SaveSettingsResponse } from '../types';

/**
 * API Service for handling server communication
 */
export class APIService {
  private static readonly BASE_URL = '/api';

  /**
   * Make HTTP request with error handling
   */
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Save presentation settings
   */
  static async saveSettings(settings: PresentationSettings): Promise<SaveSettingsResponse> {
    return this.request<SaveSettingsResponse>('/ppttheme/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  }

  /**
   * Load presentation settings
   */
  static async loadSettings(id?: string): Promise<PresentationSettings> {
    const endpoint = id ? `/ppttheme/settings/${id}` : '/ppttheme/settings';
    return this.request<PresentationSettings>(endpoint);
  }

  /**
   * Delete presentation settings
   */
  static async deleteSettings(id: string): Promise<APIResponse> {
    return this.request<APIResponse>(`/ppttheme/settings/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Upload file (e.g., logo)
   */
  static async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type to let browser set it for FormData
    });
  }

  /**
   * Validate settings
   */
  static validateSettings(settings: PresentationSettings): boolean {
    if (!settings.theme || !settings.slides) {
      return false;
    }

    if (!Array.isArray(settings.slides) || settings.slides.length === 0) {
      return false;
    }

    // Validate theme
    if (!settings.theme.name || !settings.theme.background || 
        !settings.theme.titleColor || !settings.theme.contentColor) {
      return false;
    }
    
    return true;
  }
}