import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalsCard } from "@/components/dashboard/VitalsCard";
// import { ECGChart } from "@/components/dashboard/ECGChart";
import { AlertCircle, Users, Activity, Bed, Clock, Plus, Trash2, UserPlus, HeartPulse, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_USERS } from "@/lib/mockData";

export default function Overview() {
  const { user, patients, addPatient, removePatient } = useAuth();
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    diagnosis: "",
    doctorId: "DOC-001",
    wardId: "ICU-A",
    bedNumber: "",
    status: "stable",
    vitals: {
      heartRate: "",
      spO2: "",
      bloodPressure: "",
      temperature: "",
      respiratoryRate: ""
    }
  });
  
  const relevantPatients = user?.role === "doctor" 
    ? patients.filter(p => p.doctorId === user.id)
    : user?.role === "nurse"
    ? patients.filter(p => p.wardId === user.assignedWard)
    : user?.role === "patient"
    ? patients.filter(p => p.id === user.id)
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
      status: newPatient.status as any,
      vitals: {
        heartRate: parseInt(newPatient.vitals.heartRate) || 0,
        spO2: parseInt(newPatient.vitals.spO2) || 0,
        bloodPressure: newPatient.vitals.bloodPressure || "120/80",
        temperature: parseFloat(newPatient.vitals.temperature) || 37.0,
        respiratoryRate: parseInt(newPatient.vitals.respiratoryRate) || 0
      },
      alerts: []
    });
    setIsAddPatientOpen(false);
    setNewPatient({ 
      name: "", age: "", gender: "Male", diagnosis: "", doctorId: "DOC-001", wardId: "ICU-A", bedNumber: "", status: "stable",
      vitals: { heartRate: "", spO2: "", bloodPressure: "", temperature: "", respiratoryRate: "" }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {user.role === 'patient' ? 'Parent Monitoring Dashboard' : 'Central Monitoring'}
              </h2>
              <p className="text-muted-foreground">
                {user.role === 'patient' ? 'Monitoring patient care and vital statistics' : `Hospital Command Center • ${user.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {(user.role === 'admin' || user.role === 'doctor') && (
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shadow-lg shadow-primary/20"><UserPlus className="mr-2 h-4 w-4" /> Register Admission</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">New Patient Admission</DialogTitle>
                    <DialogDescription>Register a new patient into the ICU system with initial diagnosis and ward assignment.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="45" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={newPatient.gender} onValueChange={v => setNewPatient({...newPatient, gender: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Initial Status</Label>
                        <Select value={newPatient.status} onValueChange={v => setNewPatient({...newPatient, status: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stable">Stable</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="recovering">Recovering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diag">Primary Diagnosis</Label>
                      <Input id="diag" placeholder="e.g. Acute Cardiac Failure" value={newPatient.diagnosis} onChange={e => setNewPatient({...newPatient, diagnosis: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Attending Doctor</Label>
                      <Select value={newPatient.doctorId} onValueChange={v => setNewPatient({...newPatient, doctorId: v})}>
                        <SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
                        <SelectContent>
                          {MOCK_USERS.filter(u => u.role === 'doctor').map(doctor => (
                            <SelectItem key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ward Assignment</Label>
                        <Select value={newPatient.wardId} onValueChange={v => setNewPatient({...newPatient, wardId: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ICU-A">ICU - Ward A</SelectItem>
                            <SelectItem value="ICU-B">ICU - Ward B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bed">Bed Number</Label>
                        <Input id="bed" placeholder="A-01" value={newPatient.bedNumber} onChange={e => setNewPatient({...newPatient, bedNumber: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Initial Vitals</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                          <Input id="heartRate" type="number" placeholder="75" value={newPatient.vitals.heartRate} onChange={e => setNewPatient({...newPatient, vitals: {...newPatient.vitals, heartRate: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spO2">SpO2 (%)</Label>
                          <Input id="spO2" type="number" placeholder="98" value={newPatient.vitals.spO2} onChange={e => setNewPatient({...newPatient, vitals: {...newPatient.vitals, spO2: e.target.value}})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodPressure">Blood Pressure</Label>
                          <Input id="bloodPressure" placeholder="120/80" value={newPatient.vitals.bloodPressure} onChange={e => setNewPatient({...newPatient, vitals: {...newPatient.vitals, bloodPressure: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="temperature">Temp (°C)</Label>
                          <Input id="temperature" type="number" step="0.1" placeholder="37.0" value={newPatient.vitals.temperature} onChange={e => setNewPatient({...newPatient, vitals: {...newPatient.vitals, temperature: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="respiratoryRate">Resp Rate</Label>
                          <Input id="respiratoryRate" type="number" placeholder="16" value={newPatient.vitals.respiratoryRate} onChange={e => setNewPatient({...newPatient, vitals: {...newPatient.vitals, respiratoryRate: e.target.value}})} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPatient}>Confirm Admission</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" size="sm" className="hidden sm:flex"><Clock className="mr-2 h-4 w-4" /> Shift Log</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Monitoring</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{relevantPatients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active patients under observation</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-gradient-to-br from-destructive/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Critical</CardTitle>
              <HeartPulse className="h-4 w-4 text-destructive animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive tracking-tight">{criticalPatients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requiring immediate attention</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Bed Cap.</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">85%</div>
              <p className="text-xs text-muted-foreground mt-1">3 beds available in Ward A</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Staff</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">12</div>
              <p className="text-xs text-muted-foreground mt-1">Medical staff on duty</p>
            </CardContent>
          </Card>
        </div>

        {relevantPatients.length > 0 ? (
          <>
            {(user.role !== 'patient') && criticalPatients.length > 0 && (
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                   <h3 className="text-xl font-bold tracking-tight text-destructive">Critical Monitoring Grid</h3>
                 </div>
                 <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                   {criticalPatients.map(patient => (
                     <Card key={patient.id} className="overflow-hidden border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-card/50">
                       <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-destructive/5 dark:bg-destructive/10 pb-4">
                         <div>
                           <CardTitle className="text-lg font-bold flex items-center gap-2">
                             {patient.name}
                             <span className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 text-[10px] font-bold text-destructive animate-pulse uppercase">CRITICAL</span>
                           </CardTitle>
                           <CardDescription className="text-foreground/70 font-medium">{patient.bedNumber} • {patient.diagnosis}</CardDescription>
                         </div>
                         <Link href={`/dashboard/patient/${patient.id}`}>
                           <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-sm">
                             <Activity className="h-5 w-5 text-primary" />
                           </Button>
                         </Link>
                       </CardHeader>
                       <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <VitalsCard title="Heart Rate" value={patient.vitals.heartRate} unit="bpm" status="critical" trend="up" className="border-none shadow-none bg-background/40" />
                            <VitalsCard title="SpO2" value={patient.vitals.spO2} unit="%" status="warning" trend="down" className="border-none shadow-none bg-background/40" />
                          </div>
                          <div className="rounded-xl border border-border bg-black/5 dark:bg-black/20 p-3">
                            <div className="mb-2 text-[10px] font-bold text-muted-foreground uppercase flex justify-between">
                              <span>Live ECG Feed</span>
                              <span className="text-destructive animate-pulse">● LIVE</span>
                            </div>
                            {/* <ECGChart patientId={patient.id} height={80} color="rgb(239, 68, 68)" /> */}
                          </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
              </div>
            )}
            
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold tracking-tight">Active Patient Registry</h3>
              <Card className="border-none shadow-lg overflow-hidden">
                 <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                        <tr className="hover:bg-transparent transition-none text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
                          <th className="h-14 px-6">ID</th>
                          <th className="h-14 px-6">Patient Name</th>
                          <th className="h-14 px-6">Location</th>
                          <th className="h-14 px-6">Clinical Status</th>
                          <th className="h-14 px-6 text-right">Management</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {relevantPatients.map((patient) => (
                          <tr key={patient.id} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{patient.id}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground">{patient.name}</span>
                                <span className="text-xs text-muted-foreground">{patient.age} yrs • {patient.gender}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary/40" />
                                <span className="font-medium">{patient.wardId}</span>
                                <span className="text-muted-foreground text-xs">• Bed {patient.bedNumber}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={cn(
                                 "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                                 patient.status === "critical" ? "bg-red-500/10 text-red-600 dark:text-red-400" : 
                                 patient.status === "recovering" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                                 "bg-green-500/10 text-green-600 dark:text-green-400"
                               )}>
                                 {patient.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/dashboard/patient/${patient.id}`}>
                                  <Button variant="outline" size="sm" className="h-8 font-semibold">View Profile</Button>
                                </Link>
                                {(user.role === 'admin' || user.role === 'doctor') && (
                                  <Button variant="ghost" size="icon" onClick={() => removePatient(patient.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-muted rounded-3xl p-12">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No Patients Registered</h3>
              <p className="text-muted-foreground max-w-sm">There are currently no patients registered in the system or assigned to your current profile.</p>
            </div>
            {(user.role === 'admin' || user.role === 'doctor') && (
              <Button onClick={() => setIsAddPatientOpen(true)} className="mt-4"><UserPlus className="mr-2 h-4 w-4" /> Admission Entry</Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
