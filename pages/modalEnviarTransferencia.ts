import { Page, Locator, expect } from '@playwright/test';

export class ModalEnviarTransferencia {
  readonly page: Page;
  readonly emailDestinatarioInput: Locator; 
  readonly cuentaOrigenComboBox: Locator;
  readonly montoInput: Locator;
  readonly botonEnviarDinero: Locator;
  readonly botonCancelar: Locator;
  readonly cuentaOrigenOption: Locator;
  readonly mensajeTransferenciaExitosa: Locator;
  
  
  constructor(page: Page) {
    this.page = page;
    this.emailDestinatarioInput = page.getByRole('textbox', { name: 'Email del destinatario *' })
    this.cuentaOrigenComboBox = page.getByRole('combobox', { name: 'Cuenta origen *' });
    this.montoInput=page.getByRole('spinbutton', { name: 'Monto a enviar *' });
    this.botonEnviarDinero = page.getByRole('button', { name: 'Enviar' })
    this.botonCancelar = page.getByRole('button', { name: 'Cancelar' })
    this.cuentaOrigenOption = page.getByRole('option', { name: '••••' })   
    this.mensajeTransferenciaExitosa = page.getByText('Transferencia enviada a juan@')
}
// Metodo para enviar transferencia
async enviarTransferencia(emailDestinatario: string, cuentaOrigen: string, monto: string) {
    await this.emailDestinatarioInput.fill(emailDestinatario);
    await this.cuentaOrigenComboBox.click();
    await this.cuentaOrigenOption.click();
    await this.montoInput.fill(monto);
    await this.botonEnviarDinero.click(); 
  }

async verificarTransferenciaExitosa() {
    await expect(this.mensajeTransferenciaExitosa).toBeVisible();
  }

}