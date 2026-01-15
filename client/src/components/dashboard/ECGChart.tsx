import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface ECGChartProps {
  patientId: string;
  color?: string;
  height?: number;
}

export function ECGChart({ patientId, color = "rgb(16, 185, 129)", height = 100 }: ECGChartProps) {
  // Use state to force re-renders for animation
  const [dataPoints, setDataPoints] = useState<number[]>(Array(50).fill(0));
  
  // Use ref for the interval to clear it properly
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate simulated ECG wave data
    // Normal sinus rhythm pattern simulation
    let tick = 0;
    
    intervalRef.current = setInterval(() => {
      setDataPoints(prev => {
        const newData = [...prev.slice(1)];
        
        // Simulate PQRST wave
        tick = (tick + 1) % 60; // 60 ticks per cycle approx 1 sec at 60Hz update
        
        let value = Math.random() * 5 - 2.5; // Baseline noise
        
        if (tick >= 10 && tick < 15) value += 5; // P wave
        else if (tick >= 20 && tick < 22) value -= 5; // Q wave
        else if (tick >= 22 && tick < 26) value += 40; // R wave (spike)
        else if (tick >= 26 && tick < 29) value -= 10; // S wave
        else if (tick >= 35 && tick < 45) value += 8; // T wave
        
        newData.push(value);
        return newData;
      });
    }, 50); // Update every 50ms

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [patientId]);

  const data = {
    labels: Array(50).fill(""),
    datasets: [
      {
        label: 'ECG',
        data: dataPoints,
        borderColor: color,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
          gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.0)'));
          return gradient;
        },
        borderWidth: 2,
        tension: 0.4, // Smooth curves
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Disable chart.js internal animation for real-time performance
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: -20,
        max: 50,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <div style={{ height: `${height}px` }} className="w-full relative overflow-hidden bg-black/5 dark:bg-black/20 rounded-md">
           {/* Grid lines overlay */}
           <div className="absolute inset-0 pointer-events-none opacity-20" 
                style={{ 
                  backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} 
           />
           <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
