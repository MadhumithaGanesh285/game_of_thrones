/// <reference types="cypress" />
describe("Character Detail Page", () => {
  let characterId: number;

  before(() => {
    // Visit a character page
    characterId = 1; 
    cy.intercept("GET", `/api/characters/${characterId}`).as(
      "getCharacterDetails"
    ); 
    cy.visit(`http://localhost:5173/characters/${characterId}`);

  });

  it("should display the correct character full name", () => {

    //Check for heading that as Full Name
    cy.get(".h2tag").should("be.visible");

    // Check if character image exists and is visible
    cy.get(".character-image")
      .should("have.attr", "src")
      
    cy.get(".character-image").should("be.visible");

    cy.get(".family-header").should("be.visible");
    cy.get(".related-characters").should("exist");


    // Verify the URL has changed after clicking (if clicking redirects)
    cy.url().should("include", `/characters/${characterId}`); 
    // Simulate case where there are no related characters
    cy.get(".related-characters").within(() => {
      cy.contains("No related family members.");
    });

    // Click the refresh icon and check if the page reloads
    cy.get(".refresh-icon").click();

  });
});
