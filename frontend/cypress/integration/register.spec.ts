/// <reference types="Cypress" />

context('Register', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should be able to enter email to register', () => {
    const email = 'user1@paymate.me';
    cy.get('input').type(email);
    cy.get('form').submit();
    cy.get('p').contains('A login email has been sent to');

    // then user should be able to retry sending email
    cy.get('button')
      .contains('Not received an email? Retry')
      .click();
    cy.get('input[type="email"]').should('have.value', email);
    cy.get('form').submit();
    cy.get('p').contains('A login email has been sent to');
  });
});
