import { test, expect } from '@playwright/test';

test.describe("Vytváření projektu - Bakalářka", () => {
    test("Uživatel může vytvořit nový projekt", async ({ page }) => {
        // 1. Otevři seznam projektů
        await page.goto('http://localhost:4200/projects');

        // 2. Klikni na tlačítko pro vytvoření nového projektu
        await page.getByRole('button', { name: '+ Nový projekt' }).click();

        // 3. Vyplň formulář pro vytvoření projektu
        await page.getByRole('textbox', { name: 'Enter project name' }).click();
        await page.getByRole('textbox', { name: 'Enter project name' }).fill('test');
        await page.getByRole('textbox', { name: 'Enter project description' }).click();
        await page.getByRole('textbox', { name: 'Enter project description' }).fill('test');

        // 4. Vyber technologii a datum dokončení
        const techSection = page.locator('.tech-selection');
        await techSection.getByText("Java", { exact: true }).click();

        // 5. Klikni na tlačítko pro vytvoření projektu
        await page.locator('input[name="projectDeadline"]').fill('2026-06-11');

        // 6. Klikni na tlačítko pro vytvoření projektu
        await page.getByRole('button', { name: 'Vytvořit projekt' }).click();
    });
});