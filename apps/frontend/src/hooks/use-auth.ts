import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData extends LoginCredentials {
    name: string;
}

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Get current user
    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await apiClient.get<User>('/auth/me');
            return response.data;
        },
        retry: false,
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await apiClient.post<{
                access_token: string;
                refresh_token: string;
                user: User;
            }>('/auth/login', credentials);

            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);

            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['currentUser'], user);
            router.push('/dashboard');
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await apiClient.post<{
                access_token: string;
                refresh_token: string;
                user: User;
            }>('/auth/register', data);

            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);

            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['currentUser'], user);
            router.push('/dashboard');
        },
    });

    // Logout function
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        queryClient.clear();
        router.push('/login');
    };

    return {
        user,
        isLoading,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
    };
}