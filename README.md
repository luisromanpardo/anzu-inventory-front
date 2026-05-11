# Anzu Inventory Front

Frontend para gestion de inventario de cartas Yu-Gi-Oh!

## Stack

- React 19 + TypeScript
- Vite
- Zustand (state management)
- TailwindCSS
- React Router v7
- Shadcn/ui

## Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Para deploy en produccion, apuntar a la URL de la API:

```env
VITE_API_URL=https://api.tudominio.com/api/v1
```

## Scripts

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Build para produccion
npm run lint         # Linting con ESLint
npm run preview      # Preview del build
```

## Estructura del Proyecto

```
src/
├── api/             # Configuracion de Axios y endpoints
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes base (shadcn/ui)
│   └── layout/      # Layout principal
├── pages/           # Paginas/rutas de la app
├── stores/          # Estado global con Zustand
├── types/           # Tipos TypeScript
└── lib/             # Utilidades
```

## Condiciones de Inventario

El backend utiliza codigos cortos para las condiciones de las cartas:

| Codigo | Descripcion |
|--------|-------------|
| NM | Near Mint |
| LP | Light Plaid |
| MP | Moderate Plaid |
| HP | Heavy Plaid |

El frontend traduce internamente a estos codigos al sincronizar con el backend.

## API Endpoints

- `GET /cards/search` - Buscar cartas
- `GET /cards/:id` - Detalle de carta
- `GET /home` - Cartas populares
- `GET /inventory/me` - Mi inventario
- `POST /inventory` - Agregar carta al inventario
- `PATCH /inventory/:id` - Actualizar item
- `DELETE /inventory/:id` - Eliminar item

## Desarrollo

Para correr el proyecto en modo desarrollo:

```bash
npm run dev
```

La app estara disponible en `http://localhost:5173`

## Notas

- El proyecto usa ESLint con TypeScript checking
- La autenticacion se maneja con JWT (access + refresh tokens)
- El estado de autenticacion se gestiona en `stores/authStore.ts`