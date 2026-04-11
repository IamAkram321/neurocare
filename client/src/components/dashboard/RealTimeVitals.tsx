import { useLatestVital } from "@/hooks/use-vitals";
import { VitalsCard } from "./VitalsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Droplet, Thermometer, AlertTriangle } from "lucide-react";

export function RealTimeVitals() {
  const { vital, isLoading, error } = useLatestVital();

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle>Arduino Connection Error</CardTitle>
          <CardDescription>Failed to connect to sensor data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Make sure Arduino is connected and sending data</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !vital) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Sensor Data</CardTitle>
          <CardDescription>Waiting for Arduino data...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Connecting to sensors...</p>
        </CardContent>
      </Card>
    );
  }

  if (!vital) {
    return (
      <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle>No Data Yet</CardTitle>
          <CardDescription>No sensor readings available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Arduino will start sending data once connected</p>
        </CardContent>
      </Card>
    );
  }

  const heartRate = vital.heartRate ? parseFloat(vital.heartRate) : 0;
  const spo2 = vital.spo2 ? parseFloat(vital.spo2) : 0;
  const temperature = vital.temperature ? parseFloat(vital.temperature) : 0;
  const fall = vital.fall === true;

  // Determine status based on readings
  const getHRStatus = () => {
    if (heartRate < 40 || heartRate > 120) return "critical";
    if (heartRate < 60 || heartRate > 100) return "warning";
    return "normal";
  };

  const getSpO2Status = () => {
    if (spo2 < 85) return "critical";
    if (spo2 < 92) return "warning";
    return "normal";
  };

  const getTempStatus = () => {
    if (temperature < 36 || temperature > 39) return "critical";
    if (temperature < 37 || temperature > 37.5) return "warning";
    return "normal";
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <VitalsCard
        title="Heart Rate"
        value={heartRate.toFixed(0)}
        unit="bpm"
        status={getHRStatus()}
        icon={<HeartPulse className="h-4 w-4" />}
        footer={vital.timestamp ? new Date(vital.timestamp).toLocaleTimeString() : ""}
      />
      <VitalsCard
        title="SpO2"
        value={spo2.toFixed(1)}
        unit="%"
        status={getSpO2Status()}
        icon={<Droplet className="h-4 w-4" />}
        footer={vital.timestamp ? new Date(vital.timestamp).toLocaleTimeString() : ""}
      />
      <VitalsCard
        title="Temperature"
        value={temperature.toFixed(1)}
        unit="°C"
        status={getTempStatus()}
        icon={<Thermometer className="h-4 w-4" />}
        footer={vital.timestamp ? new Date(vital.timestamp).toLocaleTimeString() : ""}
      />
      <VitalsCard
        title="Fall Detected"
        value={fall ? "Yes" : "No"}
        unit=""
        status={fall ? "critical" : "normal"}
        icon={<AlertTriangle className="h-4 w-4" />}
        footer={fall ? "Alert" : "OK"}
      />
    </div>
  );
}
