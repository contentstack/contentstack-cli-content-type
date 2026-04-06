module.exports = {
  roots: [
    '<rootDir>',
  ],
  testMatch: [
    '**/tests/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // Coverage: raise thresholds toward ~80% lines/branches/functions as the suite grows (see AGENTS.md).
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
