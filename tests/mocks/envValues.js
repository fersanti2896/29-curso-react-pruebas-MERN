
jest.mock('../../src/helpers/getEnvVariables', () => ({
    getEnvVariables: () => ({ ...process.env })
  }))