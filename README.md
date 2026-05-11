# Anzu Inventory Front

Frontend para gestión de inventario de cartas Yu-Gi-Oh!

## Stack

- React 19 + TypeScript
- Vite
- Zustand (state management)
- TailwindCSS
- React Router v7
- Shadcn/ui
- Docker + Nginx

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Para deploy en producción, apuntar a la URL de la API:

```env
VITE_API_URL=https://api.tudominio.com/api/v1
```

## Scripts

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Build para producción
npm run lint         # Linting con ESLint
npm run preview      # Preview del build
```

## Docker

### Build y run

```bash
# Build de la imagen
docker build -t anzu-inventory-front .

# Run del contenedor
docker run -d -p 80:80 \
  -e VITE_API_URL=http://localhost:3000/api/v1 \
  --name anzu-front \
  anzu-inventory-front
```

### Build multi-stage con ARGs

```bash
docker build -t anzu-inventory-front \
  --build-arg VITE_API_URL=https://api.tudominio.com/api/v1 \
  .
```

### Docker Compose (con backend)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:3000/api/v1
    depends_on:
      - backend

  backend:
    # tu servicio de backend
```

## Estructura del Proyecto

```
src/
├── api/             # Configuración de Axios y endpoints
├── components/      # Componentes reutilizables
│   ├── ui/          # Componentes base (shadcn/ui)
│   └── layout/      # Layout principal
├── pages/           # Páginas/rutas de la app
├── stores/          # Estado global con Zustand
├── types/           # Tipos TypeScript
└── lib/             # Utilidades (conditions mapper, etc.)
```

## Condiciones de Inventario

El backend utiliza strings legibles para las condiciones:

| Frontend | Backend |
|----------|---------|
| mint | Mint |
| near_mint | Near Mint |
| light_plaid | Light Play |
| excellent/good/plaid | Moderately Played |
| poor | Damaged |

El frontend convierte internamente entre formatos.

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

La app estará disponible en `http://localhost:5173`

## Notas

- El proyecto usa ESLint con TypeScript checking
- La autenticación se maneja con JWT (access + refresh tokens)
- El estado de autenticación se gestiona en `stores/authStore.ts`
- Session restoration al recargar (llama a `/auth/refresh` + `/users/me`)