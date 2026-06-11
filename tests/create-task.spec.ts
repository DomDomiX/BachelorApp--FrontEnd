import { test, expect } from '@playwright/test';

test.describe("Vytvoření úkolu - Bakalářka", () => {
    test("Uživatel může vytvořit nový úkol", async ({ page }) => {
        // 1. Otevři stránku s aplikací a přihlaš se
        await page.goto('http://localhost:4200/login');
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('vojtido1@uhk.cz');
        await page.getByRole('textbox', { name: 'Heslo' }).click();
        await page.getByRole('textbox', { name: 'Heslo' }).fill('Bakalarka2026');
        await page.getByRole('button', { name: 'Přihlásit' }).click();

        // 2. Otevři seznam projektů a otevři test projekt
        await page.getByRole('link', { name: '📁 Moje projekty' }).click();
        await page.locator(".project-card", { hasText: "test" } ).getByRole("button", { name: "Pokračovat v práci" }).click();

        // 3. Otevři úkoly a vytvoř nový úkol
        await page.getByRole('button', { name: 'Úkoly' }).click();
        const sectionCard = page.locator('.category-card').filter({ hasText: 'test' });
        await expect(sectionCard).toBeVisible();
        await sectionCard.click();
        await page.getByRole('button', { name: '+ Přidat úkol' }).click();
        await page.getByRole('textbox', { name: 'Název úkolu' }).click();
        await page.getByRole('textbox', { name: 'Název úkolu' }).fill('test');
        await page.getByRole('textbox', { name: 'Popis (volitelně)' }).click();
        await page.getByRole('textbox', { name: 'Popis (volitelně)' }).fill('test');
        await page.locator('input[type="date"]').fill('2026-06-12');
        await page.getByRole('combobox').first().selectOption({ label: 'Střední' });
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: '+ Přidat úkol' }).click();

        // 4. Změň stav úkolu na in-progress
        await page.getByLabel('Změň stav úkolu').selectOption('in-progress');

        // 5. Uprav úkol a změň jeho prioritu na high
        await page.getByRole('button', { name: '✎' }).click();
        await page.getByRole('combobox').first().selectOption('high');
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: 'Uložit změny' }).click();

        // 6. Změň stav úkolu na completed
        await page.getByLabel('Změň stav úkolu').selectOption('completed');
    });
});
