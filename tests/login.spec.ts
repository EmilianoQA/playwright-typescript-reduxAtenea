import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dahsboardPage'; 
import testData from '../data/testData.json';

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