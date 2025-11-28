import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ArrowRight, MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Timeline = () => {
    // Mock events
    const events = [
        { id: '1', type: 'entry', time: '08:45 AM', location: 'Main Entrance', camera: 'Camera 1', image: 'https://i.pravatar.cc/150?u=1' },
        { id: '2', type: 'seen', time: '09:15 AM', location: 'Cafeteria', camera: 'Camera 4', image: 'https://i.pravatar.cc/150?u=1' },
        { id: '3', type: 'seen', time: '11:30 AM', location: 'Lobby', camera: 'Camera 2', image: 'https://i.pravatar.cc/150?u=1' },
        { id: '4', type: 'exit', time: '05:30 PM', location: 'Main Entrance', camera: 'Camera 1', image: 'https://i.pravatar.cc/150?u=1' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Person Timeline</h2>
                <div className="flex items-center gap-4">
                    <Select>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="emp1">Employee 1</SelectItem>
                            <SelectItem value="emp2">Employee 2</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Select Date
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold">John Doe</h3>
                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                        <p className="text-sm text-muted-foreground">EMP-1001</p>

                        <div className="w-full mt-6 space-y-2 text-left">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Department</span>
                                <span className="font-medium">Engineering</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-green-500 font-medium">Active</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Last Seen</span>
                                <span className="font-medium">Today, 05:30 PM</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {events.map((event) => (
                                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        {event.type === 'entry' ? <ArrowRight className="w-5 h-5" /> :
                                            event.type === 'exit' ? <ArrowRight className="w-5 h-5 rotate-180" /> :
                                                <MapPin className="w-5 h-5" />}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">{event.location}</div>
                                            <time className="font-caveat font-medium text-indigo-500">{event.time}</time>
                                        </div>
                                        <div className="text-slate-500 text-sm flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {event.camera}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Timeline;
