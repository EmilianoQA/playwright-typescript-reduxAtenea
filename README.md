# 🏦 Fintech Automation Framework (Playwright + TypeScript)

Framework de automatización de pruebas E2E robusto y escalable, modelo diseñado para validar flujos transaccionales en una aplicación bancaria/fintech.

Este proyecto demuestra una arquitectura profesional orientada a la mantenibilidad, velocidad de ejecución e integración continua.

## 🚀 Tech Stack & Arquitectura

*   **Core:** Playwright + TypeScript.
*   **Patrón de Diseño:** Page Object Model (POM) para encapsulamiento de lógica de UI.
*   **Optimización:** Uso de `Storage State` (.auth) para reutilización de sesiones de usuario y reducción de tiempos de ejecución.
*   **Datos:** Gestión de datos de prueba separados (`/data`) y generación dinámica (`dataFactory.ts`).
*   **Híbrido:** Integración de utilidades de Backend (`backendUtils.ts`) para pre-condiciones y limpieza de datos vía API.
*   **CI/CD:** Pipeline configurado con GitHub Actions (`.github/workflows`).

## 🧪 Escenarios Críticos Cubiertos

El framework valida los flujos de negocio más sensibles:
1.  **Onboarding:** Registro de usuarios y creación de cuentas (`modalCrearCuenta.ts`).
2.  **Transaccional:** Flujo completo de envío de transferencias entre usuarios (`transacciones.spec.ts`).
3.  **Seguridad/Auth:** Login y gestión de sesiones persistentes.

## 📂 Estructura del Proyecto

*   `/.github`: Configuración del pipeline de CI/CD.
*   `/pages`: Mapeo de elementos y métodos de negocio (POM).
*   `/tests`: Specs de prueba organizados por funcionalidad.
*   `/utils`: Helpers para llamadas a API y generación de data.
*   `/playwright/.auth`: Archivos de estado de sesión (cookies/storage) para tests autenticados.

## ⚙️ Ejecución Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/EmilianoQA/playwright-typescript-reduxAtenea.git
    cd playwright-typescript-fintech
    ```
    *(Asegúrate de cambiar la URL por la real de tu repo)*

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar todas las pruebas:**
    ```bash
    npx playwright test
    ```

4.  **Ver reporte HTML:**
    ```bash
    npx playwright show-report
    ```

---
*Desarrollado por Emiliano Maure - QA Automation Engineer*