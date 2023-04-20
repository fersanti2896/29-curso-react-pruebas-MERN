
require('dotenv').config({
    path: '.env.test'
});

jest.mock('./src/helpers/getEnvVariables', () => ({
    getEnvironments: () => ({ ...process.env })
}));
