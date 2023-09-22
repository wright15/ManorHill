const assert = require('assert');
const { expect } = require('@playwright/test');
const { Before, After, Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const axios = require('axios');

setDefaultTimeout(60000);

let browser;
let context;
let page;

Before(async () => {
    // Launch the Chromium browser
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
});

After(async () => {
    // Close the browser and its associated context
    await context.close();
    await browser.close();
  });

/*
Helper 
function 
step 
defintions
*/

Given('The user navigates to {string}', async (url) => {
    await page.goto(url);
    await page.waitForTimeout(5000);
  });

When('The site {string} is up', async function (url) {
  const response = await page.goto(url);
  const statusCode = response.status()
  console.log(`Status code: ${statusCode}`);
  assert.strictEqual(statusCode, 200, `Expected status code 200, but got ${statusCode}`);
});

/*
Checkers 
feature 
step 
defintions
*/

  Then('Make three legal moves as orange', async function () {
    await page.locator('div:nth-child(6) > img:nth-child(8)').click();
    await page.locator('div:nth-child(5) > img:nth-child(7)').click();
    const element = await page.waitForSelector('text=Make a move.');
    await page.waitForTimeout(2000);
    assert.ok(element !== null, 'Selector not found on page.');
    await page.locator('div:nth-child(7) > img:nth-child(7)').click();
    await page.locator('div:nth-child(6) > img:nth-child(8)').click();
    await page.waitForTimeout(2000);
    assert.ok(element !== null, 'Selector not found on page.');
    await page.locator('div:nth-child(8) > img:nth-child(8)').click();
    await page.locator('div:nth-child(7) > img:nth-child(7)').click();
    await page.getByRole('link', { name: 'Restart...' }).click();
    const elementOrange = await page.waitForSelector('text=Select an orange piece to move.')
    assert.ok(elementOrange !== null, 'Selector not found on page.');
  });


 /*
Cards 
feature 
step 
defintions
*/
let deckId = "";
let firstThreeCardCodes = [];
let lastThreeCardCodes = [];

  Then('Get a new deck', async function () {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://deckofcardsapi.com/api/deck/new/',
      headers: {}
  };

  await axios.request(config)
      .then((response) => {
          deckId = response.data.deck_id; // Access deck_id directly
      })
      .catch((error) => {
          console.log(error);
      });
  });

  Then('Shuffle it', async function () {
    let shuffle = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`,
      headers: {}
  };

  await axios.request(shuffle)
      .then((response) => {
          JSON.stringify(response.data);
      })
      .catch((error) => {
          console.log(error);
      });
  });

  Then('Deal three cards to each of two players', async function () {
    let cards = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`,
      headers: {}
  };

  // let firstThreeCardCodes = [];
  // let lastThreeCardCodes = [];
  await axios.request(cards)
      .then((response) => {
          JSON.stringify(response.data);
          firstThreeCardCodes = response.data.cards.slice(0, 3).map(card => card.code);
          lastThreeCardCodes = response.data.cards.slice(-3).map(card => card.code);
      })
      .catch((error) => {
          console.log(error);
      });

  const formattedfirstThreeCardCodes = firstThreeCardCodes.join(',');
  const formattedlastThreeCardCodes = lastThreeCardCodes.join(',');

  let dealP1 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/one/add/?cards=${formattedfirstThreeCardCodes}`,
      headers: {}
  };

  await axios.request(dealP1)
      .then((response) => {
          JSON.stringify(response.data);
      })
      .catch((error) => {
          console.log(error);
      });

  let dealP2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/two/add/?cards=${formattedlastThreeCardCodes}`,
      headers: {}
  };

  await axios.request(dealP2)
      .then((response) => {
          JSON.stringify(response.data);
      })
      .catch((error) => {
          console.log(error);
      });

  let listDeckOne = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/one/list/`,
      headers: {}
  };

  await axios.request(listDeckOne)
      .then((response) => {
          JSON.stringify(response.data);
      })
      .catch((error) => {
          console.log(error);
      });

  let listDeckTwo = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/two/list/`,
      headers: {}
  };

  await axios.request(listDeckTwo)
      .then((response) => {
          JSON.stringify(response.data);
      })
      .catch((error) => {
          console.log(error);
      });
  });

  Then('Check whether either has blackjack and if either has, write out which one does', async function () {
    // Function to check if a card is a 10-point card (10, Jack, Queen, King)
    function isTenPointCard(cardValue) {
      return ["10", "J", "Q", "K"].includes(cardValue);
  }

    // Function to check if a card is an Ace
    function isAce(cardValue) {
        return cardValue === "A";
    }

    // Function to check if a hand has a winning blackjack combination
    function hasWinningBlackjackCombination(hand) {
        const hasAce = hand.some(card => isAce(card.slice(0, -1)));
        const hasTenPointCard = hand.some(card => isTenPointCard(card.slice(0, -1)));

        return (hasAce && hasTenPointCard) || (hasAce && hand.some(card => ["J", "Q", "K", "10"].includes(card.slice(0, -1))));
    }

    // Check if either list has a winning blackjack combination
    if (hasWinningBlackjackCombination(firstThreeCardCodes) && hasWinningBlackjackCombination(lastThreeCardCodes)) {
        console.log("Both players have a winning blackjack hand!");
    }
    else if (hasWinningBlackjackCombination(firstThreeCardCodes)) {
        console.log(`Congratulations player 1! You have a winning blackjack hand! With a hand of ${firstThreeCardCodes}`);
    } else if (hasWinningBlackjackCombination(lastThreeCardCodes)) {
        console.log(`Congratulations player 2! You have a winning blackjack hand! With a hand of ${lastThreeCardCodes}`);
    } else {
        console.log(`Sorry, no one won blackjack. Neither player 1 with the hand of ${firstThreeCardCodes} or player 2 with the hand of ${lastThreeCardCodes} won blackjack`);
    }
  });
