import { Bell, Menu, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { cn } from '@/utils/cn';
import { ModeToggle } from '../common/ModeToggle';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { isSidebarOpen } = useAppSelector((state) => state.ui);

    return (
        <header className={cn(
            "fixed top-0 right-0 z-50 h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 transition-all duration-300",
            isSidebarOpen ? "left-64" : "left-16"
        )}>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    FaceTracker AI
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <ModeToggle />
                <button className="p-2 hover:bg-accent rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full animate-pulse" />
                </button>
                <div className="flex items-center gap-2 pl-4 border-l">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">System Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
