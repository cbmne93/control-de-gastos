# Control de gastos

Aplicación web para gestionar ingresos, gastos, cuentas, categorías, cuotas, vencimientos y notificaciones personales.

El objetivo del sistema es ayudar a llevar un control simple y ordenado del dinero disponible, los gastos pendientes y los compromisos en cuotas.

## Tecnologías utilizadas

- Next.js 16
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Tailwind CSS
- React Hook Form
- Zod

## Funcionalidades principales

- Registro e inicio de sesión de usuarios.
- Dashboard con resumen financiero.
- Gestión de movimientos: ingresos y gastos.
- Registro de gastos en cuotas.
- Control de cuotas pendientes, pagadas y vencidas.
- Gestión de cuentas.
- Gestión de categorías.
- Notificaciones internas por cuotas próximas a vencer.
- Configuración de avisos de cuotas.
- Cambio de apariencia y color principal.
- Reportes básicos con exportación a Excel.

## Requisitos

- Node.js 20 o superior
- PostgreSQL
- npm

## Instalación local

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
cd control-gastos
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` tomando como base `.env.example`:

```bash
cp .env.example .env
```

Configurar las variables de entorno:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

AUTH_URL="http://localhost:3000"
AUTH_SECRET=""

APP_TIME_ZONE="America/Asuncion"

CRON_SECRET=""

EMAIL_ENABLED="false"
EMAIL_PROVIDER="console"
EMAIL_FROM="Control de gastos <notificaciones@example.com>"
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
```

Generar Prisma Client:

```bash
npx prisma generate
```

Levantar el proyecto:

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:3000
```

## Comandos útiles

Ejecutar lint:

```bash
npm run lint
```

Compilar para producción:

```bash
npm run build
```

Procesar avisos de cuotas manualmente:

```bash
npm run cron:cuotas
```

## Producción

Antes de publicar, verificar:

```bash
npm run lint
npm run build
```

En producción se deben configurar las variables de entorno en el proveedor de hosting, por ejemplo Vercel.

No subir el archivo `.env` al repositorio.

Para aplicar migraciones en producción:

```bash
npx prisma migrate deploy
```

## Cron de cuotas

El sistema incluye un proceso para generar avisos automáticos de cuotas próximas a vencer.

La ruta protegida del cron es:

```txt
/api/cron/cuotas-vencimientos
```

El proceso también puede ejecutarse manualmente con:

```bash
npm run cron:cuotas
```

## Variables de entorno

El archivo `.env.example` sirve como plantilla. El archivo `.env` real debe mantenerse privado.

Variables principales:

```env
DATABASE_URL=""
AUTH_URL=""
AUTH_SECRET=""
APP_TIME_ZONE="America/Asuncion"
CRON_SECRET=""
EMAIL_ENABLED="false"
EMAIL_PROVIDER="console"
EMAIL_FROM=""
```

## Estado del proyecto

Proyecto en etapa funcional de prueba en producción.

Módulos principales implementados:

- Dashboard
- Movimientos
- Cuotas
- Notificaciones
- Categorías
- Cuentas
- Reportes
- Configuración
