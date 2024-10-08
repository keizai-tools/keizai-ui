xdescribe('Sidebar', () => {
  beforeEach(() => {
    cy.loginByCognitoApi();
  });

  it('Should show the sidebar', () => {
    cy.getBySel('sidebar-container').should('exist').and('be.visible');
    cy.getBySel('sidebar-img')
      .should('be.visible')
      .and('have.attr', 'src', '/logo.svg')
      .and('have.attr', 'alt', 'Keizai Logo');
    cy.getBySel('sidebar-link')
      .should('be.visible')
      .and('have.attr', 'href', '/');
    cy.getBySel('sidebar-btn-copy').should('exist').and('be.visible');
    cy.getBySel('sidebar-btn-user').should('exist').and('be.visible');
    cy.getBySel('user-dropdown-container').should('not.exist');
    cy.getBySel('theme-dropdown-container').should('not.exist');
  });
  // We are remvoving the theme selector for now
  it.skip('Should show a dropdown menu to change the theme', () => {
    cy.getBySel('theme-dropdown-btn').click();

    cy.getBySel('theme-dropdown-container').should('exist').and('be.visible');
    cy.getBySel('theme-dropdown-light').should('be.visible').contains('Light');
    cy.getBySel('theme-dropdown-dark').should('be.visible').contains('Dark');
    cy.getBySel('theme-dropdown-system')
      .should('be.visible')
      .contains('System');

    cy.getBySel('theme-dropdown-btn').click({ force: true });
    cy.getBySel('theme-dropdown-container').should('not.exist');
  });
  it('Should disconnect from the session', () => {
    cy.getBySel('sidebar-container').should('exist').and('be.visible');
    cy.getBySel('login-form-container').should('not.exist');
    cy.getBySel('sidebar-btn-user').click();
    cy.getBySel('user-dropdown-log-out').click();
    cy.url().should('include', `${Cypress.env('loginUrl')}`);
    cy.getBySel('login-form-container').should('exist').and('be.visible');
    cy.getBySel('sidebar-container').should('not.exist');
  });
});
