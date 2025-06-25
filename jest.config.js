export default {
  testEnvironment: 'jsdom',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  collectCoverageFrom: [
    'components/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    'config/**/*.js',
    '!**/node_modules/**',
  ],
}; 