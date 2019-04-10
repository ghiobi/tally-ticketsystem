import { createPartiallyEmittedExpression } from 'typescript'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('userLogin', (email, password, slug) => {
  cy.visit('http://localhost:3333/organization/' + slug)
  cy.get('#form__email').type(email)
  cy.get('#form__password').type(password)
  cy.get('button[id=sign-in-btn]').click()
  cy.location('pathname').should('be', 'http://localhost:3333/organization/' + slug)
})

Cypress.Commands.add('adminLogin', (email, password, slug) => {
  cy.visit('http://localhost:3333/organization/' + slug)
  cy.get('#form__email').type(email)
  cy.get('#form__password').type(password)
  cy.get('button[id=sign-in-btn]').click()
  cy.location('pathname').should('be', 'http://localhost:3333/organization/' + slug + '/admin')
})
