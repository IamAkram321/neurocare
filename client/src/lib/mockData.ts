export type Role = "admin" | "doctor" | "nurse" | "patient";

export interface User {
  id: string;
  name: string;
  role: Role;
  hospitalCode: string;
  avatar?: string;
  assignedWard?: string; // For nurses
  specialty?: string; // For doctors
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  diagnosis: string;
  admissionDate: string;
  doctorId: string;
  wardId: string;
  bedNumber: string;
  status: "stable" | "critical" | "recovering";
  vitals: {
    heartRate: number;
    spO2: number;
    bloodPressure: string;
    temperature: number;
    respiratoryRate: number;
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  active: boolean;
}

export const MOCK_USERS: User[] = [
  {
    id: "ADMIN-001",
    name: "Dr. Sarah Admin",
    role: "admin",
    hospitalCode: "HOSP-001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "DOC-001",
    name: "Dr. James Wilson",
    role: "doctor",
    hospitalCode: "HOSP-001",
    specialty: "Cardiology",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    id: "DOC-002",
    name: "Dr. Emily Chen",
    role: "doctor",
    hospitalCode: "HOSP-001",
    specialty: "Neurology",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: "NURSE-001",
    name: "Nurse John Doe",
    role: "nurse",
    hospitalCode: "HOSP-001",
    assignedWard: "ICU-A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "PAT-001",
    name: "Michael Brown",
    role: "patient",
    hospitalCode: "HOSP-001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "PAT-001",
    name: "Michael Brown",
    age: 45,
    gender: "Male",
    diagnosis: "Acute Myocardial Infarction",
    admissionDate: "2024-03-10",
    doctorId: "DOC-001",
    wardId: "ICU-A",
    bedNumber: "A-01",
    status: "critical",
    vitals: {
      heartRate: 110,
      spO2: 92,
      bloodPressure: "140/90",
      temperature: 38.5,
      respiratoryRate: 22,
    },
    alerts: [
      {
        id: "ALT-1",
        severity: "critical",
        message: "High Heart Rate Detected (>100 bpm)",
        timestamp: "10 mins ago",
        active: true,
      },
    ],
  },
  {
    id: "PAT-002",
    name: "Alice Smith",
    age: 62,
    gender: "Female",
    diagnosis: "Post-op Recovery",
    admissionDate: "2024-03-12",
    doctorId: "DOC-001",
    wardId: "ICU-A",
    bedNumber: "A-02",
    status: "stable",
    vitals: {
      heartRate: 72,
      spO2: 98,
      bloodPressure: "120/80",
      temperature: 37.0,
      respiratoryRate: 16,
    },
    alerts: [],
  },
  {
    id: "PAT-003",
    name: "Robert Johnson",
    age: 55,
    gender: "Male",
    diagnosis: "Respiratory Failure",
    admissionDate: "2024-03-11",
    doctorId: "DOC-002",
    wardId: "ICU-A",
    bedNumber: "A-03",
    status: "recovering",
    vitals: {
      heartRate: 85,
      spO2: 95,
      bloodPressure: "130/85",
      temperature: 37.2,
      respiratoryRate: 18,
    },
    alerts: [
      {
        id: "ALT-2",
        severity: "medium",
        message: "SpO2 fluctuating",
        timestamp: "1 hour ago",
        active: false,
      },
    ],
  },
  {
    id: "PAT-004",
    name: "Linda Davis",
    age: 34,
    gender: "Female",
    diagnosis: "Severe Sepsis",
    admissionDate: "2024-03-13",
    doctorId: "DOC-002",
    wardId: "ICU-B",
    bedNumber: "B-01",
    status: "critical",
    vitals: {
      heartRate: 125,
      spO2: 88,
      bloodPressure: "90/60",
      temperature: 39.2,
      respiratoryRate: 28,
    },
    alerts: [
      {
        id: "ALT-3",
        severity: "critical",
        message: "Low SpO2 Alert (<90%)",
        timestamp: "Just now",
        active: true,
      },
      {
        id: "ALT-4",
        severity: "high",
        message: "Hypotension Detected",
        timestamp: "5 mins ago",
        active: true,
      },
    ],
  },
];
