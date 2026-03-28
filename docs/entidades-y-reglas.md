1. Introducción

Este documento define las entidades principales del sistema Glow Up Studio y las reglas de funcionamiento asociadas a cada una.

Las entidades representan los elementos principales que el sistema necesita para funcionar: clientes, servicios, profesionales, recursos, citas y pagos.

Cada entidad contiene una serie de propiedades que más adelante se convertirán en campos de base de datos.

2. Entidad: Cliente

Representa a la persona que reserva o recibe servicios en el centro.

Propiedades
id
nombre
apellidos
teléfono
email
notas
fecha_alta
Reglas
Un cliente puede tener muchas citas.
Si una clienta reserva online y ya existe en la base de datos, se reutiliza su ficha.
Si no existe, se crea automáticamente al completar la reserva.
El teléfono y el email serán datos obligatorios para reservas online.
3. Entidad: Servicio

Representa cada tratamiento del catálogo del centro.

Los servicios están definidos en el documento catalogo-servicios.md.

Propiedades
id
nombre
categoria
precio
duracion
margen
duracion_total
recurso_id
activo
Reglas
Cada servicio pertenece a una categoría.
Cada servicio tiene un precio y una duración definida.
Cada servicio requiere un recurso o cabina.
Cada servicio solo puede ser realizado por determinados profesionales.
Los servicios pueden combinarse en una misma cita.
4. Entidad: Profesional

Representa a cada trabajador del centro.

Propiedades
id
nombre
activo
telefono
email
color_agenda (para calendario)
notas
Reglas
Un profesional puede realizar varios servicios.
Un profesional tiene un horario de trabajo.
Un profesional puede tener bloqueos (vacaciones, descanso, etc.).
Un profesional no puede estar asignado a dos servicios al mismo tiempo.
5. Entidad: Recurso

Representa una cabina, sala, máquina o puesto de trabajo.

Propiedades
id
nombre
tipo (cabina, mesa, máquina)
activo
notas
Reglas
Un recurso no puede usarse en dos citas al mismo tiempo.
Algunos servicios requieren un recurso específico.
El admin puede bloquear recursos temporalmente.
6. Entidad: Cita

Representa una reserva global realizada por una clienta para uno o varios servicios.

Propiedades
id
cliente_id
fecha
hora_inicio
hora_fin
duracion_total
estado
origen (web, telefono, presencial, admin)
precio_total
señal_pagada
importe_pendiente
notas
fecha_creacion
Reglas
Una cita puede contener uno o varios servicios.
Una cita solo se crea desde la web si el pago se realiza correctamente.
Una cita bloquea tiempo real en la agenda.
El admin puede modificar cualquier cita.
7. Entidad: Bloque de cita

Esta entidad es muy importante.

Representa cada tramo interno de una cita cuando hay varios servicios o cuando intervienen distintos profesionales o recursos.

Propiedades
id
cita_id
servicio_id
profesional_id
recurso_id
hora_inicio
hora_fin
orden
Reglas
Una cita puede tener varios bloques.
Cada bloque corresponde a un servicio.
Cada bloque tiene asignado un profesional y un recurso.
Los bloques pueden ir seguidos o con una espera máxima de 15 minutos.
El sistema asigna estos bloques automáticamente, pero el admin puede modificarlos.
8. Entidad: Pago

Representa la información económica de una cita.

Propiedades
id
cita_id
importe_total
señal_pagada
importe_pendiente
estado_pago
metodo_pago
fecha_pago
fecha_devolucion
motivo_devolucion
Reglas
La señal online será del 20% del total.
Si el pago online falla, la cita no se crea.
El resto del pago se realiza en el centro.
El admin puede registrar pagos manuales.
El admin puede registrar devoluciones.
9. Entidad: Usuario admin

Representa a las personas que pueden acceder al panel de administración.

Propiedades
id
nombre
email
contraseña
rol
activo
fecha_creacion
Reglas
Solo los usuarios admin pueden acceder al CRM.
Los usuarios deben iniciar sesión.
Se podrán definir roles en el futuro (admin, empleado, etc.).
10. Reglas globales del sistema
Reservas
Sin pago no hay cita registrada.
La clienta no elige profesional.
El sistema asigna profesionales automáticamente.
El sistema asigna recursos automáticamente.
El sistema solo muestra huecos realmente disponibles.
La agenda del CRM es la agenda real del negocio.
Tiempo
Cada servicio tiene una duración total (duración + margen).
Los servicios pueden encadenarse.
Se permite una espera máxima de 15 minutos entre servicios.
El sistema debe intentar minimizar las esperas.
Administración
El admin puede crear citas manualmente.
El admin puede modificar cualquier cita.
El admin puede cambiar profesionales y recursos.
El admin puede cancelar y reprogramar citas.
El admin puede registrar pagos y devoluciones.
Cancelaciones
Cancelaciones con más de 48 horas → posible devolución.
Cancelaciones con menos de 48 horas → no devolución.
No asistencia → pérdida de señal.