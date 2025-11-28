import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/utils/cn';

const MainLayout = () => {
    const { isSidebarOpen } = useAppSelector((state) => state.ui);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />
            <Navbar />
            <main
                className={cn(
                    "pt-16 min-h-screen transition-all duration-300 p-6",
                    isSidebarOpen ? "pl-64" : "pl-16"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
