// Core Types
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

export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: any[];
  themeColors?: ThemeColors;
}

export interface SubSlide {
  id: string;
  title: string;
  content: string;
  chart?: ChartData;
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

export interface Theme {
  name: string;
  background: string;
  titleColor: string;
  contentColor: string;
  colors?: ThemeColors;
}

export interface SlideSize {
  width: string;
  height: string;
  name: string;
}

export interface PresentationSettings {
  theme: {
    name: string;
    background: string;
    titleColor: string;
    contentColor: string;
    colors?: ThemeColors;
  };
  slides: Slide[];
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

export interface ThemeFonts {
  titleFont: string;
  bodyFont: string;
  name?: string;
  id?: string;
}

// Event Types
export interface SlideChangeEvent {
  slideIndex: number;
  slide: Slide;
}

export interface ThemeChangeEvent {
  theme: Theme;
}

export interface ChartUpdateEvent {
  slideIndex: number;
  subSlideIndex: number;
  chart: ChartData;
}

// API Response Types
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