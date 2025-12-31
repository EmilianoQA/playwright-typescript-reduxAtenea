import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly logoutButton: Locator;
  readonly botonAgregarCuenta: Locator;
  readonly botonEnviarDinero: Locator;
  readonly elementosListaTransferencias: Locator;
  readonly montosListaTransferencias: Locator;
  
  
  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByTestId('titulo-dashboard');
    this.logoutButton = page.getByTestId('boton-logout');
    this.botonAgregarCuenta = page.getByTestId('tarjeta-agregar-cuenta');
    this.botonEnviarDinero = page.getByTestId('boton-enviar');
    this.elementosListaTransferencias = page.getByTestId('descripcion-transaccion');
    this.montosListaTransferencias = page.getByTestId('monto-transaccion');
    
    
  }

async navigateToDashboard() {
    await this.page.goto('http://localhost:3000/dashboard');
    await this.page.waitForLoadState('networkidle');
}

async verifyDashboardElements() {
    await expect(this.dashboardTitle).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
}

async clickBotonEnviarDinero() {
    await this.botonEnviarDinero.click();

}
async verificarUltimaTransferencia () {
    await expect (this.elementosListaTransferencias.first()).toBeVisible();
}
}

