Feature: Checkers

  @Checkers @Regression
  Scenario: Checkers Game
    Given The user navigates to "https://www.gamesforthebrain.com/game/checkers/"
    When The site "https://www.gamesforthebrain.com/game/checkers/" is up
    Then Make three legal moves as orange
