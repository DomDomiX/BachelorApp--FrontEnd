import { test, expect } from '@playwright/test';

test.describe("Příprava projektu - Bakalářka", () => {
    test("Uživatel připraví projekt", async ({ page }) => {
        // 1. Otevři stránku s aplikací a přihlaš se
        await page.goto('http://localhost:4200/login');
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('vojtido1@uhk.cz');
        await page.getByRole('textbox', { name: 'Email' }).press('Tab');
        await page.getByRole('textbox', { name: 'Heslo' }).fill('Bakalarka2026');
        await page.getByRole('button', { name: 'Přihlásit' }).click();

        // 2. Otevři seznam projektů a otevři test projekt
        await page.getByRole('link', { name: '📁 Moje projekty' }).click();
        await page.getByRole('button', { name: 'Pokračovat v práci' }).nth(2).click();

        // 3. Přidej sekci a milník v roadmapě
        await page.getByRole('button', { name: '+ Přidat Sekci' }).click();
        await page.getByRole('textbox', { name: 'Název sekce (např. Frontend,' }).click();
        await page.getByRole('textbox', { name: 'Název sekce (např. Frontend,' }).fill('test');
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: 'Vytvořit' }).click();
        await page.getByText('💻test0 milníků🗑️▶').click();
        await page.getByRole('button', { name: '+ Milník' }).click();
        await page.getByRole('textbox', { name: 'Název milníku (např. MVP,' }).click();
        await page.getByRole('textbox', { name: 'Název milníku (např. MVP,' }).fill('test');
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: 'Přidat', exact: true }).click();
        await page.getByRole('button', { name: 'Dokončit nastavení' }).click();
    });
});