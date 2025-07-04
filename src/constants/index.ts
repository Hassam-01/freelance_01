import { ThemeColors, Theme, ChartData } from '../types';

export const DEFAULT_THEME_COLORS: ThemeColors = {
  textDark1: '#44546A',
  textLight1: '#FFFFFF',
  textDark2: '#44546A',
  textLight2: '#E7E6E6',
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  hyperlink: '#0563C1',
  followedHyperlink: '#954F72'
};

export const PREDEFINED_THEMES: Theme[] = [
  {
    name: 'Default',
    background: '#ffffff',
    titleColor: '#000000',
    contentColor: '#333333',
    colors: DEFAULT_THEME_COLORS
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

export const DEFAULT_CHART_DATA = {
  bar: [
    { name: 'A', series1: 65, series2: 45, series3: 35 },
    { name: 'B', series1: 45, series2: 55, series3: 25 },
    { name: 'C', series1: 75, series2: 35, series3: 45 },
    { name: 'D', series1: 55, series2: 65, series3: 55 },
    { name: 'E', series1: 85, series2: 75, series3: 65 }
  ],
  line: [
    { name: 'A', series1: 65, series2: 45, series3: 35 },
    { name: 'B', series1: 45, series2: 55, series3: 25 },
    { name: 'C', series1: 75, series2: 35, series3: 45 },
    { name: 'D', series1: 55, series2: 65, series3: 55 },
    { name: 'E', series1: 85, series2: 75, series3: 65 }
  ],
  pie: [
    { name: 'Series 1', value: 35 },
    { name: 'Series 2', value: 25 },
    { name: 'Series 3', value: 20 },
    { name: 'Series 4', value: 15 },
    { name: 'Series 5', value: 10 },
    { name: 'Series 6', value: 5 }
  ]
};

export const SLIDE_SIZES = [
  { name: 'Standard (4:3)', width: '800px', height: '600px' },
  { name: 'Widescreen (16:9)', width: '960px', height: '540px' },
  { name: 'Custom', width: '100%', height: 'auto' }
];

export const COMMON_FONTS = [
  { name: 'Arial', category: 'Sans-serif' },
  { name: 'Calibri', category: 'Sans-serif' },
  { name: 'Times New Roman', category: 'Serif' },
  { name: 'Helvetica', category: 'Sans-serif' },
  { name: 'Georgia', category: 'Serif' },
  { name: 'Verdana', category: 'Sans-serif' },
  { name: 'Tahoma', category: 'Sans-serif' },
  { name: 'Trebuchet MS', category: 'Sans-serif' },
  { name: 'Century Gothic', category: 'Sans-serif' },
  { name: 'Garamond', category: 'Serif' }
];

export const CHART_TYPES = [
  { 
    type: 'bar' as const, 
    label: 'Bar Chart', 
    description: 'Compare values across categories',
    icon: 'bi-bar-chart'
  },
  { 
    type: 'line' as const, 
    label: 'Line Chart', 
    description: 'Show trends over time or sequences',
    icon: 'bi-graph-up'
  },
  { 
    type: 'pie' as const, 
    label: 'Pie Chart', 
    description: 'Display proportional data distribution',
    icon: 'bi-pie-chart'
  }
];