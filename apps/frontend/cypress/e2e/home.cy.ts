describe('Home Page', () => {
  it('should display the main heading', () => {
    cy.visit('/');
    cy.contains('h1', 'Build Modern FullStack Apps');
  });
});
