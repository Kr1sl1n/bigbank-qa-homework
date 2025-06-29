// calculator-api.spec.js

const { test, expect } = require('@playwright/test');

// This test suite checks the /calculate API endpoint for the loan calculator
const baseURL = 'https://taotlus.bigbank.ee/bb/calculator/api/v1/calculate'; // API endpoint for loan calculation

const testCases = [
  {
    description: 'Typical values',
    data: {
      amount: 5000,
      period: 60,
      productName: 'SMALL_LOAN',
      loanPurpose: 'DAILY_SETTLEMENTS',
    },
  },
  {
    description: 'Minimum values',
    data: {
      amount: 500,
      period: 6,
      productName: 'SMALL_LOAN',
      loanPurpose: 'DAILY_SETTLEMENTS',
    },
  },
  {
    description: 'Maximum values',
    data: {
      amount: 30000,
      period: 120,
      productName: 'SMALL_LOAN',
      loanPurpose: 'DAILY_SETTLEMENTS',
    },
  },
];

for (const testCase of testCases) {
  test(`API should return valid response for ${testCase.description}`, async ({ request }) => {
    const response = await request.post(baseURL, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: testCase.data,
    });

    const status = response.status();
    const contentType = response.headers()['content-type'];
    const body = await response.text();

    console.log(`➡️ Status for ${testCase.description}: ${status}`);
    console.log(`➡️ Content-Type: ${contentType}`);
    console.log(`➡️ Response Body: ${body}`);

    expect(response.ok()).toBeTruthy(); 
  });
}


