import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig: Config = {
    // Test environment
    testEnvironment: 'jest-environment-jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Module name mapping
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@public/(.*)$': '<rootDir>/public/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@store/(.*)$': '<rootDir>/src/store/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',

        // Handle CSS modules
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',

        // Handle static assets
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
    },

    // Test match patterns
    testMatch: [
        '<rootDir>/src/**/*.test.{ts,tsx}',
        '<rootDir>/src/**/*.spec.{ts,tsx}',
        '<rootDir>/__tests__/**/*.{test,spec}.{ts,tsx}',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/app/layout.tsx',
        '!src/app/providers.tsx',
        '!src/types/**',
    ],

    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        './src/components/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
        './src/hooks/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },

    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],

    // Transform configuration
    transform: {
        '^.+\\.(t|j)sx?$': [
            '@swc/jest',
            {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                        decorators: true,
                    },
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
            },
        ],
    },

    // Test timeout
    testTimeout: 10000,

    // Ignore patterns
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/',
        '<rootDir>/e2e/',
    ],

    // Watch plugins
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],

    // Clear mocks
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    reporters: process.env.CI ? ['default', 'jest-junit'] : ['default'],
};

export default createJestConfig(customJestConfig);