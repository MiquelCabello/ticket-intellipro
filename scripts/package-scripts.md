# Package.json Scripts Update Required

Since package.json is read-only, please add these scripts manually:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",  
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Development Commands

After adding the scripts above, you can use:

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build locally
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier