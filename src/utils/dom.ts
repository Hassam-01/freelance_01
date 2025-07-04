/**
 * DOM Utility Functions
 */

export class DOMUtils {
  /**
   * Create an element with attributes and content
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Partial<HTMLElementTagNameMap[K]> = {},
    content?: string | HTMLElement | HTMLElement[]
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value as string;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, String(value));
      } else {
        (element as any)[key] = value;
      }
    });

    // Set content
    if (content !== undefined) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      } else if (Array.isArray(content)) {
        content.forEach(child => element.appendChild(child));
      }
    }

    return element;
  }

  /**
   * Find element by selector with type safety
   */
  static querySelector<K extends keyof HTMLElementTagNameMap>(
    selector: K,
    parent: Document | HTMLElement = document
  ): HTMLElementTagNameMap[K] | null;
  static querySelector(
    selector: string,
    parent: Document | HTMLElement = document
  ): HTMLElement | null;
  static querySelector(
    selector: string,
    parent: Document | HTMLElement = document
  ): HTMLElement | null {
    return parent.querySelector(selector);
  }

  /**
   * Find all elements by selector
   */
  static querySelectorAll<K extends keyof HTMLElementTagNameMap>(
    selector: K,
    parent: Document | HTMLElement = document
  ): NodeListOf<HTMLElementTagNameMap[K]>;
  static querySelectorAll(
    selector: string,
    parent: Document | HTMLElement = document
  ): NodeListOf<HTMLElement>;
  static querySelectorAll(
    selector: string,
    parent: Document | HTMLElement = document
  ): NodeListOf<HTMLElement> {
    return parent.querySelectorAll(selector);
  }

  /**
   * Add event listener with automatic cleanup
   */
  static addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    element.addEventListener(type, listener, options);
    return () => element.removeEventListener(type, listener, options);
  }

  /**
   * Toggle class on element
   */
  static toggleClass(element: HTMLElement, className: string, force?: boolean): boolean {
    return element.classList.toggle(className, force);
  }

  /**
   * Add classes to element
   */
  static addClass(element: HTMLElement, ...classNames: string[]): void {
    element.classList.add(...classNames);
  }

  /**
   * Remove classes from element
   */
  static removeClass(element: HTMLElement, ...classNames: string[]): void {
    element.classList.remove(...classNames);
  }

  /**
   * Check if element has class
   */
  static hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }

  /**
   * Set multiple styles on element
   */
  static setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(element.style, styles);
  }

  /**
   * Show element
   */
  static show(element: HTMLElement): void {
    element.style.display = '';
    element.removeAttribute('hidden');
  }

  /**
   * Hide element
   */
  static hide(element: HTMLElement): void {
    element.style.display = 'none';
  }

  /**
   * Remove element from DOM
   */
  static remove(element: HTMLElement): void {
    element.remove();
  }

  /**
   * Clear all children from element
   */
  static clearChildren(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Get element's offset position
   */
  static getOffset(element: HTMLElement): { top: number; left: number } {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }

  /**
   * Animate element with CSS transitions
   */
  static animate(
    element: HTMLElement,
    properties: Partial<CSSStyleDeclaration>,
    duration: number = 300,
    easing: string = 'ease'
  ): Promise<void> {
    return new Promise((resolve) => {
      const originalTransition = element.style.transition;
      element.style.transition = `all ${duration}ms ${easing}`;
      
      Object.assign(element.style, properties);
      
      const cleanup = () => {
        element.style.transition = originalTransition;
        element.removeEventListener('transitionend', cleanup);
        resolve();
      };
      
      element.addEventListener('transitionend', cleanup);
      
      // Fallback timeout
      setTimeout(cleanup, duration + 50);
    });
  }

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}