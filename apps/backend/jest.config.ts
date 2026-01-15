import type { Config } from 'jest';

const config: Config = {
    // Test environment
    testEnvironment: 'node',

    // Module name mapping
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@auth/(.*)$': '<rootDir>/src/auth/$1',
        '^@users/(.*)$': '<rootDir>/src/users/$1',
        '^@posts/(.*)$': '<rootDir>/src/posts/$1',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
    },

    // Test match patterns
    testMatch: [
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/test/**/*.spec.ts',
        '<rootDir>/test/**/*.test.ts',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/*.module.ts',
        '!src/**/*.interface.ts',
        '!src/**/*.dto.ts',
        '!src/**/*.schema.ts',
        '!src/**/*.spec.ts',
        '!src/**/*.test.ts',
        '!src/main.ts',
        '!src/app.module.ts',
    ],

    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        './src/auth/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
        './src/users/': {
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
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.json',
                isolatedModules: true,
            },
        ],
    },

    // Module file extensions
    moduleFileExtensions: ['js', 'json', 'ts'],

    // Test timeout
    testTimeout: 10000,

    // Global setup
    globalSetup: '<rootDir>/test/global-setup.ts',
    globalTeardown: '<rootDir>/test/global-teardown.ts',
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

    // Clear mocks
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,

    // Coverage path ignore
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/test/',
        '.module.ts$',
        '.dto.ts$',
        '.schema.ts$',
        '.interface.ts$',
    ],

    // Verbose output
    verbose: true,

    reporters: process.env.CI ? ['default', 'jest-junit'] : ['default'],
};

export default config;