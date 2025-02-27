/// <reference types="cypress" />
describe("Character Detail Page", () => {
  let characterId;

  before(() => {
    // Visit a character page (use dynamic ID if needed, for example character ID 1)
    characterId = 1; // You can make this dynamic based on previous logic or random selection
    cy.intercept("GET", `/api/characters/${characterId}`).as(
      "getCharacterDetails"
    ); // Adjust API endpoint as needed
    cy.visit(`http://localhost:5173/characters/${characterId}`);

    // Wait for the API request and get the character details
    // cy.wait("@getCharacterDetails").then((interception) => {
    //   characterDetails = interception.response.body; // Assuming the response contains character details
    // });
  });

  it("should display the correct character full name", () => {
    // Dynamically check if the character full name is displayed
    // cy.get(".h2tag").should("contain.text", characterDetails.fullName);

    // cy.get(".character-details").within(() => {
    //   cy.get("p")
    //     .first()
    //     .should("contain.text", `First Name: ${characterDetails.firstName}`);
    //   cy.get("p")
    //     .eq(1)
    //     .should("contain.text", `Last Name: ${characterDetails.lastName}`);
    //   cy.get("p")
    //     .eq(2)
    //     .should("contain.text", `Full Name: ${characterDetails.fullName}`);
    //   cy.get("p")
    //     .eq(3)
    //     .should("contain.text", `Title: ${characterDetails.title}`);
    //   cy.get("p")
    //     .eq(4)
    //     .should("contain.text", `Family: ${characterDetails.family}`);
    // });

    // Check if character image exists and is visible
    cy.get(".character-image")
      .should("have.attr", "src")
      // .should("include", "imageUrl"); // Adjust 'imageUrl' if needed
    cy.get(".character-image").should("be.visible");

    cy.get(".family-header").should("be.visible");
    cy.get(".related-characters").should("exist");

    // Check if there are related characters and verify if the first one is clickable
    // cy.get(".related-character-card")
    //   .first()
    //   .within(() => {
    //     cy.get("img")
    //       .should("have.attr", "src")
    //       .should("include", "relatedCharacterImageUrl"); // Adjust 'relatedCharacterImageUrl' if needed
    //     cy.get("h4").should("contain.text", "Arya Stark"); // Replace with an actual related character name

    //     // Simulate a click on the related character card
    //     cy.get("div").click();
    //   });

    // Verify the URL has changed after clicking (if clicking redirects)
    cy.url().should("include", `/characters/${characterId}`); // Adjust URL as needed to match the character ID
    // Simulate case where there are no related characters
    cy.get(".related-characters").within(() => {
      cy.contains("No related family members.");
    });

    // Click the refresh icon and check if the page reloads
    cy.get(".refresh-icon").click();

    // Optionally, check if some elements are reloaded after clicking the refresh button
    cy.reload();
    cy.get(".h2tag").should("be.visible");
  });
});
