# Automatización de Pruebas E2E con Playwright y TypeScript

Un proyecto moderno de automatización de pruebas end-to-end usando Playwright y TypeScript.

## 📋 Descripción

Este proyecto contiene pruebas automatizadas para validar el comportamiento de aplicaciones web. Utiliza Playwright como framework de pruebas y TypeScript para mejorar la confiabilidad y mantenibilidad del código.

## 🛠️ Tecnologías

- **Playwright** v1.57.0 - Framework de automatización
- **TypeScript** - Lenguaje de programación tipado
- **Node.js** - Entorno de ejecución

## 📦 Requisitos Previos

- Node.js 16+ instalado en tu máquina
- npm o yarn como gestor de paquetes

## 🚀 Instalación

### 1. Clonar o crear el proyecto

```bash
mkdir playwright-typescript
cd playwright-typescript
```

### 2. Inicializar Playwright

```bash
npm init playwright@latest
```

### 3. Instalar dependencias

```bash
npm install
```

## 📝 Estructura del Proyecto

```
.
├── tests/
│   └── example.spec.ts          # Archivos de prueba
├── playwright.config.ts          # Configuración de Playwright
├── package.json                  # Dependencias del proyecto
└── README.md                     # Este archivo
```

## ▶️ Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo headless
npx playwright test

# Ejecutar pruebas con UI interactivo
npx playwright test --ui

# Ejecutar pruebas en navegador específico
npx playwright test --project=chromium
```

## 📊 Ver Reportes

```bash
# Abrir reporte HTML de últimas pruebas
npx playwright show-report
```

## 🔧 Configuración

Edita `playwright.config.ts` para personalizar:

- **testDir**: Ubicación de archivos de prueba
- **retries**: Reintentos en caso de fallo
- **workers**: Número de pruebas en paralelo
- **reporter**: Formato de reportes
- **baseURL**: URL base de la aplicación

## 📚 Recursos

- [Documentación oficial de Playwright](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-page)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 📄 Licencia

ISC

---

**Autor**: Emiliano  
**Última actualización**: Diciembre 2025
