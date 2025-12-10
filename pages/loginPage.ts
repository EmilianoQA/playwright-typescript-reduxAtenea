import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginSuccessMessage: Locator;
  readonly ateneaLogo: Locator;
  readonly lginTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByTestId('boton-login');
    this.loginSuccessMessage = page.getByText('Inicio de sesión exitoso');
    this.ateneaLogo = page.getByTestId('logo-header-login');
    this.lginTitle = page.getByTestId('titulo-login');
  }

async navigateToLogin() {
    await this.page.goto('http://localhost:3000/login');
    await this.page.waitForLoadState('networkidle');
    
}
async verifcarElementosLogin() {
    await expect(this.ateneaLogo).toBeVisible();
    await expect(this.lginTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
}

async verifySuccessMessage() {
    await expect(this.loginSuccessMessage).toBeVisible();
}

async llenarFormularioLogin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
}

async clickLoginButton() {
    await this.loginButton.click();
}

async completeFormAndSubmit(email: string, password: string) {
    await this.llenarFormularioLogin(email, password);
    await this.clickLoginButton();
}
}
