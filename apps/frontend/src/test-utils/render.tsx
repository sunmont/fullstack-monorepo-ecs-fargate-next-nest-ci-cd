import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter } from 'react-router-dom';

// Create a custom render with providers
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            cacheTime: 0,
        },
        mutations: {
            retry: false,
        },
    },
    logger: {
        log: console.log,
        warn: console.warn,
        error: () => {},
    },
});

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };