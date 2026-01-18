import { useRoute } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VitalsCard } from "@/components/dashboard/VitalsCard";
import { ECGChart } from "@/components/dashboard/ECGChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Share2, Download, ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Edit2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Med {
  id: number;
  name: string;
  dose: string;
  status: string;
}

interface Note {
  id: number;
  author: string;
  time: string;
  text: string;
}

export default function PatientDetail() {
  const [match, params] = useRoute("/dashboard/patient/:id");
  const { user, patients } = useAuth();
  const { toast } = useToast();
  
  const [meds, setMeds] = useState<Med[]>([
    { id: 1, name: "Epinephrine", dose: "1mg IV push", status: "Active" },
    { id: 2, name: "Amiodarone", dose: "300mg IV Bolus", status: "Completed" }
  ]);
  
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, author: "Dr. James Smith", time: "2 hours ago", text: "Patient showing signs of improvement." },
    { id: 2, author: "Nurse Sarah", time: "30 mins ago", text: "Administered scheduled fluids." }
  ]);

  const [newMed, setNewMed] = useState({ name: "", dose: "" });
  const [editingMed, setEditingMed] = useState<Med | null>(null);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  if (!match || !params) return <div>Patient not found</div>;
  const patient = patients.find(p => p.id === (params as any).id);
  if (!patient) return <div>Patient not found</div>;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied", description: "Patient record link copied to clipboard." });
  };

  const handleExport = () => {
    toast({ title: "Generating Report", description: "Medical report is being generated for download." });
  };

  const handleAddMed = () => {
    if (newMed.name && newMed.dose) {
      setMeds([...meds, { id: Date.now(), ...newMed, status: "Active" }]);
      setNewMed({ name: "", dose: "" });
      toast({ title: "Medication Added" });
    }
  };

  const handleUpdateMed = () => {
    if (editingMed) {
      setMeds(meds.map(m => m.id === editingMed.id ? editingMed : m));
      setEditingMed(null);
      toast({ title: "Medication Updated" });
    }
  };

  const handleAddNote = () => {
    if (newNote && user) {
      setNotes([{ id: Date.now(), author: user.name, time: "Just now", text: newNote }, ...notes]);
      setNewNote("");
      toast({ title: "Note Added" });
    }
  };

  const handleUpdateNote = () => {
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? editingNote : n));
      setEditingNote(null);
      toast({ title: "Note Updated" });
    }
  };

  return (
    <DashboardLayout>
       <div className="space-y-6">
         <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard"><Button variant="ghost" size="sm" className="pl-0"><ArrowLeft className="mr-1 h-4 w-4"/> Dashboard</Button></Link>
            <span>/</span>
            <span className="font-medium text-foreground">Patient Profile</span>
         </div>

         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
             <p className="text-muted-foreground">Age {patient.age} • {patient.gender} • Ward {patient.wardId}</p>
           </div>
           <div className="flex space-x-2">
             <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/> Share</Button>
             <Button variant="default" onClick={handleExport}><Download className="mr-2 h-4 w-4"/> Export</Button>
           </div>
         </div>

         <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-1 space-y-4">
               <VitalsCard title="Heart Rate" value={patient.vitals.heartRate} unit="bpm" status={patient.vitals.heartRate > 100 ? "critical" : "normal"} trend="up" />
               <VitalsCard title="SpO2" value={patient.vitals.spO2} unit="%" status={patient.vitals.spO2 < 90 ? "critical" : "normal"} trend="down" />
               <VitalsCard title="Blood Pressure" value={patient.vitals.bloodPressure} unit="mmHg" status="warning" trend="stable" />
            </div>

            <div className="md:col-span-3 space-y-6">
               <Card><CardHeader><CardTitle>Live Telemetry</CardTitle></CardHeader>
                 <CardContent><ECGChart patientId={patient.id} height={180} /></CardContent>
               </Card>

               <Tabs defaultValue="meds">
                 <TabsList>
                   <TabsTrigger value="meds">Medications</TabsTrigger>
                   <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="meds" className="space-y-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Prescriptions</CardTitle>
                        {user?.role === 'doctor' && (
                          <Dialog>
                            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" /> New Med</Button></DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Add Medication</DialogTitle></DialogHeader>
                              <div className="space-y-4 py-4">
                                <Input placeholder="Medication Name" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                                <Input placeholder="Dosage/Frequency" value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} />
                              </div>
                              <DialogFooter><Button onClick={handleAddMed}>Add</Button></DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {meds.map(m => (
                            <li key={m.id} className="group flex justify-between items-center p-3 rounded bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-3">
                                {user?.role === 'nurse' ? (
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMeds(meds.map(med => med.id === m.id ? {...med, status: med.status === 'Active' ? 'Completed' : 'Active'} : med))}>
                                    {m.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
                                  </Button>
                                ) : (
                                  <div className="h-8 w-8 flex items-center justify-center">
                                     {m.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{m.name}</p>
                                  <p className="text-xs text-muted-foreground">{m.dose}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${m.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'}`}>{m.status}</span>
                                {user?.role === 'doctor' && (
                                  <>
                                    <Dialog>
                                      <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingMed(m)}><Edit2 className="h-3.5 w-3.5" /></Button></DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader><DialogTitle>Edit Medication</DialogTitle></DialogHeader>
                                        <div className="space-y-4 py-4">
                                          <Input placeholder="Medication Name" value={editingMed?.name || ""} onChange={e => setEditingMed(editingMed ? {...editingMed, name: e.target.value} : null)} />
                                          <Input placeholder="Dosage/Frequency" value={editingMed?.dose || ""} onChange={e => setEditingMed(editingMed ? {...editingMed, dose: e.target.value} : null)} />
                                        </div>
                                        <DialogFooter><Button onClick={handleUpdateMed}>Save Changes</Button></DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setMeds(meds.filter(x => x.id !== m.id)); toast({ title: "Medication Removed" }); }}><Trash2 className="h-4 w-4" /></Button>
                                  </>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                 </TabsContent>

                 <TabsContent value="notes" className="space-y-4">
                   <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Doctor Notes</CardTitle>
                        {user?.role === 'doctor' && (
                          <div className="flex gap-2">
                            <Input placeholder="Quick note..." className="w-[200px]" value={newNote} onChange={e => setNewNote(e.target.value)} />
                            <Button size="sm" onClick={handleAddNote}><Plus className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {notes.map(n => (
                          <div key={n.id} className="group flex gap-4 p-3 rounded bg-muted/20 border border-border/40 relative hover:bg-muted/30 transition-colors">
                             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">{n.author[0]}</div>
                             <div className="flex-1">
                               <p className="text-sm font-semibold">{n.author} <span className="text-xs text-muted-foreground font-normal ml-2">{n.time}</span></p>
                               <p className="text-sm text-muted-foreground mt-1">{n.text}</p>
                             </div>
                             {user?.role === 'doctor' && (
                               <div className="flex items-center gap-1">
                                 <Dialog>
                                   <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingNote(n)}><Edit2 className="h-3.5 w-3.5" /></Button></DialogTrigger>
                                   <DialogContent>
                                      <DialogHeader><DialogTitle>Edit Note</DialogTitle></DialogHeader>
                                      <div className="py-4"><Input value={editingNote?.text || ""} onChange={e => setEditingNote(editingNote ? {...editingNote, text: e.target.value} : null)} /></div>
                                      <DialogFooter><Button onClick={handleUpdateNote}>Save</Button></DialogFooter>
                                   </DialogContent>
                                 </Dialog>
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setNotes(notes.filter(x => x.id !== n.id)); toast({ title: "Note Deleted" }); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                               </div>
                             )}
                          </div>
                        ))}
                      </CardContent>
                   </Card>
                 </TabsContent>
               </Tabs>
            </div>
         </div>
       </div>
    </DashboardLayout>
  );
}
