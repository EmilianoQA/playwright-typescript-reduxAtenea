// archivo: tests/login.spec.ts
import { test, expect, Response } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage'; 
import testData from '../data/testData.json';
import { DataFactory } from '../utils/dataFactory';
import { BackendUtils } from '../utils/backendUtils';


const validUser = testData.users[0];
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.navigateToLogin();
});

test ('TC-7 Verificar elementos en la pagina de login', async ({ page }) => {
  await loginPage.verifcarElementosLogin();
});

test('TC-8 Verificar login exitoso con usuario válido', async ({ page }) => {
  await loginPage.llenarFormularioLogin(validUser.email, validUser.password);
  await loginPage.clickLoginButton();
  // verficar respuesta de login
  const responsePromise = page.waitForResponse('**/api/auth/login');
  const response = await responsePromise;
  const responseBody = await BackendUtils.validateLoginResponse(response);
  console.log('Login response body:', responseBody);
  // Verifcar que se muestra el mensaje de exito y redireccion a dashboard
  await loginPage.verifySuccessMessage();
  await dashboardPage.navigateToDashboard();
  await dashboardPage.verifyDashboardElements();
});

test('TC-10 Login E2E exitoso con usuario creado por backend', async ({ page,request }) => {
  const newUser = DataFactory.createNewUser();
  const response = await BackendUtils.registerUserViaApi(request, newUser, newUser.email);
  await BackendUtils.validateStatusCode (response, 201);
  console.log ('User created via API with email:', newUser.email);
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  const responseLoginPromise = page.waitForResponse('**/api/auth/login');
  await loginPage.completeFormAndSubmit(newUser.email, newUser.password);
  const responseLogin = await responseLoginPromise;
  const loginBody = await BackendUtils.validateStatusCode(responseLogin, 200);
  console.log('Login response body:', loginBody); 
  await loginPage.verifySuccessMessage();
  await dashboardPage.navigateToDashboard();
  await dashboardPage.verifyDashboardElements();
});

