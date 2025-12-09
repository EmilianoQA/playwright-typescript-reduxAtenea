import { test, expect } from '@playwright/test';

test('TC-1 Verificar elementos en la pagina de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('input[name="firstName"]')).toBeVisible();
  await expect(page.locator('input[name="lastName"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
});

test('TC-2 Verificar que boton de registro esta deshabilitado inicialmente', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
});

test('TC-3 Verificar habilitacion del boton de registro al completar el formulario', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Perez');
  await page.locator('input[name="email"]').fill('juanperez@mail.com');
  await page.locator('input[name="password"]').fill('Password123!');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
}); 
test('TC-4 Verificar redireccionamiento a login despues del registro', async ({ page }) => {
await page.goto('http://localhost:3000/');
await page.getByTestId('boton-login-header-signup').click();
await expect(page).toHaveURL('http://localhost:3000/login');
await page.waitForTimeout(5000);
});

test('TC-5 Verificar registro de usuario exitoso con datos validos ', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Maria');
  await page.locator('input[name="lastName"]').fill('Gomez');
  const uniqueEmail = `mariagomez${Date.now()}@mail.com`;
  // await page.locator('input[name="email"]').fill('juan+date.now()+@mail.com'); otra forma de hacerlo
  await page.locator('input[name="email"]').fill(uniqueEmail);
  await page.locator('input[name="password"]').fill('SecurePass123!');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso!')).toBeVisible();
});

test('TC-6 Verificar mensaje de error al registrar con email ya existente', async ({ page }) => {
  const existingEmail = `juan${Date.now().toString()}@mail.com`; // Asegurarse de que este email ya exista en el sistema
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Carlos');
  await page.locator('input[name="lastName"]').fill('Lopez');
  await page.locator('input[name="email"]').fill(existingEmail);
  await page.locator('input[name="password"]').fill('AnotherPass123!');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso!')).toBeVisible();
  
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Carlos');
  await page.locator('input[name="lastName"]').fill('Lopez');
  await page.locator('input[name="email"]').fill(existingEmail);
  await page.locator('input[name="password"]').fill('AnotherPass123!');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso!')).not.toBeVisible();

});