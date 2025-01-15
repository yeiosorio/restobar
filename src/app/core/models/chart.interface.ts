export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface ChartOptions {
  plugins: {
    legend: {
      labels: {
        color: string;
      };
    };
  };
  scales: {
    x: ChartAxis;
    y: ChartAxis;
  };
}

export interface ChartAxis {
  ticks: {
    color: string;
  };
  grid: {
    color: string;
  };
} 