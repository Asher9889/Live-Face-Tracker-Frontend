import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const EmployeeHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Mock employee data
    const employee = {
        id: id || "EMP-1000",
        name: "Alice Smith",
        department: "Engineering",
        role: "Senior Developer",
        email: "alice.smith@example.com",
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        joinDate: "2023-01-15",
        status: "Active"
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{employee.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        {employee.id} • {employee.department} • <Badge variant="outline" className="text-xs font-normal">{employee.status}</Badge>
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export History
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Left Sidebar - Profile & Calendar */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={employee.avatar} />
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-lg">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>

                            <Separator className="my-4" />

                            <div className="w-full space-y-3 text-sm text-left">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Department</span>
                                    <span className="font-medium">{employee.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span className="font-medium">{format(new Date(employee.joinDate), "PPP")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium truncate max-w-[150px]" title={employee.email}>{employee.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Attendance Calendar</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow-none"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content - Stats & Timeline */}
                <div className="md:col-span-5 space-y-6">
                    {/* Monthly Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">22</div>
                                <p className="text-xs text-muted-foreground">/ 24 working days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                <CardTitle className="text-sm font-medium">Avg Hours</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">8.5h</div>
                                <p className="text-xs text-muted-foreground">Per day</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                <CardTitle className="text-sm font-medium">Lateness</CardTitle>
                                <Clock className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-orange-600">3</div>
                                <p className="text-xs text-muted-foreground">Late arrivals</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                <CardTitle className="text-sm font-medium">Locations</CardTitle>
                                <MapPin className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">2</div>
                                <p className="text-xs text-muted-foreground">Offices visited</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Timeline for Selected Date */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Daily Activity</CardTitle>
                            <CardDescription>
                                Timeline for {date ? format(date, "PPPP") : "Selected Date"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l ml-4 space-y-8 pb-4">
                                {[
                                    { time: "09:15 AM", type: "ENTRY", gate: "Main Entrance", desc: "Face Verified (99%)" },
                                    { time: "01:05 PM", type: "EXIT", gate: "Cafeteria Exit", desc: "Lunch Break" },
                                    { time: "01:50 PM", type: "ENTRY", gate: "Cafeteria Entry", desc: "Return from Break" },
                                    { time: "06:30 PM", type: "EXIT", gate: "Main Entrance", desc: "Shift End" },
                                ].map((event, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background ${event.type === 'ENTRY' ? 'border-green-500' : 'border-orange-500'
                                            }`} />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm">{event.time}</span>
                                                <Badge variant="secondary">{event.type}</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{event.gate}</div>
                                            <div className="text-xs text-muted-foreground">{event.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmployeeHistory;
