Feature: Cards

  @Cards @Regression
  Scenario: The Card Game
    Given The user navigates to "https://deckofcardsapi.com/"
    When The site "https://deckofcardsapi.com/" is up
    Then Get a new deck
    Then Shuffle it
    Then Deal three cards to each of two players
    Then Check whether either has blackjack and if either has, write out which one does
