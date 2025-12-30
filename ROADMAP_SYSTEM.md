# 🔥 PLAN COMPLETO 100% - ROYAL BARBER MOBILE APP
## **8 DÍAS PARA UN SISTEMA PROFESIONAL DE VERDAD**

---

## 🚨 **DÍA 0: PREPARACIÓN (HOY - 1 hora)**
**Hacer ANTES de dormir:**
- [x] Instalar `jsonwebtoken`, `bcrypt`, `dotenv`, `express-validator`
- [x] Crear archivo `.env` con JWT_SECRET y PORT
- [x] Eliminar TODO el código de contraseñas en texto plano
- [x] Crear carpeta `server/middleware/` para organizar
- [x] Crear carpeta `server/utils/` para funciones auxiliares

---

## 📅 **DÍA 1: ESTRUCTURA MOBILE + SESIÓN SEGURA (Lunes - 5 horas)**

### **MAÑANA (8:00 AM - 11:00 AM) - 3 horas:**

**Backend - Seguridad base:**
1. [ ] Crear middleware de autenticación JWT
2. [ ] Proteger TODAS las rutas de turnos/clientes con el middleware
3. [ ] Modificar el login para que devuelva JWT token
4. [ ] Probar login en Postman/Thunder Client

**Frontend - Context y Router:**
5. [ ] Instalar `react-router-dom`
6. [ ] Crear `AuthContext.jsx` con login/logout/user
7. [ ] Conectar el login de LandingBarber con AuthContext
8. [ ] Guardar token en localStorage

### **TARDE (2:00 PM - 5:00 PM) - 3 horas:**

**Layout Mobile:**
9. [ ] Crear componente `MobileLayout.jsx` con:
   - Header fijo arriba
   - Área de contenido scrolleable
   - Bottom Navigation con 4 tabs
10. [ ] Crear 4 páginas vacías: Home, Agenda, Clientes, Perfil
11. [ ] Configurar rutas en App.jsx
12. [ ] Implementar navegación entre tabs (cambio de color al activo)
13. [ ] Hacer que al tocar cada tab cambie la pantalla
14. [ ] Agregar animación de transición entre pantallas

**Probar:**
- ✅ Login guarda sesión
- ✅ Al recargar página sigue logueado
- ✅ Bottom navigation funciona
- ✅ Cierra sesión y vuelve a landing

---

## 📱 **DÍA 2: DASHBOARD + VALIDACIONES (Martes - 6 horas)**

### **MAÑANA (8:00 AM - 12:00 PM) - 4 horas:**

**Pantalla Home:**
1. [ ] Crear tarjetas de métricas (2 columnas):
   - Turnos de HOY (contador)
   - Próximos en 3 horas
2. [ ] Crear botones de acción rápida:
   - Nuevo Turno
   - Nuevo Cliente
3. [ ] Crear endpoint `/api/turnos/today` en backend
4. [ ] Crear endpoint `/api/turnos/upcoming` (próximas 3h)
5. [ ] Conectar frontend con backend
6. [ ] Mostrar lista de próximos 5 turnos del día

**Validaciones Backend:**
7. [ ] Instalar `express-validator`
8. [ ] Crear validaciones para crear turno:
   - Cliente_id existe
   - Barbero_id existe
   - Fecha no es pasada
   - Servicio es válido

### **TARDE (2:00 PM - 5:00 PM) - 2 horas:**

**Loading States y Errores:**
9. [ ] Crear componente Spinner
10. [ ] Crear componente ErrorMessage
11. [ ] Agregar estados de loading en todas las peticiones
12. [ ] Instalar `react-hot-toast` para notificaciones
13. [ ] Agregar toasts de éxito/error

**Probar:**
- ✅ Métricas cargan correctamente
- ✅ Muestra loading mientras carga
- ✅ Errores se muestran bonito

---

## ⚔️ **DÍA 3: AGENDA + CREAR TURNOS (Miércoles - 7 horas)**

### **MAÑANA (8:00 AM - 12:00 PM) - 4 horas:**

**Pantalla Agenda:**
1. [ ] Crear selector de fecha (por defecto hoy)
2. [ ] Endpoint `/api/turnos?fecha=YYYY-MM-DD`
3. [ ] Mostrar todos los turnos del día en cards
4. [ ] Agregar filtros rápidos: Todos/Pendientes/Completados/Cancelados
5. [ ] Color-coding por estado:
   - Pendiente: amber
   - Completado: green
   - Cancelado: red
6. [ ] Al tocar un turno → abrir pantalla de detalle

