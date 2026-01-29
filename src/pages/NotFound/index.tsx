import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginBg from '@/assets/login-bg.png';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen w-full bg-background items-center justify-center relative overflow-hidden">
            {/* Background elements similar to Login for consistency */}
            <div className="absolute inset-0 z-0">
                <img
                    src={LoginBg}
                    alt="Security Background"
                    className="w-full h-full object-cover opacity-10 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/95 to-background" />
            </div>

            <div className="relative z-10 w-full max-w-lg p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">

                {/* 404 Icon wrapper */}
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="w-32 h-32 rounded-3xl bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 mx-auto transform rotate-45">
                        <div className="transform -rotate-45">
                            <ShieldAlert className="w-16 h-16 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 select-none">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Restricted Area/Page Not Found
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                        The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                        onClick={() => navigate('/')}
                    >
                        <Home className="w-4 h-4" />
                        Return Dashboard
                    </Button>
                </div>

                {/* Footer Security Badge */}
                <div className="pt-12 flex flex-col items-center gap-2 opacity-50">
                    <div className="h-1 w-12 bg-border rounded-full" />
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                        System Security Active
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
