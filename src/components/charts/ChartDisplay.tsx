import React, { useMemo } from 'react';
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
import { ChartData, ThemeColors } from './ChartTypes';

interface ChartDisplayProps {
  chartData: ChartData;
  themeColors: ThemeColors;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData, themeColors }) => {
  const { type, data, title } = chartData;
  
  // Memoize chart colors to prevent unnecessary re-renders
  const chartColors = useMemo(() => [
    themeColors.accent1,
    themeColors.accent2,
    themeColors.accent3,
    themeColors.accent4,
    themeColors.accent5,
    themeColors.accent6
  ], [themeColors]);

  // Custom tooltip styling that adapts to theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="custom-tooltip"
          style={{
            backgroundColor: themeColors.textLight1,
            border: `1px solid ${themeColors.textDark2}`,
            borderRadius: '4px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <p 
            className="label" 
            style={{ 
              color: themeColors.textDark1,
              margin: '0 0 4px 0',
              fontWeight: 'bold'
            }}
          >
            {`${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index}
              style={{ 
                color: entry.color,
                margin: '0',
                fontSize: '0.875rem'
              }}
            >
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend styling
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul 
        style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: '10px 0 0 0',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {payload.map((entry: any, index: number) => (
          <li 
            key={`item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span 
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                borderRadius: '2px',
                display: 'inline-block'
              }}
            />
            <span style={{ color: themeColors.textDark1, fontSize: '0.875rem' }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderChart = () => {
    const commonProps = {
      style: { transition: 'all 0.3s ease' }
    };

    switch (type) {
      case 'bar':
        const barSeriesNames = Object.keys(data[0] || {}).filter(key => key !== 'name');
        return (
          <BarChart data={data} {...commonProps}>
            <XAxis 
              dataKey="name" 
              stroke={themeColors.textDark1}
              tick={{ fill: themeColors.textDark1, fontSize: 12 }}
              axisLine={{ stroke: themeColors.textDark2 }}
              tickLine={{ stroke: themeColors.textDark2 }}
            />
            <YAxis 
              stroke={themeColors.textDark1}
              tick={{ fill: themeColors.textDark1, fontSize: 12 }}
              axisLine={{ stroke: themeColors.textDark2 }}
              tickLine={{ stroke: themeColors.textDark2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {barSeriesNames.map((series, index) => (
              <Bar
                key={series}
                dataKey={series}
                name={series}
                fill={chartColors[index % chartColors.length]}
                style={{ transition: 'fill 0.3s ease' }}
              />
            ))}
          </BarChart>
        );

      case 'line':
        const lineSeriesNames = Object.keys(data[0] || {}).filter(key => key !== 'name');
        return (
          <LineChart data={data} {...commonProps}>
            <XAxis 
              dataKey="name" 
              stroke={themeColors.textDark1}
              tick={{ fill: themeColors.textDark1, fontSize: 12 }}
              axisLine={{ stroke: themeColors.textDark2 }}
              tickLine={{ stroke: themeColors.textDark2 }}
            />
            <YAxis 
              stroke={themeColors.textDark1}
              tick={{ fill: themeColors.textDark1, fontSize: 12 }}
              axisLine={{ stroke: themeColors.textDark2 }}
              tickLine={{ stroke: themeColors.textDark2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {lineSeriesNames.map((series, index) => (
              <Line
                key={series}
                type="monotone"
                dataKey={series}
                name={series}
                stroke={chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={{ 
                  fill: chartColors[index % chartColors.length],
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  fill: chartColors[index % chartColors.length],
                  stroke: themeColors.textLight1,
                  strokeWidth: 2
                }}
                style={{ transition: 'stroke 0.3s ease' }}
              />
            ))}
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              style={{ transition: 'all 0.3s ease' }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                  stroke={themeColors.textLight1}
                  strokeWidth={1}
                  style={{ transition: 'fill 0.3s ease' }}
                />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="chart-container">
      <h5 
        className="text-center mb-3" 
        style={{ 
          color: themeColors.textDark1,
          transition: 'color 0.3s ease',
          fontWeight: '600'
        }}
      >
        {title}
      </h5>
      <div 
        style={{ 
          width: '100%', 
          height: '250px',
          transition: 'all 0.3s ease'
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};