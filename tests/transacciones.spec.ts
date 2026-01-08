// archivo para tests de transacciones entre usuarios ya logueados
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalEnviarTransferencia } from '../pages/modalEnviarTransferencia';
import testData from '../data/testData.json';
import fs from 'fs/promises'; // api para manejar archivos
import path from 'path'; // para manejar rutas de archivos

let dashboardPage: DashboardPage;
let modalEnviarTransferencia: ModalEnviarTransferencia;
// extender el test para usar el estado de autenticacion de los usuarios creados en registro.setup.ts
// usamos resolve para obtener la ruta absoluta del archivo de estado de autenticacion
const testUsuarioEnvia = test.extend({
    //storageState: require.resolve ('../playwright/.auth/usuarioEnvia.json')
    storageState: '../playwright/auth/usuarioEnvia.json'
});
const testUsuarioRecibe = test.extend({
    //storageState: require.resolve ('../playwright/.auth/usuarioRecibe.json')
    storageState: '../playwright/auth/usuarioRecibe.json'
});

test.beforeEach (async ({page})=>{
    dashboardPage = new DashboardPage(page);
    modalEnviarTransferencia = new ModalEnviarTransferencia(page);
    await dashboardPage.navigateToDashboard();
});

testUsuarioEnvia ('TC-12 Verificar transaccion exitosa', async ({page})=>{
    await dashboardPage.verifyDashboardElements();
    await dashboardPage.clickBotonEnviarDinero();
    await modalEnviarTransferencia.enviarTransferencia(testData.users[0].email,'••••','100');
    await modalEnviarTransferencia.verificarTransferenciaExitosa();
    console.log ('Transferencia realizada con exito');
    await page.waitForTimeout(5000); 
});

testUsuarioRecibe ('TC-13 Verificar que usuario recibe transferencia', async ({page})=>{
    await dashboardPage.verifyDashboardElements();
    await expect(page.getByTestId('descripcion-transaccion').first()).toBeVisible();
    console.log ('Usuario receptor ha recibido la transferencia');  
    await page.waitForTimeout(5000);

});

// test para verificar transferencia enviada por API
testUsuarioRecibe ('TC-14 Verificar transferencia recibida (enviada por API)', async ({page, request})=>{
    // PASO 1: Obtener credenciales del usuario remitente
    const usuarioEnviaDataFile = require.resolve ('../playwright/.auth/usuarioEnvia.data.json');
    const usuarioEnviaData = JSON.parse (await fs.readFile(usuarioEnviaDataFile, 'utf-8'));
    const datosDeUsuarioEnvia = JSON.parse (JSON.stringify (usuarioEnviaData)); 
    const emailEnvia = datosDeUsuarioEnvia.email;
    const passwordEnvia = datosDeUsuarioEnvia.password;
    expect (emailEnvia).toBeDefined();
    expect (passwordEnvia).toBeDefined();
    console.log ('Datos del usuario que envia leidos correctamente:', emailEnvia);
    expect (passwordEnvia, 'Password no debe estar vacio').not.toBe('');

    const usuarioEnviaAuthFile = require.resolve ('../playwright/.auth/usuarioEnvia.json');
    const authEnviaData = JSON.parse (await fs.readFile(usuarioEnviaAuthFile, 'utf-8'));
    const tokenEnvia = authEnviaData.origins[0]?.localStorage.find((item: any) => item.name === 'jwt')?.value;
    expect (tokenEnvia, 'Token no debe estar vacio').not.toBeUndefined();

    const jwt = tokenEnvia;
    expect (jwt, 'JWT no debe estar vacio').not.toBe('');

    // PASO 2: Enviar transferencia por API
    const cuentaEnviaResponse = await request.get ('http://localhost:3000/api/accounts', {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    expect (cuentaEnviaResponse.ok(), `Respuesta de API para obtener cuentas fallo: ${cuentaEnviaResponse.status()}`).toBeTruthy();
    const cuentasEnvia = await cuentaEnviaResponse.json();
    expect (cuentasEnvia.length, 'El usuario que envia debe tener al menos una cuenta').toBeGreaterThan(0);
    const cuentaEnviaId = cuentasEnvia[0]._id;
    console.log ('Cuenta del usuario que envia obtenida:', cuentaEnviaId);

    const montoAleatorio = (Math.floor(Math.random() * 100) + 1);
    console.log (`Enviando transferencia de $${montoAleatorio} desde la cuenta ${cuentaEnviaId} a ${testData.users[0].email}`);

    const transferenciaResponse = await request.post ('http://localhost:3000/api/transactions/transfer', {
        headers: {
            'Authorization': `Bearer ${jwt}`    
        },
        data: {
            fromAccountId: cuentaEnviaId,
            toEmail: testData.users[0].email,
            amount: montoAleatorio
        }
    }); 
    expect (transferenciaResponse.ok(), `Respuesta de API para enviar transferencia fallo: ${transferenciaResponse.status()}`).toBeTruthy();
    console.log ('Transferencia enviada via API con exito');

    // PASO 3: Verificar transferencia en UI
    await page.reload();
    await page.waitForLoadState('networkidle');
    await dashboardPage.navigateToDashboard();
    await dashboardPage.verifyDashboardElements();
    await page.waitForTimeout(5000);
    // ahora vamos a verificar dos cosas: el emial del remitente y el monto transferido
    await expect(dashboardPage.elementosListaTransferencias.first()).toContainText(emailEnvia);
    // para encontrar el monto, usamos una expresion regular que busque el monto con el formato $montoAleatorio
    const montoRegex = new RegExp(String(montoAleatorio.toFixed(2)));
    await expect(dashboardPage.montosListaTransferencias.first()).toContainText(montoRegex);
    console.log (`Usuario receptor ha recibido la transferencia de $${montoAleatorio} enviada via API`);
    
});