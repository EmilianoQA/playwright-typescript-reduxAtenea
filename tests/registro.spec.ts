import { test, expect, request } from '@playwright/test';
import { RegisterPage } from '../Pages/registerPage';
import testData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';


const validUser = testData.users[0];
const uniqueEmailUser = testData.users[1];
const existingEmailUser = testData.users[2];
let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.navigateToRegister();
});

test('TC-1 Verificar elementos en la pagina de registro', async ({ page }) => {
  await registerPage.verifyRegisterElements();
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
  await registerPage.completeFormAndSubmit(
    existingEmailUser.firstName,
    existingEmailUser.lastName,
    dynamicEmail,
    existingEmailUser.password
  );
  await registerPage.verifySuccessMessage();
  
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

test('TC-9 Verificar registro de usuario exitoso con datos validos a través de la respuesta la API', async ({ page }) => {
  const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  await registerPage.completarFormularioRegistrar(
    uniqueEmailUser.firstName,
    uniqueEmailUser.lastName,
    dynamicEmail,
    uniqueEmailUser.password
  );

  const responsePromise = page.waitForResponse ('http://localhost:6007/api/auth/signup');
  await registerPage.clickRegisterButton();
  const response = await responsePromise;
  const responseBody = await response.json()
  expect (response.status()).toBe(201);
  expect (responseBody).toHaveProperty('token');
  expect (typeof responseBody.token).toBe('string');
  expect (responseBody).toHaveProperty('user');
  expect (responseBody.user).toEqual(expect.objectContaining({
    firstName: uniqueEmailUser.firstName,
    lastName: uniqueEmailUser.lastName,
    email: dynamicEmail
  }));
  console.log(responseBody)
  await registerPage.verifySuccessMessage();
});

test('TC-10 Realizar registro de usario desde la API y verificar login con esos datos', async ({ page,request }) => {
  const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    data: {
      firstName: uniqueEmailUser.firstName,
      lastName: uniqueEmailUser.lastName,
      email: dynamicEmail,
      password: uniqueEmailUser.password
    }
  });
  const responseBody = await response.json()
  expect (response.status()).toBe(201);
  expect (responseBody).toHaveProperty('token');
  expect (typeof responseBody.token).toBe('string');
  expect (responseBody).toHaveProperty('user');
  expect (responseBody.user).toEqual(expect.objectContaining({
    firstName: uniqueEmailUser.firstName,
    lastName: uniqueEmailUser.lastName,
    email: dynamicEmail
  }));  
  console.log(responseBody)
 // Ahora verificamos el login con esos datos y usarmos LoginPage
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.completeFormAndSubmit(dynamicEmail, uniqueEmailUser.password);
  await loginPage.verifySuccessMessage();
});

// Mokear la respuesta de la API para probar el manejo de errores usando route 
test('TC-11 Verificar manejo de error al registrar usuario cuando la API responde con error 500', async ({ page }) => {
  await registerPage.page.route('**/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  await registerPage.completeFormAndSubmit(
    uniqueEmailUser.firstName,
    uniqueEmailUser.lastName,
    dynamicEmail,
    uniqueEmailUser.password
  );

  await expect(page.getByText('Internal Server Error')).toBeVisible();
  await expect(registerPage.registerSuccessMessage).not.toBeVisible();
}); 
