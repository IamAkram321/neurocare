import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { User, MOCK_USERS, Patient, MOCK_PATIENTS } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  login: (hospitalCode: string, userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  updatePatient: (patient: Patient) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const login = async (hospitalCode: string, userId: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (hospitalCode !== "HOSP-001") {
      toast({
        variant: "destructive",
        title: "Invalid Hospital Code",
        description: "Please check your hospital code and try again.",
      });
      setIsLoading(false);
      return;
    }

    const foundUser = MOCK_USERS.find((u) => u.id === userId);

    if (foundUser) {
      setUser(foundUser);
      toast({
        title: "Welcome back",
        description: `Logged in as ${foundUser.name} (${foundUser.role === 'patient' ? 'Parent' : foundUser.role})`,
      });
      setLocation("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "User Not Found",
        description: "Invalid User ID. Please try again.",
      });
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    toast({ title: "Patient Added", description: `${patient.name} has been registered.` });
  };

  const removePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    toast({ title: "Patient Discharged", description: "Patient record removed from system." });
  };

  const updatePatient = (patient: Patient) => {
    setPatients(prev => prev.map(p => p.id === patient.id ? patient : p));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, patients, addPatient, removePatient, updatePatient }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
