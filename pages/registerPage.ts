import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {// page es la pagina de playwright y Page es el tipo de dato
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;
  readonly registerSuccessMessage: Locator;

  constructor(page: Page) {//es para inicializar los elementos de la pagina
    this.page = page;// se usa this para referirse a la instancia actual de la clase
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId('boton-registrarse');
    this.loginButton = page.getByTestId('boton-login-header-signup');
    this.registerSuccessMessage = page.getByText('Registro exitoso!');
  }

async navigateToRegister() {
    await this.page.goto('http://localhost:3000/');
    // Esperar a que la red esté inactiva para asegurar que la página se haya cargado completamente
    await this.page.waitForLoadState('networkidle');
}

async verifySuccessMessage() {
    await expect(this.registerSuccessMessage).toBeVisible();
}

async completarFormularioYRegistrar(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
}
async clickRegisterButton() {
    await this.registerButton.click();
}

async completeFormAndSubmit(firstName: string, lastName: string, email: string, password: string) {
    await this.completarFormularioYRegistrar(firstName, lastName, email, password);
    await this.clickRegisterButton();
}
}
