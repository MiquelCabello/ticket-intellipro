# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d7bd3a31-2021-4dd6-9a3a-a0747593f8f1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d7bd3a31-2021-4dd6-9a3a-a0747593f8f1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend)
- Vitest (Unit Testing)
- Playwright (E2E Testing)

## Desarrollo

### Comandos disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build localmente

# Testing
npm run test         # Tests unitarios (Vitest)
npm run test:ui      # Tests con interfaz visual
npm run e2e          # Tests end-to-end (Playwright)

# Linting y formato
npm run lint         # Linter con ESLint
npm run format       # Formatear código con Prettier

# Seguridad y rendimiento (Fase 2)
npm run audit:security    # Auditoría de seguridad
npm run audit:fix        # Fix automático de vulnerabilidades
npm run performance:check # Verificación de rendimiento
```

### Auditoría y seguridad (Fase 2)

- **Auditoría de dependencias**: Bloquea vulnerabilidades críticas en CI
- **Métricas p95**: Monitoreo automático de rendimiento de carga
- **Logs estructurados**: Sistema de logging con métricas de rendimiento
- **Error boundaries**: Manejo robusto de errores con logging automático

### Performance Monitoring

El sistema registra automáticamente:
- Tiempo de carga total (p95)
- First Byte Time
- DOM Interactive
- DOM Content Loaded
- Load Complete

Las métricas se almacenan localmente en desarrollo y se pueden enviar a servicios de monitoreo en producción.

### Configuración de entorno

Copia `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

### Testing

- **Unit tests**: Vitest con React Testing Library
- **E2E tests**: Playwright para flujos críticos
- **CI**: GitHub Actions ejecuta build, lint, test, e2e

### Finanzas y decimales

El sistema utiliza `DECIMAL(18,4)` para cálculos financieros:
- Cálculos internos: 4 decimales de precisión
- UI: 2 decimales para mostrar al usuario
- Monedas: formato ISO 4217 (EUR, USD, GBP)
- Fechas: ISO 8601 (YYYY-MM-DD, UTC)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d7bd3a31-2021-4dd6-9a3a-a0747593f8f1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
