import { Page, Locator, expect } from '@playwright/test';

export class ModalCrearCuenta {
  readonly page: Page;
  readonly agregarCuentaModal: Locator;
  readonly montoImput: Locator;
  readonly botonCancelar: Locator;
  readonly botonCrearCuenta: Locator;
  readonly botonEnviarDinero: Locator;
  
  
  constructor(page: Page) {
    this.page = page;
    this.agregarCuentaModal = page.getByRole('combobox', { name: 'Tipo de cuenta *' })
    this.montoImput = page.getByRole('spinbutton', { name: 'Monto inicial *' });
    this.botonCancelar = page.getByTestId('boton-cancelar-crear-cuenta');
    this.botonCrearCuenta = page.getByTestId('boton-crear-cuenta');
    this.botonEnviarDinero = page.getByTestId('boton-enviar')
  }

  async seleccionarTipoCuenta(tipoCuenta: string) {
    await this.agregarCuentaModal.click();
    await this.page.getByRole('option', { name: tipoCuenta }).click();
  }

  async ingresarMonto(monto: string) {
    await this.montoImput.fill(monto);
}
  async enviarDinero() {
    await this.botonEnviarDinero.click(); 

  }
}