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
    '.scss$': '<rootDir>/test/StyleMock.js',
  },
  setupFiles: [
    '<rootDir>/test/test-bundle.js',
  ],

  setupTestFrameworkScriptFile: 'jest-enzyme/lib/index.js',

  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],

  testEnvironmentOptions: {
    pretendToBeVisual: true,
  },

  testRegex: '/test/.*?\\.(test|spec)\\.jsx?$',
  testURL: 'http://localhost:3000',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 75,
      lines: 65,
      statements: 65
    },
  },
  verbose: true,
};
