module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
  ],
  moduleDirectories: [
    'node_modules',
    'src',
    './',
  ],
  moduleNameMapper: {
    '.scss$': '<rootDir>/src/__tests__/StyleMock.js',
  },
  setupFiles: [
    '<rootDir>/src/__tests__/test-bundle.js',
  ],

  setupTestFrameworkScriptFile: 'jest-enzyme/lib/index.js',

  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],

  testEnvironmentOptions: {
    pretendToBeVisual: true,
  },

  testRegex: '/src/.*?__tests?__/.*?\\.(test|spec)\\.jsx?$',
  testURL: 'http://localhost:3000',

  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 75,
      lines: 65,
      statements: 65
    },
  },
  verbose: true,
};
