
// archivo para registrar usuarios con autenticacion y guardarla en un archivo
// usamos backendUtils y dataFactory para crear usuarios via API
import{test as setup , expect} from'@playwright/test';  
import {BackendUtils} from '../utils/backendUtils';   
import {DataFactory} from '../utils/dataFactory';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import {ModalCrearCuenta} from '../pages/modalCrearCuenta'; 
import testData from '../data/testData.json';
import fs from 'fs/promises'; // api para manejar archivos
import path from 'path'; // para manejar rutas de archivos

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuenta: ModalCrearCuenta;

const usuarioEnviaAuthFile ='playwright/.auth/usuarioEnvia.json';
const usuarioRecibeAuthFile ='playwright/.auth/usuarioRecibe.json';
const usaarioEnviaDataFile ='playwright/.auth/usuarioEnvia.data.json';

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

// guardar los datos del usuario en un archivo para usarlo en tests de transacciones
    // ruta relealtiva del archivo: await fs.writeFile(path.resolve (usaarioEnviaDataFile), JSON.stringify (newUser));
   // ruta absoluta del archivo
    await fs.writeFile(path.resolve(__dirname, '..', usaarioEnviaDataFile), JSON.stringify(newUser, null, 2));
    // resolve une la ruta del directorio actual con la ruta relativa del archivo
    // '..' sube un nivel en la jerarquia de carpetas. EN este caso de registro.setup.ts a playwright/.auth., 
    // es decir salimos de test y nos metemos en playwright/.auth

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
// logerase con usuarioValido usando testData y guardar su auth en un archivo
setup ('Realizar loguin con usuario receptor', async ({page})=>{
    const receptorUser = testData.users[0];
    await loginPage.completeFormAndSubmit(receptorUser.email, receptorUser.password);
    await dashboardPage.verifyDashboardElements();
    await page.context().storageState({ path: usuarioRecibeAuthFile });
});

