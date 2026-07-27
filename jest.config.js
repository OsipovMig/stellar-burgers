module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@components$': '<rootDir>/src/components/index.ts',
    '^@ui$': '<rootDir>/src/components/ui/index.ts',
    '\\.css$': 'jest-css-modules-transform'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
