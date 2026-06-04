import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    uid: string;
    email: string;
    displayName?: string;
    subscription?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Restore user from localStorage on app load
const loadUserFromStorage = (): { user: User | null; isAuthenticated: boolean } => {
    try {
        const saved = localStorage.getItem('gruhap_user');
        if (saved) {
            const user = JSON.parse(saved) as User;
            return { user, isAuthenticated: true };
        }
    } catch (e) {
        localStorage.removeItem('gruhap_user');
    }
    return { user: null, isAuthenticated: false };
};

const persisted = loadUserFromStorage();

const initialState: AuthState = {
    user: persisted.user,
    isAuthenticated: persisted.isAuthenticated,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
            state.error = null;
        },
        setAuthSuccess: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
            // Persist to localStorage
            localStorage.setItem('gruhap_user', JSON.stringify(action.payload));
        },
        setAuthFailure: (state, action: PayloadAction<string>) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = action.payload;
            localStorage.removeItem('gruhap_user');
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('gruhap_user');
        },
    },
});

export const { setLoading, setAuthSuccess, setAuthFailure, logout } = authSlice.actions;
export default authSlice.reducer;

