# roadmap.md

## 1. Objetivo del roadmap

Este documento define el plan de desarrollo del sistema Glow Up Studio CRM y sistema de reservas, organizando el proyecto en fases de implementación para construir el sistema de forma progresiva y profesional.

El objetivo es construir primero una base sólida (CRM y agenda interna) y después conectar el sistema de reservas online.

---

## 2. Estrategia general del proyecto

El desarrollo se hará en este orden:

1. Documentación y diseño del sistema
2. Panel de administración (CRM)
3. Gestión de clientes
4. Gestión manual de citas
5. Calendario / agenda
6. Motor de reservas
7. Reservas online
8. Pagos online
9. Confirmaciones y notificaciones
10. Mejoras y automatizaciones futuras

Primero se construye la **agenda interna**, y después se conecta la **reserva online**.

Esto es importante porque la agenda del CRM será la base real del negocio.

---

## 3. Fases del proyecto

### Fase 1 – Documentación y arquitectura
Rama: `docs-sistema-crm`

Objetivo:
- Definir cómo funciona el sistema
- Definir entidades
- Definir catálogo de servicios
- Definir arquitectura
- Definir roadmap

Documentos:
- vision-general.md
- flujo-sistema.md
- catalogo-servicios.md
- entidades-y-reglas.md
- architecture.md
- roadmap.md

Estado: En progreso

---

### Fase 2 – Base del panel de administración
Rama: `crm`

Objetivo:
- Crear login de administrador
- Crear layout base del panel
- Crear dashboard inicial
- Crear navegación interna del CRM

Pantallas:
- Login
- Dashboard
- Menú lateral
- Estructura base del panel

---

### Fase 3 – Gestión de clientes
Rama: `clientes`

Objetivo:
- Crear listado de clientes
- Crear ficha de cliente
- Crear cliente nuevo
- Editar cliente
- Buscar cliente

Pantallas:
- Lista de clientes
- Ficha de cliente
- Formulario cliente

---

### Fase 4 – Gestión manual de citas
Rama: `crm` o `citas`

Objetivo:
- Crear citas manualmente
- Editar citas
- Cancelar citas
- Reprogramar citas
- Asignar profesionales
- Asignar recursos

Pantallas:
- Crear cita
- Editar cita
- Detalle de cita

---

### Fase 5 – Calendario / Agenda
Rama: `crm`

Objetivo:
- Vista calendario por día
- Vista calendario por semana
- Ver citas en agenda
- Mover citas
- Ver agenda por profesional
- Ver agenda por recurso

Esta fase es muy importante porque la agenda será el centro del sistema.

---

### Fase 6 – Motor de reservas
Rama: `reservas`

Objetivo:
- Calcular duración total de servicios
- Buscar disponibilidad
- Validar profesionales
- Validar recursos
- Permitir espera máxima de 15 min
- Generar bloques reservables

Esta fase es la lógica del sistema.

---

### Fase 7 – Reservas online (web pública)
Rama: `reservas`

Objetivo:
- Selección de servicios
- Selección de fecha y hora
- Formulario de cliente
- Resumen de reserva

Pantallas:
- Selección de servicios
- Calendario de reservas
- Datos del cliente
- Resumen

---

### Fase 8 – Pagos online
Rama: `reservas` o `pagos`

Objetivo:
- Integrar pago de señal (20%)
- Confirmar reserva tras pago
- Registrar pago
- Actualizar agenda
- Enviar confirmación

---

### Fase 9 – Confirmaciones y notificaciones
Rama: `reservas`

Objetivo:
- Email de confirmación
- Email de cancelación
- Email de reprogramación
- Posibles recordatorios

---

### Fase 10 – Mejoras futuras
Ramas futuras:
- `mejoras-ui`
- `automatizaciones`
- `usuarios-clientes`
- `estadisticas`

Posibles mejoras:
- Área privada de clientes
- Modificar cita desde web
- Cancelar cita desde web
- Recordatorios automáticos
- WhatsApp automático
- Bonos y promociones
- Informes del negocio
- Estadísticas
- Ocupación del centro
- Facturación

---

## 4. Resumen de ramas del proyecto

| Rama | Función |
|------|--------|
| main | Web pública estable |
| docs-sistema-crm | Documentación y arquitectura |
| crm | Panel de administración |
| clientes | Gestión de clientes |
| reservas | Sistema de reservas |
| pagos | Pagos online |
| mejoras-ui | Cambios de diseño |
| futuras-funciones | Nuevas funcionalidades |

---

## 5. Orden recomendado de desarrollo

Orden real recomendado:

1. Documentación (actual)
2. Login admin
3. Layout panel admin
4. Clientes
5. Crear citas manuales
6. Calendario
7. Motor de reservas
8. Reservas online
9. Pagos
10. Emails
11. Mejoras

No empezar por reservas online sin tener antes el calendario y las citas manuales.

---

## 6. Alcance versión 1 (MVP)

La versión 1 del sistema deberá permitir:

- Login admin
- Panel admin
- Gestión de clientes
- Crear citas manuales
- Editar citas
- Cancelar citas
- Calendario
- Reservas online
- Pago de señal
- Confirmación por email

Con esto el sistema ya sería funcional para un negocio real.

---

## 7. Objetivo final del proyecto

Construir una aplicación web profesional que incluya:

- Web corporativa
- Sistema de reservas inteligente
- CRM interno
- Agenda sincronizada
- Gestión de clientes
- Gestión de pagos
- Panel de administración
- Base preparada para automatizaciones futuras