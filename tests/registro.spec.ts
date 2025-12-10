import { test, expect } from '@playwright/test';
import { RegisterPage } from '../Pages/registerPage';
import testData from '../data/testData.json';

const validUser = testData.users[0];
const uniqueEmailUser = testData.users[1];
const existingEmailUser = testData.users[2];
let registerPage: RegisterPage;


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

test('TC-5 Verificar registro de usuario exitoso con datos validos', async ({ page }) => {
  const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  await registerPage.completeFormAndSubmit(
    uniqueEmailUser.firstName,
    uniqueEmailUser.lastName,
    dynamicEmail,
    uniqueEmailUser.password
  );
  await registerPage.verifySuccessMessage();
});


test('TC-6 Verificar mensaje de error al registrar con email ya existente', async ({ page }) => {
  const dynamicEmail = `${existingEmailUser.email}${Date.now()}${existingEmailUser.emailSuffix}`;
  
  // Primer intento
  await registerPage.completeFormAndSubmit(
    existingEmailUser.firstName,
    existingEmailUser.lastName,
    dynamicEmail,
    existingEmailUser.password
  );
  await registerPage.verifySuccessMessage();
  
  // Segundo intento con el mismo email y usuario
  await registerPage.navigateToRegister();
  await registerPage.completeFormAndSubmit(
    existingEmailUser.firstName,
    existingEmailUser.lastName,
    dynamicEmail,
    existingEmailUser.password
  );
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso!')).not.toBeVisible();
});