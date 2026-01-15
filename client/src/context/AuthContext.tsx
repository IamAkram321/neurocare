import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { User, MOCK_USERS } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  login: (hospitalCode: string, userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const login = async (hospitalCode: string, userId: string) => {
    setIsLoading(true);
    // Simulate API delay
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
        description: `Logged in as ${foundUser.name} (${foundUser.role})`,
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
