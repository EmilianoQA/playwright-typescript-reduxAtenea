
// archivo para registrar usuarios con autenticacion y guardarla en un archivo
// usamos backendUtils y dataFactory para crear usuarios via API
import{test as setup , expect} from'@playwright/test';  
import {BackendUtils} from '../utils/backendUtils';   
import {DataFactory} from '../utils/dataFactory';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import {ModalCrearCuenta} from '../pages/modalCrearCuenta'; 



let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuenta: ModalCrearCuenta;
const usuarioEnviaAuthFile ='playwright/.auth/usuarioEnvia.json';
const usuarioRecibeAuthFile ='playwright/.auth/usuarioRecibe.json';

setup.beforeEach(async ({page})=>{
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    modalCrearCuenta = new ModalCrearCuenta(page);
    await loginPage.navigateToLogin();
    
})

// crear un usuario que envia dinero y guardar su auth en un archivo utilizando backendUtils y dataFactory
setup ('Generar usuario que envia dinero', async ({page, request})=>{
      
// crear usuario via API
    const newUser = DataFactory.createNewUser();
    await BackendUtils.registerUserViaApi(page.request, newUser, newUser.email);
    console.log ('Usuario creado via API con email:', newUser.email);
// iniciar sesion con el usuario creado
    await loginPage.completeFormAndSubmit(newUser.email, newUser.password);
    await dashboardPage.verifyDashboardElements();
// guardar el estado de autenticacion en un archivo
    await page.context().storageState({ path: usuarioEnviaAuthFile });
// Seleccionar tipo de cuenta en el modal de crear cuenta
    await dashboardPage.botonAgregarCuenta .click();
    await modalCrearCuenta.seleccionarTipoCuenta('Débito');
    await modalCrearCuenta.ingresarMonto('1000');
// verificar que la cuenta se crea exitosamente
    await modalCrearCuenta.botonCrearCuenta.click();
    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
    console.log ('Cuenta de débito creada para el usuario:', newUser.email);
    await page.waitForTimeout(5000);
})

