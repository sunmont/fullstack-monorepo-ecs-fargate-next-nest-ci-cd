import { renderHook, waitFor, act } from '@/test-utils/render';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock apiClient
vi.mock('@/lib/api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    },
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Create wrapper with QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('useAuth Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    it('fetches current user on mount', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
        };

        (apiClient.get as any).mockResolvedValueOnce({ data: mockUser });

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(apiClient.get).toHaveBeenCalledWith('/auth/me');

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.user).toEqual(mockUser);
        });
    });

    it('handles successful login', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'Password123!',
        };

        const mockResponse = {
            data: {
                access_token: 'access-token',
                refresh_token: 'refresh-token',
                user: { id: '1', name: 'Test User' },
            },
        };

        (apiClient.post as any).mockResolvedValueOnce(mockResponse);
        (apiClient.get as any).mockResolvedValueOnce({
            data: { id: '1', name: 'Test User' }
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.login(credentials);
        });

        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'access_token',
                'access-token'
            );
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'refresh_token',
                'refresh-token'
            );
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
            expect(result.current.user).toEqual({ id: '1', name: 'Test User' });
        });
    });

    it('handles login error', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'wrongpassword',
        };

        (apiClient.post as any).mockRejectedValueOnce(
            new Error('Invalid credentials')
        );

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.login(credentials);
        });

        await waitFor(() => {
            expect(result.current.user).toBeUndefined();
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    it('handles logout', async () => {
        (apiClient.get as any).mockResolvedValueOnce({
            data: { id: '1', name: 'Test User' },
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // First, login
        await waitFor(() => {
            expect(result.current.user).toBeDefined();
        });

        // Then logout
        act(() => {
            result.current.logout();
        });

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('handles authentication errors', async () => {
        (apiClient.get as any).mockRejectedValueOnce(
            new Error('Unauthorized')
        );

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.user).toBeUndefined();
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('handles registration', async () => {
        const userData = {
            email: 'new@example.com',
            password: 'Password123!',
            name: 'New User',
        };

        const mockResponse = {
            data: {
                access_token: 'access-token',
                refresh_token: 'refresh-token',
                user: { id: '2', ...userData },
            },
        };

        (apiClient.post as any).mockResolvedValueOnce(mockResponse);
        (apiClient.get as any).mockResolvedValueOnce({
            data: { id: '2', ...userData }
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.register(userData);
        });

        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'access_token',
                'access-token'
            );
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
            expect(result.current.user).toEqual(expect.objectContaining(userData));
        });
    });
});