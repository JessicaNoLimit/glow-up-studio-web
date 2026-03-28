# architecture.md

## 1. Objetivo técnico

Glow Up Studio se desarrollará como una aplicación web compuesta por una parte pública de cara a la clienta y una parte privada de gestión interna para el centro.

La arquitectura del sistema debe permitir:

- mostrar la web corporativa pública
- ofrecer reservas online con pago de señal
- sincronizar las reservas con la agenda real del negocio
- permitir gestión manual desde un panel de administración
- almacenar clientes, citas, pagos, profesionales y recursos
- escalar en el futuro hacia una versión más completa

---

## 2. Módulos principales del sistema

El sistema estará dividido en los siguientes módulos funcionales:

### 2.1 Web pública
Parte visible para cualquier visitante. Incluye:
- landing page
- servicios
- resultados
- sobre el centro
- contacto
- acceso a reservas

### 2.2 Sistema de reservas online
Parte pública donde la clienta:
- selecciona servicios
- consulta disponibilidad
- introduce sus datos
- paga la señal
- recibe confirmación

### 2.3 CRM / Panel de administración
Parte privada donde el centro puede:
- ver agenda
- crear citas manuales
- modificar citas
- gestionar clientes
- gestionar pagos
- gestionar devoluciones
- gestionar profesionales
- gestionar recursos o salas

### 2.4 Motor de reservas
Lógica interna encargada de:
- calcular duración total
- buscar huecos disponibles
- asignar profesionales
- asignar recursos
- validar combinaciones
- bloquear agenda al confirmar reserva

### 2.5 Sistema de pagos
Encargado de:
- procesar señal online
- registrar pagos
- registrar devoluciones
- guardar estado económico de la cita

### 2.6 Sistema de notificaciones
Encargado de:
- enviar email de confirmación
- permitir futuras ampliaciones como recordatorios o cambios

---

## 3. Arquitectura general del sistema

La arquitectura general será cliente-servidor.

### Parte cliente
La interfaz visible en navegador incluirá:
- web pública
- flujo de reservas
- panel de administración

### Parte servidor
El backend se encargará de:
- exponer API
- gestionar autenticación admin
- consultar disponibilidad
- crear citas
- guardar clientes
- guardar pagos
- actualizar agenda
- gestionar reglas del negocio

### Base de datos
La base de datos almacenará toda la información persistente del sistema:
- clientes
- citas
- bloques de cita
- servicios
- profesionales
- recursos
- pagos
- usuarios admin

---

## 4. Frontend

La primera base del proyecto ya existe en HTML, CSS, JavaScript y Vite.

### Objetivo del frontend
Mantener una parte pública visualmente cuidada y evolucionarla hacia:
- reservas online
- vistas dinámicas
- panel admin

### Áreas del frontend
- web pública
- flujo de reservas
- login admin
- dashboard admin
- calendario
- formularios de citas
- formularios de clientes

### Recomendación de evolución
Aunque la web actual parte de HTML, CSS y JS, la evolución natural del sistema será estructurar mejor la interfaz en componentes o módulos reutilizables, especialmente en:
- reservas
- dashboard
- calendario
- formularios

---

## 5. Backend

El backend será el núcleo lógico del sistema.

### Responsabilidades del backend
- autenticación de administrador
- consulta de catálogo de servicios
- consulta de profesionales y recursos
- cálculo de disponibilidad
- creación de reservas
- creación de citas manuales
- actualización de citas
- cancelaciones y reprogramaciones
- registro de pagos
- registro de devoluciones
- envío de confirmaciones

### API
El backend expondrá endpoints para:
- servicios
- disponibilidad
- reservas
- clientes
- citas
- pagos
- login admin
- profesionales
- recursos

---

## 6. Base de datos

La base de datos será relacional, ya que el sistema tiene relaciones claras entre entidades.

### Entidades principales
- clientes
- servicios
- profesionales
- recursos
- citas
- bloques_cita
- pagos
- usuarios_admin

### Relaciones principales
- un cliente puede tener muchas citas
- una cita puede tener varios bloques
- cada bloque pertenece a un servicio
- cada bloque tiene un profesional asignado
- cada bloque tiene un recurso asignado
- cada cita tiene información económica asociada
- un usuario admin puede gestionar todas las entidades del sistema

### Fuente funcional
La definición inicial de entidades se encuentra en:
- `entidades-y-reglas.md`
- `catalogo-servicios.md`

---

## 7. Motor de reservas

El motor de reservas será una pieza clave del sistema.

### Entrada del motor
- servicios seleccionados
- catálogo de servicios
- profesionales compatibles
- recursos necesarios
- agenda real del centro

### Responsabilidades
- calcular duración total
- sumar márgenes
- buscar combinaciones posibles
- validar disponibilidad de profesionales
- validar disponibilidad de recursos
- permitir espera máxima de 15 minutos entre servicios
- minimizar esperas
- devolver bloques horarios globales reservables

### Reglas importantes
- la clienta no elige profesional
- el sistema asigna automáticamente
- sin pago no se registra la cita
- la agenda pública depende de la agenda real del CRM

---

## 8. Panel de administración

El panel de administración tendrá prioridad operativa sobre el sistema automático.

### Funciones principales
- login de administrador
- dashboard general
- vista calendario
- listado de citas
- detalle de cita
- edición completa de cita
- creación manual de citas
- gestión de clientes
- visualización y registro de pagos
- devoluciones
- gestión de disponibilidad de profesionales
- gestión de recursos y salas

### Regla clave
El admin podrá modificar manualmente cualquier cita generada automáticamente por el sistema.

---

## 9. Pagos y confirmaciones

### Reserva online
La reserva online requerirá el pago de una señal del 20%.

### Regla principal
- si el pago falla, no se crea la cita
- si el pago se completa, la cita se registra y bloquea agenda

### Confirmación
Tras el pago correcto, el sistema deberá:
- guardar la cita
- guardar el pago
- actualizar agenda
- enviar email de confirmación

### Política de cancelación
- cancelaciones con 48 horas o más: posible devolución según política del centro
- cancelaciones con menos de 48 horas: no devolución
- no asistencia: pérdida de señal

---

## 10. Sincronización entre reservas y CRM

La agenda del CRM será la fuente de verdad del negocio.

Eso significa que:
- la web pública de reservas deberá consultar siempre la disponibilidad real
- las citas creadas por el admin deben bloquear agenda
- las reservas online confirmadas deben bloquear agenda
- las cancelaciones deben liberar huecos
- las reprogramaciones deben actualizar la ocupación real

No deben existir agendas separadas sin sincronización.

---

## 11. Propuesta de estructura futura del proyecto

La estructura podrá evolucionar hacia algo similar a esto:

```text
project/
  docs/
    vision-general.md
    flujo-sistema.md
    catalogo-servicios.md
    entidades-y-reglas.md
    architecture.md
    agents.md

  frontend/
    public-web/
    reservas/
    admin/

  backend/
    api/
    services/
    models/
    routes/
    controllers/

  database/
    schema/
    seeds/

  shared/
    constants/
    utils/