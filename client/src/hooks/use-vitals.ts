import { useQuery } from "@tanstack/react-query";

export interface Vital {
  id: string;
  heartRate?: string | null;
  spo2?: string | null;
  temperature?: string | null;
  fall?: boolean | null;
  timestamp: Date;
}

async function fetchVitals(limit: number = 10): Promise<Vital[]> {
  const response = await fetch(`/api/vitals?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch vitals");
  }
  const data = await response.json();
  return data.map((vital: any) => ({
    ...vital,
    timestamp: new Date(vital.timestamp),
  }));
}

export function useVitals(limit: number = 10) {
  return useQuery({
    queryKey: ["vitals", limit],
    queryFn: () => fetchVitals(limit),
    refetchInterval: 2000, // Update every 2 seconds
    refetchOnWindowFocus: true,
  });
}

export function useLatestVital() {
  const { data, ...rest } = useVitals(1);
  return {
    vital: data?.[0],
    ...rest,
  };
}
