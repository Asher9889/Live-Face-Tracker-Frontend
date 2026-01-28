import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'guard' | 'viewer';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    status: 'checking' | 'authenticated' | 'unauthenticated';

}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: 'checking',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authCheckedUnauthenticated: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'unauthenticated';
        },

        authCheckedAuthenticated: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.status = 'authenticated';
        },
        login: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.status = 'authenticated';
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'unauthenticated';
        },
    },
});

export const { login, logout, authCheckedUnauthenticated, authCheckedAuthenticated} = authSlice.actions;
export default authSlice.reducer;
