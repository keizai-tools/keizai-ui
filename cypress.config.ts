import registerCodeCoverageTasks from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config();

// https://docs.cypress.io/guides/references/configuration
export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  port: process.env.CYPRESS_HOST_PORT ? +process.env.CYPRESS_HOST_PORT : 3001,
  e2e: {
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      return config;
    },
    baseUrl: process.env.CYPRESS_BASE_URL_PREFIX,
    specPattern: 'cypress/tests/**/*.spec.{js,jsx,ts,tsx}',
  },
  viewportWidth: 1280,
  viewportHeight: 960,
  requestTimeout: 30000,
  responseTimeout: 30000,
  defaultCommandTimeout: 30000,
  projectId: 'den1pw',
  env: {
    loginUrl: '/auth/login',
    registerUrl: '/auth/register',
    forgotPasswordUrl: '/auth/forgot-password',
    resetPasswordUrl: '/auth/reset-password',
    changePasswordUrl: '/change-password',
    apiUrl: process.env.VITE_URL_API_BASE,
    apiAuth: '/auth',
    cognitoEndpoint: process.env.VITE_AWS_COGNITO_ENDPOINT,
    cognitoRegion: process.env.VITE_AWS_COGNITO_REGION,
    cognitoPoolId: process.env.VITE_AWS_COGNITO_USER_POOL_ID,
    cognitoClientId: process.env.VITE_AWS_COGNITO_CLIENT_ID,
    cognitoE2Eemail: process.env.VITE_AWS_COGNITO_E2E_EMAIL,
    cognitoE2EPassword: process.env.VITE_AWS_COGNITO_E2E_PASSWORD,
  },
});
