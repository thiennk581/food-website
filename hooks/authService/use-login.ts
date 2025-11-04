import { useState, useCallback } from 'react';

// /home/thiennk/Documents/food-ordering-app/hooks/authService/use-login.ts

type LoginCredentials = {
    username: string;
    password: string;
};

type LoginResponse = {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    [key: string]: any;
};

// Base URL from env (fallback to localhost:8080)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const LOGIN_PATH = '/auth/login'; // chỉnh nếu backend dùng path khác
const LOGIN_URL = `${BASE_URL}${LOGIN_PATH}`;

/**
 * Hook để gọi API login (Spring Boot) và lưu token vào localStorage.
 * Trả về: { login, loading, error, token, logout }
 */
export default function useLogin() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(() =>
        typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    );

    const login = useCallback(async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!res.ok) {
                // try to parse error body, fallback to status text
                let message = res.statusText;
                try {
                    const errBody = await res.json();
                    message = errBody?.message ?? JSON.stringify(errBody) ?? message;
                } catch {}
                throw new Error(message || `HTTP ${res.status}`);
            }

            const data: LoginResponse | string = await res.json().catch(() => ('' as any));

            // Support several shapes: { token }, { accessToken }, or plain string
            let receivedToken: string | null = null;
            if (typeof data === 'string') {
                receivedToken = data;
            } else {
                receivedToken = (data as LoginResponse).token ?? (data as LoginResponse).accessToken ?? null;
            }

            if (!receivedToken) {
                throw new Error('Token not found in login response');
            }

            localStorage.setItem('authToken', receivedToken);
            setToken(receivedToken);
            return receivedToken;
        } catch (err: any) {
            setError(err?.message ?? 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setToken(null);
    }, []);

    return { login, loading, error, token, logout };
}