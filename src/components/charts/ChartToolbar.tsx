import React from 'react';
import { BarChart2, LineChart, PieChart } from 'lucide-react';

interface ChartToolbarProps {
  onAddChart: (type: 'bar' | 'line' | 'pie') => void;
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({ onAddChart }) => (
  <div className="btn-group">
    <button
      className="btn btn-outline-secondary"
      onClick={() => onAddChart('bar')}
    >
      <BarChart2 size={16} /> Bar Chart
    </button>
    <button
      className="btn btn-outline-secondary"
      onClick={() => onAddChart('line')}
    >
      <LineChart size={16} /> Line Chart
    </button>
    <button
      className="btn btn-outline-secondary"
      onClick={() => onAddChart('pie')}
    >
      <PieChart size={16} /> Pie Chart
    </button>
  </div>
);