**Horarios y Disponibilidad:**
7. [ ] Crear tabla `horarios_barberos` en SQLite:
   - barbero_id, dia_semana, hora_inicio, hora_fin
8. [ ] Seed con horarios: Lun-Vie 9:00-18:00, Sáb 9:00-14:00
9. [ ] Endpoint `/api/barberos/:id/disponibilidad?fecha=X`

### **TARDE (2:00 PM - 6:00 PM) - 3 horas:**

**Crear Turno (Modal Full-Screen):**
10. [ ] Instalar `react-hook-form` para formularios
11. [ ] Crear modal de nuevo turno con:
    - Select de cliente (o botón "Nuevo cliente")
    - Select de barbero
    - Date picker de fecha
    - Select de hora (solo horarios disponibles)
    - Select de servicio
    - Textarea de notas
12. [ ] Crear tabla `servicios` en DB:
    - nombre, duracion_minutos, precio
13. [ ] Seed: Corte (30min, $500), Barba (20min, $300), Combo (45min, $700)
14. [ ] Validar que no haya conflicto de horarios:
    - Mismo barbero, misma hora → ERROR
15. [ ] Crear turno en backend con validaciones

**Probar:**
- ✅ Solo muestra horarios libres
- ✅ No deja agendar fuera de horario laboral
- ✅ Detecta conflictos de horario
- ✅ Turno aparece inmediatamente en agenda

---

## 👥 **DÍA 4: CLIENTES + DETALLE TURNO (Jueves - 6 horas)**

### **MAÑANA (8:00 AM - 12:00 PM) - 4 horas:**

**Pantalla Clientes:**
1. [ ] Crear buscador en tiempo real (debounce 300ms)
2. [ ] Endpoint `/api/clientes?search=nombre`
3. [ ] Lista de clientes con:
   - Nombre, teléfono
   - Número de visitas totales
   - Última visita
4. [ ] Botón "+" flotante para nuevo cliente
5. [ ] Modal de crear cliente:
   - Nombre, teléfono, email (opcional)
   - Notas (ej: "Le gusta corto atrás")
6. [ ] Validar teléfono único
7. [ ] Al tocar cliente → ir a perfil del cliente

**Perfil de Cliente:**
8. [ ] Mostrar info del cliente
9. [ ] Historial de turnos (últimos 20)
10. [ ] Botón "Agendar turno" (abre modal con cliente pre-seleccionado)

### **TARDE (2:00 PM - 5:00 PM) - 2 horas:**

**Detalle y Acciones de Turno:**
11. [ ] Pantalla full-screen de detalle del turno
12. [ ] Mostrar toda la info + foto del cliente (si tiene)
13. [ ] Botones de acción:
    - ✅ Completar (solo si es pendiente)
    - ❌ Cancelar (solo si es pendiente)
    - ✏️ Editar (cambia hora/barbero/servicio)
14. [ ] Confirmación antes de cancelar
15. [ ] Endpoint PATCH `/api/turnos/:id/estado`
16. [ ] Actualizar lista en tiempo real

**Probar:**
- ✅ Búsqueda funciona rápido
- ✅ Historial muestra correctamente
- ✅ Cambios de estado reflejan inmediato

---

## 🔐 **DÍA 5: ROLES + SEGURIDAD AVANZADA (Viernes - 6 horas)**

### **MAÑANA (8:00 AM - 12:00 PM) - 4 horas:**

**Sistema de Roles:**
1. [ ] Agregar columna `rol` a tabla usuarios (admin/barbero)
2. [ ] Middleware `isAdmin` para rutas sensibles
3. [ ] Solo admin puede:
   - Crear/editar/eliminar barberos
   - Ver reportes financieros
   - Eliminar turnos de otros barberos
4. [ ] Barbero normal solo puede:
   - Ver sus propios turnos
   - Crear turnos
   - Gestionar clientes

**Rate Limiting:**
5. [ ] Instalar `express-rate-limit`
6. [ ] Limitar login a 5 intentos por minuto
7. [ ] Limitar creación de turnos a 20 por hora

### **TARDE (2:00 PM - 5:00 PM) - 2 horas:**

**Validaciones Avanzadas:**
8. [ ] Sanitizar todos los inputs (express-validator)
9. [ ] Prevenir inyección SQL con prepared statements
10. [ ] Validar tipos de archivo si suben fotos
11. [ ] Límite de tamaño en requests (express.json limit)

**Logs del Sistema:**
12. [ ] Instalar `winston`
13. [ ] Crear logger que guarde:
    - Errores en `logs/error.log`
    - Info general en `logs/combined.log`
14. [ ] Loggear intentos de login fallidos
15. [ ] Loggear cambios en turnos (quién, cuándo, qué cambió)

