import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import LoginBg from '@/assets/login-bg.png';
import { useLogin } from './hooks/useLogin';
import { useState } from 'react';

const Login = () => {

    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const { handleLogin, handleSubmit, formState, register, mutate: { isPending, isError, error, reset } } = useLogin();

    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={LoginBg}
                        alt="Security Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/50" />
                </div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Advanced Security Management
                    </h1>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        Secure, efficient, and intelligent face recognition access control system.
                        Monitor your premises with state-of-the-art AI technology.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground">
                            Enter your credentials to access the dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Email address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="name@company.com"
                                        className="pl-10 h-11 bg-muted/30 border-input/60 focus:bg-background transition-all"
                                        {...register("username", {onChange : () => {
                                            if(isError) reset();
                                        }})}
                                        autoComplete="username"
                                    />
                                    {
                                        formState.errors.username && (
                                            <p className="text-red-500 text-xs font-mono p-2">{formState.errors.username.message}</p>
                                        )
                                    }
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10 h-11 bg-muted/30 border-input/60 focus:bg-background transition-all"
                                        {...register("password", {onChange : () => {
                                            if(isError) reset();
                                        }})}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground/50 hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                    {
                                        formState.errors.password && (
                                            <p className="text-red-500 text-xs font-mono p-2">{formState.errors.password.message}</p>
                                        )
                                    }
                                    {isError && <p className="text-red-500 text-xs font-mono p-2">{error?.message}</p>}
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="keep-signed-in"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="keep-signed-in" className="font-normal text-muted-foreground cursor-pointer">
                                Keep me signed in
                            </Label>
                        </div>

                        <Button
                            className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground pt-4">
                        <p>
                            Don't have an account?{' '}
                            <a href="#" className="font-medium text-primary hover:underline underline-offset-4">
                                Contact Administrator
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
