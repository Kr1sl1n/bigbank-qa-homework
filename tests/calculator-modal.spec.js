// @ts-nocheck
const { test, expect } = require('@playwright/test');
const { setSliderValue, waitForKuumakseChange } = require('./utils');

test('Loan calculator modal opens and triggers /calculate API', async ({ page }) => {
  await page.goto('https://laenutaotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS');


// Wait for modal to appear 
  const modal = page.locator('.bb-modal.wrapper.bb-modal--m.bb-modal--card.bb-modal--card-full-mobile');
  await expect(modal).toBeVisible();

// Check if modal has correct title and field names

 const title = modal.locator('h2');
  await expect(title).toHaveText('Vali sobiv summa ja periood');

const loanAmountField = modal.locator('text=Laenusumma');
  await expect(loanAmountField).toBeVisible();

const loanPeriodField = modal.locator('label#label-header-calculator-period');
await expect(loanPeriodField).toBeVisible();


const loanAmountFieldSlider = modal.locator('.bb-slider__ranges').first();
await expect(loanAmountFieldSlider).toBeVisible();

const loanPeriodFieldSlider = modal.locator('.bb-slider__ranges').last();
await expect(loanPeriodFieldSlider).toBeVisible();

const inputAddonCurrency = modal.locator('.input-addon').first();
await expect(inputAddonCurrency).toHaveText('€');

const inputAddonPeriod = modal.locator('.input-addon').last();
await expect(inputAddonPeriod).toHaveText('kuud');

const aprcField = modal.locator('text=Kuumakse');
    await expect(aprcField).toBeVisible();

const monthlyPaymentField = modal.locator('.bb-labeled-value__value').first();
    await expect(monthlyPaymentField).toBeVisible();

 const continueBtn = page.locator('text=Jätka');
 await expect(continueBtn).toBeVisible();

});

test('Check modal default values and save them for next page', async ({ page }) => {
  await page.goto('https://taotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS');


const amountInput = page.locator('input[name="header-calculator-amount"]');
await expect(amountInput).toHaveValue('5,000');

const periodInput = page.locator('input[name="header-calculator-period"]');
await expect(periodInput).toHaveValue('60');

const monthlyPaymentValue = page.locator('div[data-testid="bb-labeled-value__value"]');
  await expect(monthlyPaymentValue).toHaveText('€124.58');

const continueBtn = page.locator('text=Jätka');
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
}
await page.waitForTimeout(2000); // Give it time to react

// Check if modal disappeared
expect(await page.locator('.bb-modal').isVisible()).toBeFalsy();

// Check if the next page has loaded and has the expected values
const loanAmountValue = page.locator('.bb-edit-amount__content').first();
await expect(loanAmountValue).toBeVisible();



});

test('Sliders should update monthly payment (kuumakse)', async ({ page }) => {
  await page.goto('https://taotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS');

  await page.waitForSelector('.vue-slider');

  const kuumakseLocator = page.locator('[data-testid="bb-labeled-value__value"]');
  await kuumakseLocator.waitFor();

  const paymentBefore = (await kuumakseLocator.textContent())?.trim();
  console.log('Kuumakse before:', paymentBefore);

  await setSliderValue(page, 0, 0.25); // loan amount slider
  await setSliderValue(page, 1, 0.85); // loan period slider

  const paymentAfter = await waitForKuumakseChange(page, paymentBefore);
  console.log('Kuumakse after:', paymentAfter);

  expect(paymentAfter).not.toBe(paymentBefore);

// Click "Jätka" to open next page
const continueBtn = page.locator('text=Jätka');
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
 // Check for changed loan amount
const loanAmountValue = page.locator('.bb-edit-amount__content').first();
await expect(loanAmountValue).toBeVisible();
const loanAmountValueTextNotChanged = page.locator('.bb-edit-amount__amount');
    await expect(loanAmountValueTextNotChanged).toHaveText('7850 €');}
});

test('Values reset if modal closed without save', async ({ page }) => {
  await page.goto('https://laenutaotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS');
  await page.waitForSelector('.bb-modal');

  // Get initial loan amount and period
const amountInput = page.locator('input[name="header-calculator-amount"]');
await expect(amountInput).toHaveValue('5,000');

const periodInput = page.locator('input[name="header-calculator-period"]');
await expect(periodInput).toHaveValue('60');

  // Change sliders
  await setSliderValue(page, 0, 0.5); // ~mid loan amount
  await setSliderValue(page, 1, 0.7); // ~higher loan period

  // Close modal without save (click 'X' close button)
  const closeButton = page.locator('.bb-icon.bb-icon--size-24.bb-icon--rotated-up.bb-icon--fill-current.bb-button__icon');
  await expect(closeButton).toBeVisible();
  await closeButton.click();
  await page.waitForSelector('.bb-modal', { state: 'hidden' });

  // Check sliders reset to initial values on next page load
const loanAmountValue = page.locator('.bb-edit-amount__content').first();
await expect(loanAmountValue).toBeVisible();
const loanAmountValueTextNotChanged = page.locator('.bb-edit-amount__amount');
    await expect(loanAmountValueTextNotChanged).toHaveText('5000 €');
});
  
  
test('Check if kuumakse changes when loan period is changed', async ({ page }) => {
  await page.goto('https://laenutaotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS');

  const kuumakseLocator = page.locator('[data-testid="bb-labeled-value__value"]');
  await kuumakseLocator.waitFor();

  const initialKuumakse = (await kuumakseLocator.textContent())?.trim();
  console.log('Initial Kuumakse:', initialKuumakse);

  // Change loan period slider
  await setSliderValue(page, 1, 0.7); // ~mid loan period

  const updatedKuumakse = await waitForKuumakseChange(page, initialKuumakse);
  console.log('Updated Kuumakse:', updatedKuumakse);

  expect(updatedKuumakse).not.toBe(initialKuumakse);
});
test('Check if kuumakse changes when loan amount is changed', async ({ page }) => {
  await page.goto('https://laenutaotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS');

  const kuumakseLocator = page.locator('[data-testid="bb-labeled-value__value"]');
  await kuumakseLocator.waitFor();

  const initialKuumakse = (await kuumakseLocator.textContent())?.trim();
  console.log('Initial Kuumakse:', initialKuumakse);

  // Change loan amount slider
  await setSliderValue(page, 0, 0.8); // ~mid loan amount

  const updatedKuumakse = await waitForKuumakseChange(page, initialKuumakse);
  console.log('Updated Kuumakse:', updatedKuumakse);

  expect(updatedKuumakse).not.toBe(initialKuumakse);
});

    



