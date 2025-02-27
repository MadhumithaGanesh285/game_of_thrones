/// <reference types="cypress" />
describe('Game of Thrones Families Page', () => {

  before(() => {
    // Visit the page before any test
    cy.visit('http://localhost:5173');  // Adjust the URL as needed
  });

  it('should display the logo', () => {
    
    // Check that the background image exists and is applied correctly
    cy.get('.backgroundImageDiv').should('have.css', 'background-image').and('not.equal', 'none');

    // Check that the "Loading..." message appears while data is being fetched
    // cy.get('Typography').contains('Loading...').should('be.visible');

    // Check if the logo is visible and contains the correct text
    cy.get('.got-text').should('be.visible').and('contain.text', 'Game Of Thrones Families');
    
    cy.get('.searchBox').should('be.visible');
    
    // Ensure at least one character is displayed in the grid
    cy.get('.paginatedMainGrid').should('have.length.greaterThan', 0);

    // Check that each character card has an image and a name
    cy.get('.paginatedMainGrid').each(($gridItem) => {
      cy.wrap($gridItem).find('.imageContainerImg').should('be.visible');  // Check if the image is visible
      cy.wrap($gridItem).find('.paginatedTypoForName').should('be.visible'); // Check if the character's name is visible
    });

    // Check if the "Previous" button is disabled on the first page
    cy.get('button').contains('Previous').should('be.disabled');
    // Check if the "Next" button is enabled and clickable
    cy.get('button').contains('Next').click();
    // cy.url().should('include', 'page=1');  // Adjust this based on your pagination logic
    // Ensure the "Previous" button is enabled after clicking "Next"
    cy.get('button').contains('Previous').should('be.enabled');

    // Ensure the page number and total pages are correctly displayed (adjust if dynamic page numbers are used)
    // cy.get('Typography').contains('1 / 10').should('be.visible');

    // Ensure the pagination works correctly
    cy.get('button').contains('Next').click();
    // cy.url().should('include', 'page=2');
    cy.get('button').contains('Previous').should('be.enabled');
    // Ensure each character card links correctly to their detailed page
    cy.get('.paginatedMainGrid').each(($gridItem) => {
      cy.wrap($gridItem).find('a').should('have.attr', 'href').and('match', /\/Characters\/\d+/);
    });
    
    // Ensure that the scroll to top button is visible
    //  cy.get('.ScrollToTopButton').should('be.visible');

    // Click the first character card
    cy.get('.paginatedMainGrid').first().find('a').click();

    // Verify that it navigates to the character detail page
    cy.url().should('include', '/Characters/');  // Ensure the URL includes character ID (adjust path if needed)
    cy.get('.character-details').should('be.visible');  // Ensure the character details are loaded
    });

  });


