import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dahsboardPage'; 
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
  await loginPage.verifySuccessMessage();
  await dashboardPage.navigateToDashboard();
  await dashboardPage.verifyDashboardElements();
});

test ('TC-12 Iniciar sesion con usuario creado a traves de la API', async ({ page, request }) => {
  // 1. Crear un nuevo usuario mediante la API
  const newUser = DataFactory.createNewUser();
  const response = await BackendUtils.registerUserViaApi(request, newUser, newUser.email);
  await BackendUtils.validateSignupResponse(response, newUser, newUser.email);
  console.log('User created via API with email:', newUser.email);

  // 2. Usar las credenciales de este usuario para iniciar sesión a través de la UI
  await loginPage.llenarFormularioLogin(newUser.email, newUser.password);
  await loginPage.clickLoginButton();

  // 3. Verificar que el inicio de sesión fue exitoso
  await loginPage.verifySuccessMessage();
  await dashboardPage.navigateToDashboard();
  await dashboardPage.verifyDashboardElements();
}); 