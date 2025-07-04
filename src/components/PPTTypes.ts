export interface PresentationSettings {
    theme: {
      name: string;
      background: string;
      titleColor: string;
      contentColor: string;
      colors?: ThemeColors;
    };
    // slideSize: {
    //   width: string;
    //   height: string;
    //   name: string;
    // };
    // fonts: {
    //   titleFont: string;
    //   bodyFont: string;
    // };
    slides: Slide[];
  }
  
  export interface ThemeColors {
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
  
  export interface Slide {
    id: number;
    background: string;
    titleColor: string;
    contentColor: string;
    titleFont?: string;
    bodyFont?: string;
    logo?: string;
    logoPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    slideSize?: 'standard' | 'widescreen' | 'custom';
    customWidth?: number;
    customHeight?: number;
    subSlides: SubSlide[];
    themeColors?: ThemeColors; 
  }

  export interface SubSlide {
    id: string;
    title: string;
    content: string;
    chart?: ChartData | any;
  }

  export interface SlideSettings {
    colors: {
      background: string;
      titleColor: string;
      contentColor: string;
    };
    fonts: {
      titleFont: string;
      bodyFont: string;
    };
    general: {
      slideSize: 'standard' | 'widescreen' | 'custom';
      customWidth?: number;
      customHeight?: number;
      logo?: string;
      logoPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    };
    subSlides: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  }

  
  export interface ChartData {
    id: string;
    type: 'bar' | 'line' | 'pie';
    data: any;
    title: string;
  }

  export interface APIResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface SaveSettingsResponse extends APIResponse {
    data: {
        id: string;
    };
}