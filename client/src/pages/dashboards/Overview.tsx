import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalsCard } from "@/components/dashboard/VitalsCard";
import { ECGChart } from "@/components/dashboard/ECGChart";
import { AlertCircle, Users, Activity, Bed, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Overview() {
  const { user, patients, addPatient, removePatient } = useAuth();
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    diagnosis: "",
    wardId: "ICU-A",
    bedNumber: "",
    status: "stable"
  });
  
  const relevantPatients = user?.role === "doctor" 
    ? patients.filter(p => p.doctorId === user.id)
    : user?.role === "nurse"
    ? patients.filter(p => p.wardId === user.assignedWard)
    : user?.role === "patient"
    ? patients.filter(p => p.id === user.id) // Mock: parent sees their specific patient
    : patients;

  const criticalPatients = relevantPatients.filter(p => p.status === "critical");

  if (!user) return null;

  const handleAddPatient = () => {
    const id = `PAT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    addPatient({
      ...newPatient,
      id,
      age: parseInt(newPatient.age) || 0,
      gender: newPatient.gender as "Male" | "Female" | "Other",
      admissionDate: new Date().toISOString().split('T')[0],
      doctorId: "DOC-001",
      status: newPatient.status as any,
      vitals: {
        heartRate: 75,
        spO2: 98,
        bloodPressure: "120/80",
        temperature: 37.0,
        respiratoryRate: 16
      },
      alerts: []
    });
    setIsAddPatientOpen(false);
    setNewPatient({ name: "", age: "", gender: "Male", diagnosis: "", wardId: "ICU-A", bedNumber: "", status: "stable" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {user.role === 'patient' ? 'Parent Dashboard' : 'Dashboard'}
            </h2>
            <p className="text-muted-foreground">
              Welcome back, {user.name}.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {user.role === 'admin' && (
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Patient</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="age" className="text-right">Age</Label>
                      <Input id="age" type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Gender</Label>
                      <Select value={newPatient.gender} onValueChange={v => setNewPatient({...newPatient, gender: v})}>
                        <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="diag" className="text-right">Diagnosis</Label>
                      <Input id="diag" value={newPatient.diagnosis} onChange={e => setNewPatient({...newPatient, diagnosis: e.target.value})} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleAddPatient}>Confirm Admission</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" size="sm"><Clock className="mr-2 h-4 w-4" /> Shift Log</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitoring Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relevantPatients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalPatients.length}</div>
            </CardContent>
          </Card>
        </div>

        {(user.role !== 'patient') && criticalPatients.length > 0 && (
          <div className="space-y-4">
             <h3 className="text-xl font-semibold tracking-tight">Critical Monitoring</h3>
             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
               {criticalPatients.map(patient => (
                 <Card key={patient.id} className="overflow-hidden border-destructive/50 shadow-sm hover:shadow-md transition-shadow">
                   <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-destructive/5 pb-2">
                     <div>
                       <CardTitle className="text-base font-bold flex items-center">
                         {patient.name}
                         <span className="ml-2 inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">CRITICAL</span>
                       </CardTitle>
                       <CardDescription>{patient.bedNumber} • {patient.diagnosis}</CardDescription>
                     </div>
                     <Link href={`/dashboard/patient/${patient.id}`}>
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                         <Activity className="h-4 w-4" />
                       </Button>
                     </Link>
                   </CardHeader>
                   <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <VitalsCard title="Heart Rate" value={patient.vitals.heartRate} unit="bpm" status="critical" trend="up" className="border-none shadow-none bg-background/50" />
                        <VitalsCard title="SpO2" value={patient.vitals.spO2} unit="%" status="warning" trend="down" className="border-none shadow-none bg-background/50" />
                      </div>
                      <ECGChart patientId={patient.id} height={60} color="rgb(239, 68, 68)" />
                   </CardContent>
                 </Card>
               ))}
             </div>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Patient Registry</h3>
          <Card>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 font-medium text-muted-foreground">
                      <th className="h-12 px-4">ID</th>
                      <th className="h-12 px-4">Name</th>
                      <th className="h-12 px-4">Ward/Bed</th>
                      <th className="h-12 px-4">Status</th>
                      <th className="h-12 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relevantPatients.map((patient) => (
                      <tr key={patient.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-mono text-xs">{patient.id}</td>
                        <td className="p-4 font-medium">{patient.name}</td>
                        <td className="p-4">{patient.wardId} - {patient.bedNumber}</td>
                        <td className="p-4">
                           <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", patient.status === "critical" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700")}>
                             {patient.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Link href={`/dashboard/patient/${patient.id}`}>
                            <Button variant="ghost" size="sm">Details</Button>
                          </Link>
                          {user.role === 'admin' && (
                            <Button variant="ghost" size="sm" onClick={() => removePatient(patient.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
