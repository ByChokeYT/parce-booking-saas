# 🌊 FLOW | Donde el tiempo fluye perfectamente
> **Precisión Táctica en cada corte. Arquitectura optimizada para la excelencia.**

FLOW es un ecosistema integral de gestión para barberías de alto rendimiento, diseñado para automatizar el flujo de trabajo, fidelizar clientes y blindar la rentabilidad del negocio.

---

## 🏗️ Arquitectura del Software
El sistema utiliza una arquitectura **full-stack premium** diseñada para la escalabilidad y la velocidad:
- **Core**: Node.js & Express.
- **ORM**: Prisma (Type-safe access).
- **Database**: SQLite (Perfecto para despliegues rápidos y confiables).
- **Real-time**: Socket.io para actualizaciones instantáneas.
- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons.
- **BI & Analytics**: Recharts para visualización de finanzas.
- **Automation**: Node-Cron para el motor de marketing.

---

## 🚀 Capacidades Implementadas (100% Certificado)

### 🌊 1. Gestión de Agenda en Tiempo Real
- **WebSocket Engine**: Sincronización instantánea entre barberos y administrador.
- **Drag & Drop**: Calendario profesional (FullCalendar) para reprogramación visual rápida.
- **Anti-Race Condition**: Transacciones serializables de base de datos para evitar turnos duplicados.

### 💰 2. Módulo Financiero & BI
- **Cálculo de Comisiones**: Automatización del reparto (60/40) por barbero.
- **Corte de Caja**: Sistema de conciliación diario para detectar faltantes.
- **Analytics**: Gráficas de ingresos, servicios más vendidos y horarios pico.
- **Exportación**: Reportes en CSV listos para auditoría.

### 👥 3. CRM & Fidelización (Flow Points)
- **Sistema de Puntos**: 10 puntos por servicio. Canje de premios programable.
- **Reputación (Trust Score)**: Control de inasistencias (No-Shows) con impacto visual (Insignias Verde/Amarillo/Rojo).
- **Marketing Bot**: Notificaciones automáticas de cumpleaños y recordatorios para clientes inactivos.

### 🔐 4. Seguridad & Producción
- **Blindaje**: Helmet.js, Rate Limiting y CORS configurado.
- **Resiliencia**: Motor de backups automáticos diarios con rotación de 7 días.
- **Mobile First**: Interfaz optimizada para uso táctil intensivo con navegación inteligente.

---

## 🗺️ Roadmap de Implementación (Fases 1 - 11)

- [x] **Fase 1: Base Fundamental** (Auth JWT, Roles, DB Schema)
- [x] **Fase 2: Core del Sistema** (CRUD Servicios y Barberos)
- [x] **Fase 3: Prevención de Errores** (Anti-Race Condition)
- [x] **Fase 4: Tiempo Real** (WebSockets Socket.io)
- [x] **Fase 5: Módulo Financiero** (Comisiones y BI)
- [x] **Fase 6: Sistema de Reputación** (Trust Score & No-Shows)
- [x] **Fase 7: Panel de Configuración** (Gestión de Identidad y Pagos)
- [x] **Fase 8: App Móvil para Clientes** (Reserva Pública Express)
- [x] **Fase 9: Web Admin Optimizada** (Calendario Interactivo)
- [x] **Fase 10: Marketing y Fidelización** (Puntos y Automatización)
- [x] **Fase 11: Seguridad y Producción** (Helmet, Backups, Gzip)

---

## 🛠️ Guía Rápida de Inicio

### 1. Requisitos
- Node.js (v18+)
- NPM

### 2. Instalación
```bash
# Instalar dependencias del servidor
cd server
npm install
npx prisma generate
npx prisma db push

# Instalar dependencias del cliente
cd ../client
npm install
```

### 3. Ejecución
```bash
# Terminal 1: Iniciar Servidor (Puerto 3001)
cd server
node index.js

# Terminal 2: Iniciar Frontend (Puerto 5173)
cd client
npm run dev
```

---

## 💾 Gestión de Datos
- **Base de Datos**: Ubicada en `./database.sqlite`.
- **Backups**: El sistema genera copias en `./server/backups/` automáticamente a las 03:00 AM.
- **Credenciales por Defecto (Seed)**:
  - Admin: `admin@barber.com` / `admin123`

---

**FLOW SYSTEM © 2026** | *Donde el tiempo fluye perfectamente.* 🌊💈