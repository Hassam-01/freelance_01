import React from 'react';
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, X } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Legend,
  Tooltip
} from 'recharts';
import './ChartModal.css';

interface ThemeColors {
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

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChart: (type: 'bar' | 'line' | 'pie') => void;
  themeColors?: ThemeColors;
}

// Sample data with multiple series
const sampleData = [
  { name: 'A', series1: 65, series2: 45, series3: 35 },
  { name: 'B', series1: 45, series2: 55, series3: 25 },
  { name: 'C', series1: 75, series2: 35, series3: 45 },
  { name: 'D', series1: 55, series2: 65, series3: 55 },
  { name: 'E', series1: 85, series2: 75, series3: 65 }
];

// Sample data for pie chart
const pieSampleData = [
  { name: 'Series 1', value: 35 },
  { name: 'Series 2', value: 25 },
  { name: 'Series 3', value: 20 },
  { name: 'Series 4', value: 15 },
  { name: 'Series 5', value: 10 },
  { name: 'Series 6', value: 5 }
];

const ChartPreview: React.FC<{ type: string; colors: ThemeColors }> = ({ type, colors }) => {
  const chartColors = [
    colors.accent1,
    colors.accent2,
    colors.accent3,
    colors.accent4,
    colors.accent5,
    colors.accent6
  ];

  const renderChart = () => {
    switch(type) {
      case 'bar':
        default:
        return (
          <BarChart data={sampleData}>
            <XAxis dataKey="name" stroke={colors.textDark1} />
            <YAxis stroke={colors.textDark1} />
            <Tooltip />
            <Legend />
            {['series1', 'series2', 'series3'].map((series, index) => (
              <Bar 
                key={series}
                dataKey={series}
                name={`Series ${index + 1}`}
                fill={chartColors[index]}
                stackId="stack"
              />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={sampleData}>
            <XAxis dataKey="name" stroke={colors.textDark1} />
            <YAxis stroke={colors.textDark1} />
            <Tooltip />
            <Legend />
            {['series1', 'series2', 'series3'].map((series, index) => (
              <Line 
                key={series}
                type="monotone" 
                dataKey={series}
                name={`Series ${index + 1}`}
                stroke={chartColors[index]}
                strokeWidth={2}
                dot={{ fill: chartColors[index] }}
              />
            ))}
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={pieSampleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              {pieSampleData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors[index % chartColors.length]} 
                  name={`Series ${index + 1}`}
                />
              ))}
            </Pie>
          </PieChart>
        );
      
        
    }
  };

  return (
    <div style={{ height: type == 'pie' ? '320px' : '200px', width: '100%' }}>
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export const ChartModal: React.FC<ChartModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectChart,
  themeColors 
}) => {
  if (!isOpen) return null;

  const defaultColors: ThemeColors = {
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

  const colors = themeColors || defaultColors;

  const chartTypes = [
    { type: 'bar' as const, icon: BarChart2, label: 'Bar Chart', description: 'Compare values across categories' },
    { type: 'line' as const, icon: LineChartIcon, label: 'Line Chart', description: 'Show trends over time or sequences' },
    { type: 'pie' as const, icon: PieChartIcon, label: 'Pie Chart', description: 'Display proportional data distribution' },
  ];

  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container">
        <div className="chart-modal-content">
          <div className="chart-modal-header">
            <div className="header-content">
              <h4>Choose Your Chart Type</h4>
              <p className="text-muted">Select the best visualization for your data</p>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <div className="chart-options-container">
            {chartTypes.map(({ type, icon: Icon, label, description }) => (
              <div
                key={type}
                className="chart-option-card"
                onClick={() => {
                  onSelectChart(type);
                  onClose();
                }}
              >
                <div className="chart-option-content">
                  <div className="chart-option-header">
                    <Icon size={24} color={colors.accent1} />
                    <h5>{label}</h5>
                    <p>{description}</p>
                  </div>
                  <div className="chart-preview-container">
                    <ChartPreview type={type} colors={colors} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};