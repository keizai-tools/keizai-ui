// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import '@cypress/code-coverage/support';
import 'cypress-real-events';

import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err) => {
	if (err.message.includes('ee.create is not a function')) {
		return false;
	}
	if (err.message.includes('ResizeObserver loop limit exceeded')) {
		return false;
	}
	if (
		err.message.includes(
			"Failed to execute 'importScripts' on 'WorkerGlobalScope'",
		)
	) {
		return false;
	}
});
