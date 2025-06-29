// utils.js
async function setSliderValue(page, sliderIndex, percent) {
  const sliders = page.locator('.vue-slider');
  const slider = sliders.nth(sliderIndex);
  const track = slider.locator('.vue-slider-rail');
  const box = await track.boundingBox();

  if (!box) throw new Error('Slider bounding box not found');

  const x = box.x + box.width * percent;
  const y = box.y + box.height / 2;

  await page.mouse.click(x, y);
}

async function waitForKuumakseChange(page, previousValue) {
  const locator = page.locator('[data-testid="bb-labeled-value__value"]');

  for (let i = 0; i < 10; i++) {
    const current = (await locator.textContent())?.trim();
    if (current && current !== previousValue) {
      return current;
    }
    await page.waitForTimeout(500);
  }

  throw new Error('Kuumakse did not change within expected time');
}

module.exports = {
  setSliderValue,
  waitForKuumakseChange,
};
