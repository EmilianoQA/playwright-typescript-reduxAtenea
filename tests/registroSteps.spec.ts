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
  await test.step('Verificar que el campo de nombre sea visible', async () => {
    await expect(registerPage.firstNameInput).toBeVisible();
  });
  await test.step('Verificar que el campo de apellido sea visible', async () => {
    await expect(registerPage.lastNameInput).toBeVisible();
  });
  await test.step('Verificar que el campo de email sea visible', async () => {
    await expect(registerPage.emailInput).toBeVisible();
  });
  await test.step('Verificar que el campo de contraseña sea visible', async () => {
    await expect(registerPage.passwordInput).toBeVisible();
  });
  await test.step('Verificar que el boton de registro sea visible', async () => {
    await expect(registerPage.registerButton).toBeVisible();
  });
});

test('TC-2 Verificar que boton de registro esta deshabilitado inicialmente', async ({ page }) => {
  await test.step('Verificar que el botón de registro esté deshabilitado inicialmente', async () => {
    await expect(registerPage.registerButton).toBeDisabled();
  });
});

test('TC-3 Verificar habilitacion del boton de registro al completar el formulario', async ({ page }) => {
  await test.step('Completar el formulario de registro con datos válidos', async () => {
    await registerPage.completeFormAndSubmit(
      validUser.firstName,
      validUser.lastName,
      validUser.email,
      validUser.password
    );
  });
  await test.step('Verificar que el botón de registro esté habilitado', async () => {
    await expect(registerPage.registerButton).toBeEnabled();
  });
}); 

test('TC-4 Verificar redireccionamiento a login despues del registro', async ({ page }) => {
  await test.step('Hacer clic en el botón de iniciar sesión', async () => {
    await registerPage.loginButton.click();
  });
  await test.step('Verificar que la URL sea la de inicio de sesión', async () => {
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});

test('TC-5 Verificar registro de usuario exitoso con datos validos', async ({ page }) => {
  const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  await test.step('Completar el formulario de registro con un email dinámico y datos válidos', async () => {
    await registerPage.completeFormAndSubmit(
      uniqueEmailUser.firstName,
      uniqueEmailUser.lastName,
      dynamicEmail,
      uniqueEmailUser.password
    );
  });
  await test.step('Verificar mensaje de registro exitoso', async () => {
    await registerPage.verifySuccessMessage();
  });
});

test('TC-6 Verificar mensaje de error al registrar con email ya existente', async ({ page }) => {
  const dynamicEmail = `${existingEmailUser.email}${Date.now()}${existingEmailUser.emailSuffix}`;

  await test.step('Primer intento de registro con un email dinámico', async () => {
    await registerPage.completeFormAndSubmit(
      existingEmailUser.firstName,
      existingEmailUser.lastName,
      dynamicEmail,
      existingEmailUser.password
    );
    await registerPage.verifySuccessMessage();
  });

  await test.step('Navegar nuevamente a la página de registro', async () => {
    await registerPage.navigateToRegister();
  });

  await test.step('Segundo intento de registro con el mismo email', async () => {
    await registerPage.completeFormAndSubmit(
      existingEmailUser.firstName,
      existingEmailUser.lastName,
      dynamicEmail,
      existingEmailUser.password
    );
  });

  await test.step('Verificar mensaje de error de email ya existente', async () => {
    await expect(page.getByText('Email already in use')).toBeVisible();
    await expect(page.getByText('Registro exitoso!')).not.toBeVisible();
  });
});