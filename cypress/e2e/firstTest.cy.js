describe("cypress demo", () => {
  it("renders a title with the correct text", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="cypress-title"]')
      .should("exist")
      .should("have.text", "Vite + React");
  });

  it("renders the todos on the screen", () => {
    cy.visit("http://localhost:3000");

    cy.get('[data-testid="cypress-todo-1"').should("exist");
    cy.get('[data-testid="cypress-todo-2"').should("exist");
    cy.get('[data-testid="cypress-todo-3"').should("exist");
    cy.get('[data-testid="cypress-todo-4"').should("exist");
  });
});
