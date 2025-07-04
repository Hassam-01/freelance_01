export interface ChartData {
    id: string;
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: any[];
    themeColors?: ThemeColors;
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