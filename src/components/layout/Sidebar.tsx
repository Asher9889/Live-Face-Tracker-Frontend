import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Video,
    Users,
    UserCheck,
    Camera,
    Bell,
    Clock,
    LogOut
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppSelector } from '@/store/hooks';

const Sidebar = () => {
    const { isSidebarOpen } = useAppSelector((state) => state.ui);

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/live', icon: Video, label: 'Live Monitoring' },
        { to: '/attendance', icon: UserCheck, label: 'Attendance' },
        { to: '/visitors', icon: Users, label: 'Visitors' },
        { to: '/employees', icon: Users, label: 'Employees' },
        { to: '/cameras', icon: Camera, label: 'Cameras' },
        { to: '/alerts', icon: Bell, label: 'Alerts' },
        { to: '/timeline', icon: Clock, label: 'Timeline' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out pt-16",
                isSidebarOpen ? "w-64" : "w-16"
            )}
        >
            <nav className="flex flex-col gap-2 p-2 h-full">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground",
                                !isSidebarOpen && "justify-center"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {isSidebarOpen && <span className="truncate">{item.label}</span>}
                    </NavLink>
                ))}

                <div className="mt-auto border-t pt-2">
                    <button className={cn(
                        "flex items-center gap-3 px-3 py-2 w-full rounded-md transition-colors hover:bg-destructive/10 hover:text-destructive text-muted-foreground",
                        !isSidebarOpen && "justify-center"
                    )}>
                        <LogOut className="h-5 w-5 shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