**Probar:**
- ✅ Admin ve todo, barbero solo lo suyo
- ✅ No puedes hacer 100 logins seguidos
- ✅ Logs se crean correctamente

---

## 👤 **DÍA 6: PERFIL + ESTADÍSTICAS (Sábado - 5 horas)**

### **MAÑANA (9:00 AM - 12:00 PM) - 3 horas:**

**Pantalla Perfil:**
1. [ ] Mostrar info del barbero logueado
2. [ ] Botón para subir foto de perfil
3. [ ] Endpoint para actualizar perfil
4. [ ] Sección de estadísticas personales:
   - Turnos completados este mes
   - Turnos completados total
   - Cliente más frecuente
   - Servicio más vendido
   - Promedio de turnos por día
5. [ ] Crear endpoint `/api/stats/barbero/:id`

### **TARDE (2:00 PM - 5:00 PM) - 2 horas:**

**Reportes (Solo Admin):**
6. [ ] Crear pantalla de Reportes en menú hamburguesa
7. [ ] Dashboard financiero:
   - Ingresos del mes
   - Ingresos por barbero
   - Servicios más vendidos
   - Gráfica de turnos por día (últimos 30 días)
8. [ ] Instalar `recharts` para gráficas
9. [ ] Filtros: Por fecha, por barbero
10. [ ] Botón "Exportar a Excel" (genera CSV)

**Configuración:**
11. [ ] Pantalla de configuración:
    - Cambiar contraseña
    - Horarios de trabajo
    - Notificaciones (on/off)
12. [ ] Botón de cerrar sesión (limpia localStorage)

**Probar:**
- ✅ Stats se calculan correctamente
- ✅ Gráficas se ven bien
- ✅ CSV descarga OK

---

## 🚀 **DÍA 7: PWA + OPTIMIZACIÓN (Domingo - 5 horas)**

### **MAÑANA (9:00 AM - 12:00 PM) - 3 horas:**

**Convertir a PWA:**
1. [ ] Crear `manifest.json` con:
   - Nombre de la app
   - Iconos (192x192, 512x512)
   - Colores (amber/zinc)
   - Display: standalone
2. [ ] Generar iconos con herramienta online
3. [ ] Crear Service Worker básico:
   - Cache de assets estáticos
   - Estrategia network-first para API
4. [ ] Agregar botón "Instalar app" en landing
5. [ ] Probar instalación en Android/iOS

**Modo Offline Básico:**
6. [ ] Cache la lista de barberos
7. [ ] Cache la lista de servicios
8. [ ] Mostrar mensaje si no hay conexión
9. [ ] Cola de sincronización (si crean turno offline, se sube cuando vuelve internet)

### **TARDE (2:00 PM - 5:00 PM) - 2 horas:**

**Optimización de Performance:**
10. [ ] Lazy loading de rutas (React.lazy)
11. [ ] Comprimir imágenes con TinyPNG
12. [ ] Minificar build de producción
13. [ ] Agregar `useMemo` y `useCallback` donde sea necesario
14. [ ] Paginación en lista de clientes (20 por página)
15. [ ] Virtual scroll si hay muchos turnos en un día

**UX Mobile:**
16. [ ] Agregar haptic feedback en botones importantes
17. [ ] Pull-to-refresh en listas
18. [ ] Transiciones suaves entre pantallas
19. [ ] Safe area para iPhone (padding-bottom en tabs)
20. [ ] Splash screen mientras carga

**Probar:**
- ✅ App se instala en celular
- ✅ Funciona sin internet (al menos parcialmente)
- ✅ Carga rápido (< 2 segundos)

---

## 🌐 **DÍA 8: BACKUP + DEPLOY (Lunes - 6 horas)**

### **MAÑANA (8:00 AM - 12:00 PM) - 4 horas:**

**Sistema de Backup:**
1. [ ] Crear script `backup.js`:
   - Copia database.sqlite a carpeta `backups/`
   - Nombre: `backup-YYYY-MM-DD-HH-mm.sqlite`
2. [ ] Instalar `node-cron`
3. [ ] Programar backup automático cada 6 horas
4. [ ] Mantener solo últimos 30 backups (borrar antiguos)
5. [ ] Endpoint `/api/backup/download` (solo admin)
6. [ ] Probar restauración manual

**Preparar para Producción:**
7. [ ] Crear `.env.production` con:
   - JWT_SECRET fuerte (generado random)
   - NODE_ENV=production
   - DATABASE_PATH=/var/lib/barber/database.sqlite
