import { test, expect } from '@playwright/test';

test.describe("Správa projektů - Bakalářka", () => {
    test("Uživatel se může úspěšně přihlásit", async ({ page }) => {
        // 1. Otevři stránku s aplikací
        await page.goto("http://localhost:4200/login");

        // 2. Najdi input pro email a heslo a zadej přihlašovací údaje
        await page.getByPlaceholder("Zadejte svůj email").fill("vojtido1@uhk.cz");
        await page.getByPlaceholder("Zadejte své heslo").fill("Bakalarka2026");

        // 3. Klikni na tlačítko pro přihlášení
        await page.getByRole("button", { name: "Přihlásit" }).click();

        // 4. Ověření úspěšného přihlášení - očekáváme, že se zobrazí dashboard nebo seznam projektů
        await expect(page).toHaveURL("http://localhost:4200/dashboard");

        // Na stránce jde vidět text
        const welcomeText = page.locator("h1");
        await expect(welcomeText).toContainText("Dashboard");
    });
});