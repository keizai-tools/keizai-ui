declare namespace Cypress {
	interface Chainable {
		getBySel(
			selector: string,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			args?: any,
		): Chainable<JQuery<HTMLElement>>;
		getBySelLike(
			selector: string,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			args?: any,
		): Chainable<JQuery<HTMLElement>>;
	}
}