8. [ ] Configurar CORS solo para tu dominio
9. [ ] Agregar helmet.js para headers de seguridad
10. [ ] Comprimir respuestas con compression
11. [ ] Crear script de inicio con PM2

### **TARDE (2:00 PM - 6:00 PM) - 2 horas:**

**Deploy Real:**
12. [ ] Opción A - VPS (DigitalOcean/Linode):
    - Instalar Node.js en servidor
    - Subir código con Git
    - Configurar Nginx como reverse proxy
    - Instalar SSL con Let's Encrypt (certbot)
    - Iniciar con PM2
13. [ ] Opción B - Render.com (más fácil):
    - Conectar repo de GitHub
    - Configurar variables de entorno
    - Deploy automático
14. [ ] Comprar dominio (ej: royalbarber.com)
15. [ ] Configurar DNS apuntando al servidor
16. [ ] Probar que funcione en producción

**Documentación Final:**
17. [ ] README.md con:
    - Cómo instalar
    - Cómo hacer backup
    - Cómo agregar un barbero
    - Troubleshooting común
18. [ ] Guía de usuario (PDF):
    - Cómo agendar un turno
    - Cómo buscar un cliente
    - Cómo ver reportes

**Probar TODO en Producción:**
- ✅ HTTPS funciona
- ✅ Login desde celular
- ✅ Crear turno
- ✅ PWA se instala
- ✅ Backup automático funciona
- ✅ Logs se guardan

---

## 📋 **CHECKLIST FINAL - TODO AL 100%:**

### **Funcionalidad:**
- [x] Login seguro con JWT
- [x] Roles (admin/barbero)
- [x] Dashboard mobile con métricas
- [x] Agenda con filtros
- [x] Crear/editar/cancelar turnos
- [x] Gestión de clientes
- [x] Historial por cliente
- [x] Detección de conflictos de horario
- [x] Horarios de trabajo por barbero
- [x] Servicios con duración y precio
- [x] Estadísticas personales
- [x] Reportes financieros (admin)
- [x] Perfil y configuración
- [x] Búsqueda rápida

### **Seguridad:**
- [x] Contraseñas con bcrypt
- [x] JWT con expiración
- [x] Rate limiting
- [x] Validación de inputs
- [x] Sanitización SQL
- [x] Middleware de autenticación
- [x] Logs de seguridad
- [x] HTTPS en producción
- [x] Variables de entorno

### **UX/UI Mobile:**
- [x] Bottom navigation
- [x] Responsive 100%
- [x] Loading states
- [x] Notificaciones toast
- [x] Animaciones suaves
- [x] Pull-to-refresh
- [x] Botones táctiles (44px)
- [x] Safe area iOS
- [x] PWA instalable
- [x] Splash screen

### **Backend:**
- [x] API RESTful completa
- [x] Validaciones en todos los endpoints
- [x] Manejo de errores
- [x] Logs con Winston
- [x] Backup automático
- [x] Optimización de queries
- [x] Paginación

### **Deploy:**
- [x] Servidor configurado
- [x] SSL/HTTPS
- [x] Dominio propio
- [x] PM2 para mantener vivo
- [x] Backups automáticos
- [x] Documentación completa

---

## 🎯 **RESUMEN SEMANAL:**

| Día | Horas | Objetivo |
|-----|-------|----------|
| **Día 1** | 5h | Estructura mobile + Sesión JWT |
| **Día 2** | 6h | Dashboard + Validaciones |
| **Día 3** | 7h | Agenda + Crear turnos |
| **Día 4** | 6h | Clientes + Detalle turno |
| **Día 5** | 6h | Roles + Seguridad avanzada |
| **Día 6** | 5h | Perfil + Estadísticas |
| **Día 7** | 5h | PWA + Optimización |
| **Día 8** | 6h | Backup + Deploy |
| **TOTAL** | **46 horas** | **Sistema 100% profesional** |

---

## ⚡ **PARA MAÑANA (DÍA 1) - LISTA ESPECÍFICA:**

### **8:00 AM - 11:00 AM:**
1. Crear middleware JWT
2. Proteger rutas backend
3. Modificar login para devolver token
4. Crear AuthContext
5. Guardar token en localStorage

### **2:00 PM - 5:00 PM:**
6. Instalar react-router-dom
7. Crear MobileLayout con bottom nav
8. Crear 4 páginas vacías
9. Configurar rutas
10. Probar navegación completa

### **Al final del día tendrás:**
✅ Login que mantiene sesión
✅ App con navegación móvil funcionando
✅ Backend seguro con JWT
✅ Base para construir el resto

---

**¿Listo para empezar mañana? Con este plan tienes TODO al 100%. No falta nada. 🚀💯**