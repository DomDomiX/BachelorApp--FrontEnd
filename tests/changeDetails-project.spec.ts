import { test, expect } from '@playwright/test';

test.describe("Změna detailů projektu - Bakalářka", () => {
    test("Uživatel může změnit název projektu", async ({ page }) => {
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

        // 3. Otevři detail projektu a změň jeho název
        await page.getByRole('button', { name: 'Nastavení' }).click();
        await page.getByRole('textbox', { name: 'Název projektu' }).fill('TestujuTest');
        
        // 4. Ulož změny
        await page.getByRole('button', { name: 'Uložit změny' }).click();
    });
});