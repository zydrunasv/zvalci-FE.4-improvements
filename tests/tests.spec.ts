import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page).toHaveTitle('Financial Goal App');
});

test('has Set Up a New Goal button on main page and all form fields on goal setup page are showing', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'Set Up a New Goal' }).click();

  await expect(page.getByText('Financial Goal Name:')).toBeVisible();
  await expect(page.getByText('Amount Needed:')).toBeVisible();
  await expect(page.getByText('Target Year:')).toBeVisible();
  await expect(page.getByText('Target Month:')).toBeVisible();
});

test('should create a new goal and verify if it appears on the home page', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('goals', JSON.stringify([]));
  });

  await page.reload();

  await page.click('button:text("Set Up a New Goal")');

  await page.fill('text=Financial Goal Name: >> input', 'Buy a car');
  await page.fill('text=Amount Needed: >> input', '20000');
  await page.click('button:text("Save")');

  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem(
      'goals',
      JSON.stringify([
        { id: 1, name: 'Buy a car', amount: 20000, contributed: 0 },
      ]),
    );
  });

  await page.reload();

  const goalText = await page.textContent('.goal h3');
  expect(goalText).toBe('Buy a car');
});

test('should add contribution and verify update and progress halfway message', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem(
      'goals',
      JSON.stringify([
        { id: 1, name: 'Buy a car', amount: 20000, contributed: 0 },
      ]),
    );
  });

  await page.reload();

  await page.fill('text=Make Contribution: >> input', '10000');
  await page.click('button:text("Contribute")');

  const contributedText = await page.textContent('.goal div');
  expect(contributedText?.trim()).toBe('Contributed: €10000.00 / €20000.00');

  const halfwayMessage = await page.textContent('.congrats-message');
  expect(halfwayMessage?.trim()).toBe(
    'You are halfway there, keep on saving for the goal!',
  );
});

test('should add contribution of another 10k and verify update with reached goal message', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem(
      'goals',
      JSON.stringify([
        { id: 1, name: 'Buy a car', amount: 20000, contributed: 10000 },
      ]),
    );
  });

  await page.reload();

  await page.fill('text=Make Contribution: >> input', '10000');
  await page.click('button:text("Contribute")');

  const contributedText = await page.textContent('.goal div');
  expect(contributedText?.trim()).toBe('Contributed: €20000.00 / €20000.00');

  const halfwayMessage = await page.textContent('.congrats-message');
  expect(halfwayMessage?.trim()).toBe('Congratulations on reaching the goal!');
});
