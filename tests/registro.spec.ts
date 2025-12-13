import { test, expect, request } from '@playwright/test';
import { RegisterPage } from '../Pages/registerPage';
import testData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';
import { BackendUtils } from '../utils/backendUtils';
import { DataFactory } from '../utils/dataFactory';


const validUser = testData.users[0];
const uniqueEmailUser = testData.users[1];
const existingEmailUser = testData.users[2];
const newValidUser = DataFactory.createNewUser();
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
  //const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  await registerPage.completeFormAndSubmit(
    newValidUser.firstName,
    newValidUser.lastName,
    newValidUser.email,
    newValidUser.password
  );
  console.log('Registered with email:', newValidUser.email);
  await registerPage.verifySuccessMessage();
});
/* lo comentamos porque puede ser una mala practica que el mismo test ester verifcando dos cosas distintas, puede traer problemas de mantenimiento

test('TC-6 viejo - Verificar mensaje de error al registrar con email ya existente', async ({ page }) => {
 //const dynamicEmail = `${existingEmailUser.email}${Date.now()}${existingEmailUser.emailSuffix}`;
 const existingEmail = DataFactory.createNewUser();
  await registerPage.completeFormAndSubmit(
    existingEmail.firstName,
    existingEmail.lastName,
    existingEmail.email,
    existingEmail.password
  );
  console.log('Attempted registration with existing email:', existingEmail.email);
  await registerPage.verifySuccessMessage();
  
  await registerPage.navigateToRegister();
  await registerPage.completeFormAndSubmit(
    existingEmail.firstName,
    existingEmail.lastName,
    existingEmail.email,
    existingEmail.password
  );
  console.log('Attempted registration with existing email again:', existingEmail.email);
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso!')).not.toBeVisible();
});
*/

test('TC-6 Verificar mensaje de error al registrar con email ya existente', async ({ page, request }) => {
 // creando el usuario existente mediante la API antes de intentar registrarlo via UI
  const existingUser = DataFactory.createNewUser();
  const response = await BackendUtils.registerUserViaApi(request, existingUser, existingUser.email);
  const responseBody = await response.json();
  console.log('API Response Body:', responseBody);
  
  expect(response.status()).toBe(201);
  expect(response.status()).toBe(201); 
 // Intentamos registrar el mismo usuario via UI
  await registerPage.navigateToRegister();
  await registerPage.completeFormAndSubmit(
    existingUser.firstName,
    existingUser.lastName,
    existingUser.email,
    existingUser.password
  );
  // Verificamos el mensaje de error esperado
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

  const responsePromise = page.waitForResponse ('**/api/auth/signup');
  await registerPage.clickRegisterButton();
  const response = await responsePromise;
  const responseBody = await BackendUtils.validateSignupResponse(response, uniqueEmailUser, dynamicEmail);
  console.log('Body response:', responseBody);
  await registerPage.verifySuccessMessage();
});

test('TC-10 Realizar registro de usario desde la API y verificar login con esos datos', async ({ page,request }) => {
  const dynamicEmail = `${uniqueEmailUser.email}${Date.now()}${uniqueEmailUser.emailSuffix}`;
  const response = await BackendUtils.registerUserViaApi(request, uniqueEmailUser, dynamicEmail);
  await BackendUtils.validateSignupResponse(response, uniqueEmailUser, dynamicEmail);
  // Ahora intentamos iniciar sesión con las credenciales del usuario registrado
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.completeFormAndSubmit(dynamicEmail, uniqueEmailUser.password);
  await loginPage.verifySuccessMessage();
});

// Mokear la respuesta de la API para probar el manejo de errores usando route 
test('TC-11 Verificar manejo de error al registrar usuario cuando la API responde con error 500', async ({ page }) => {
  await BackendUtils.mockSignupAsServerError(page);

  await registerPage.completeFormAndSubmit(
    newValidUser.firstName,
    newValidUser.lastName,
    newValidUser.email,
    newValidUser.password
  );

  await expect(page.getByText('Internal Server Error')).toBeVisible();
  await expect(registerPage.registerSuccessMessage).not.toBeVisible();
});
// request para hacer llamadas a la API sin interfaz grafica