import { test, expect } from '@playwright/test';
import { RegisterPage } from '../Pages/registerPage';
import testData from '../data/testData.json';

const uniqueEmail = `mariagomez${Date.now()}@mail.com`;
const existingEmail = `juan${Date.now().toString()}@mail.com`; 
let registerPage: RegisterPage;
const validUser = testData.users[0];

test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.navigateToRegister();
});

test('TC-1 Verificar elementos en la pagina de registro', async ({ page }) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
});

test('TC-2 Verificar que boton de registro esta deshabilitado inicialmente', async ({ page }) => {
  await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-3 Verificar habilitacion del boton de registro al completar el formulario', async ({ page }) => {
 await registerPage.completeFormAndSubmit(
    validUser.firstName,
    validUser.lastName,
    validUser.email,
    validUser.password
  );
   await expect(registerPage.registerButton).toBeEnabled();
}); 

test('TC-4 Verificar redireccionamiento a login despues del registro', async ({ page }) => {
  await registerPage.loginButton.click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-5 Verificar registro de usuario exitoso con datos validos ', async ({ page }) => {
  await registerPage.completeFormAndSubmit('Maria', 'Gomez', uniqueEmail, 'SecurePass123!');
  await registerPage.verifySuccessMessage();
});

test('TC-6 Verificar mensaje de error al registrar con email ya existente', async ({ page }) => {
  await registerPage.completeFormAndSubmit('Juan', 'Perez', existingEmail, 'Password123!');
  await registerPage.verifySuccessMessage();
  await registerPage.navigateToRegister();
  await registerPage.completeFormAndSubmit('Carlos', 'Lopez', existingEmail, 'AnotherPass123!');
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso!')).not.toBeVisible();
});