import { ChartData, ThemeColors } from '../types';
import { DOMUtils } from '../utils/dom';

export class ChartManager {
  private charts: Map<string, any> = new Map();

  constructor() {
    // Chart manager uses custom SVG rendering
  }

  public renderChart(containerId: string, chartData: ChartData, themeColors: ThemeColors): void {
    const container = DOMUtils.querySelector(`#${containerId}`);
    if (!container) {
      console.error('Chart container not found');
      return;
    }

    // Clear existing content
    DOMUtils.clearChildren(container);

    // Create chart wrapper
    const chartWrapper = DOMUtils.createElement('div', {
      className: 'chart-wrapper',
      style: {
        width: '100%',
        height: '300px',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    });

    // Add title
    const title = DOMUtils.createElement('h5', {
      className: 'chart-title text-center mb-3',
      style: {
        color: themeColors.textDark1,
        fontWeight: '600'
      }
    }, chartData.title);

    // Create chart container
    const chartContainer = DOMUtils.createElement('div', {
      id: `${containerId}-chart`,
      style: {
        width: '100%',
        height: '250px'
      }
    });

    chartWrapper.appendChild(title);
    chartWrapper.appendChild(chartContainer);
    container.appendChild(chartWrapper);

    // Render chart based on type
    this.renderChartByType(chartContainer, chartData, themeColors);
  }

  private renderChartByType(container: HTMLElement, chartData: ChartData, themeColors: ThemeColors): void {
    const chartColors = [
      themeColors.accent1,
      themeColors.accent2,
      themeColors.accent3,
      themeColors.accent4,
      themeColors.accent5,
      themeColors.accent6
    ];

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 250');
    
    container.appendChild(svg);

    switch (chartData.type) {
      case 'bar':
        this.renderBarChart(svg, chartData.data, chartColors);
        break;
      case 'line':
        this.renderLineChart(svg, chartData.data, chartColors);
        break;
      case 'pie':
        this.renderPieChart(svg, chartData.data, chartColors);
        break;
    }
  }

  private renderBarChart(svg: SVGElement, data: any[], colors: string[]): void {
    const width = 800;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Get series names (excluding 'name' field)
    const seriesNames = Object.keys(data[0] || {}).filter(key => key !== 'name');
    const maxValue = Math.max(...data.flatMap(d => seriesNames.map(s => d[s] || 0)));
    
    const barWidth = chartWidth / data.length / seriesNames.length * 0.8;
    const groupWidth = chartWidth / data.length;

    // Create chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(chartGroup);

    // Render bars
    data.forEach((item, dataIndex) => {
      seriesNames.forEach((series, seriesIndex) => {
        const value = item[series] || 0;
        const barHeight = (value / maxValue) * chartHeight;
        const x = dataIndex * groupWidth + seriesIndex * barWidth + (groupWidth - seriesNames.length * barWidth) / 2;
        const y = chartHeight - barHeight;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', barWidth.toString());
        rect.setAttribute('height', barHeight.toString());
        rect.setAttribute('fill', colors[seriesIndex % colors.length]);
        rect.setAttribute('rx', '2');

        chartGroup.appendChild(rect);
      });

      // Add x-axis labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (dataIndex * groupWidth + groupWidth / 2).toString());
      text.setAttribute('y', (chartHeight + 20).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.textContent = item.name;
      chartGroup.appendChild(text);
    });

    // Add axes
    this.addAxes(chartGroup, chartWidth, chartHeight);
  }

  private renderLineChart(svg: SVGElement, data: any[], colors: string[]): void {
    const width = 800;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const seriesNames = Object.keys(data[0] || {}).filter(key => key !== 'name');
    const maxValue = Math.max(...data.flatMap(d => seriesNames.map(s => d[s] || 0)));

    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(chartGroup);

    // Render lines
    seriesNames.forEach((series, seriesIndex) => {
      const pathData = data.map((item, index) => {
        const x = (index / (data.length - 1)) * chartWidth;
        const y = chartHeight - ((item[series] || 0) / maxValue) * chartHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', colors[seriesIndex % colors.length]);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      chartGroup.appendChild(path);

      // Add dots
      data.forEach((item, index) => {
        const x = (index / (data.length - 1)) * chartWidth;
        const y = chartHeight - ((item[series] || 0) / maxValue) * chartHeight;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', colors[seriesIndex % colors.length]);
        chartGroup.appendChild(circle);
      });
    });

    // Add x-axis labels
    data.forEach((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', (chartHeight + 20).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.textContent = item.name;
      chartGroup.appendChild(text);
    });

    this.addAxes(chartGroup, chartWidth, chartHeight);
  }

  private renderPieChart(svg: SVGElement, data: any[], colors: string[]): void {
    const width = 800;
    const height = 250;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    let currentAngle = 0;

    data.forEach((item, index) => {
      const value = item.value || 0;
      const angle = (value / total) * 2 * Math.PI;
      const endAngle = currentAngle + angle;

      // Create arc path
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      const x1 = centerX + radius * Math.cos(currentAngle);
      const y1 = centerY + radius * Math.sin(currentAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', colors[index % colors.length]);
      path.setAttribute('stroke', 'white');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);

      // Add label
      const labelAngle = currentAngle + angle / 2;
      const labelX = centerX + (radius + 20) * Math.cos(labelAngle);
      const labelY = centerY + (radius + 20) * Math.sin(labelAngle);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX.toString());
      text.setAttribute('y', labelY.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.textContent = `${item.name} (${Math.round((value / total) * 100)}%)`;
      svg.appendChild(text);

      currentAngle = endAngle;
    });
  }

  private addAxes(group: SVGElement, width: number, height: number): void {
    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', height.toString());
    xAxis.setAttribute('x2', width.toString());
    xAxis.setAttribute('y2', height.toString());
    xAxis.setAttribute('stroke', '#ccc');
    group.appendChild(xAxis);

    // Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '0');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '0');
    yAxis.setAttribute('y2', height.toString());
    yAxis.setAttribute('stroke', '#ccc');
    group.appendChild(yAxis);
  }

  public updateChart(containerId: string, chartData: ChartData, themeColors: ThemeColors): void {
    this.renderChart(containerId, chartData, themeColors);
  }

  public removeChart(containerId: string): void {
    const container = DOMUtils.querySelector(`#${containerId}`);
    if (container) {
      DOMUtils.clearChildren(container);
    }
    this.charts.delete(containerId);
  }
}