# Bigbank Loan Calculator Test Automation

## Overview

This project contains automated UI and API tests for the Bigbank Estonia loan origination calculator modal.

## Project Structure

/tests

calculator-modal.spec.js # UI tests for modal sliders and behavior

calculator-api.spec.js # API tests for calculate endpoint
/utils

sliderUtils.js # helper functions for slider manipulation
/playwright.config.js # Playwright configuration
package.json # npm dependencies and scripts



## Prerequisites

- Node.js (v16 or higher recommended)

## Installation

Clone the repository and install dependencies:

```bash
npm install
npx playwright test
npx playwright show-report
npx playwright test --ui

