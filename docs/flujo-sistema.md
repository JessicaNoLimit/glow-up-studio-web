1. Flujo general del sistema

Glow Up Studio funciona como un sistema conectado entre la web pública de reservas y el CRM interno del centro.

El flujo general es el siguiente:

La clienta entra en la web.
Accede a la sección de reservas.
Selecciona uno o varios servicios.
El sistema calcula duración y precio total.
El sistema busca combinaciones disponibles en agenda.
La clienta elige un día y una hora de inicio.
Introduce sus datos personales.
Revisa el resumen de la reserva.
Paga la señal del 20%.
El sistema registra la cita en el CRM.
La agenda interna se actualiza automáticamente.
La clienta recibe confirmación por email.

La cita solo existe dentro del sistema si el pago se ha realizado correctamente.

2. Flujo de reserva de la clienta
Paso 1 – Entrada a reservas

La clienta entra en la web y accede al apartado de reservas.

Paso 2 – Selección de servicios

La clienta selecciona uno o varios servicios del catálogo visible en la web.

Cada servicio debe mostrar:

nombre
precio
duración estimada
Paso 3 – Cálculo automático

El sistema suma:

precio total
duración estimada total

Además, tiene en cuenta los márgenes de tiempo de cada servicio.

Paso 4 – Búsqueda de disponibilidad

El sistema consulta la agenda real del negocio y busca combinaciones válidas según:

profesionales que pueden realizar cada servicio
disponibilidad de esos profesionales
disponibilidad de cabinas, salas o recursos
compatibilidad entre servicios
tiempo máximo de espera entre servicios

La clienta no elige profesional.
El sistema asigna automáticamente a la persona y recurso más adecuados según la disponibilidad real.

Paso 5 – Selección de día y hora

La clienta ve los bloques horarios globales disponibles y escoge uno.

La clienta solo ve:

día
hora de inicio
duración aproximada del bloque

No ve la asignación interna de profesionales o salas.

Paso 6 – Datos personales

La clienta introduce:

nombre y apellidos
teléfono
email
notas opcionales

También acepta:

condiciones de reserva
política de cancelación
Paso 7 – Resumen de reserva

El sistema muestra un resumen con:

servicios seleccionados
día y hora
duración estimada
importe total
señal online (20%)
importe restante a pagar en el centro
Paso 8 – Pago

La clienta realiza el pago de la señal.

Paso 9 – Confirmación

Si el pago es correcto:

la cita se registra en el CRM
los bloques horarios quedan ocupados
se genera la confirmación
se envía un email a la clienta

Si el pago falla:

la cita no se registra
la agenda no se bloquea
la reserva no existe dentro del sistema
3. Flujo del motor de reservas

El motor de reservas es la parte del sistema que decide qué huecos se pueden ofrecer a la clienta.

Su funcionamiento básico es el siguiente:

Recibe la lista de servicios seleccionados.
Consulta duración, precio, categoría y márgenes de cada servicio.
Identifica qué profesionales pueden realizar cada servicio.
Identifica qué sala, cabina o recurso necesita cada servicio.
Busca combinaciones posibles dentro de la agenda.
Ordena los servicios de forma óptima si es necesario.
Comprueba que no haya solapamientos.
Comprueba que la espera entre servicios no supere los 15 minutos.
Calcula los bloques globales válidos.
Devuelve a la clienta solo las opciones reservables reales.

El motor debe intentar siempre encontrar la combinación más eficiente y con menos esperas posible.

4. Flujo de entrada de una cita al CRM

Cuando una reserva se completa correctamente, el sistema debe hacer lo siguiente:

Crear o localizar la ficha de cliente.
Registrar la cita principal.
Registrar los bloques internos de servicio si la cita incluye varios servicios.
Asignar profesionales automáticamente.
Asignar salas, cabinas o recursos.
Registrar el importe total.
Registrar la señal pagada.
Registrar el importe pendiente de pagar en el centro.
Marcar el origen de la cita como “web”.
Actualizar el calendario del CRM.

De esta manera, la agenda pública y la agenda interna quedan sincronizadas.

5. Flujo de creación manual de cita por parte del admin

El panel de administración también debe permitir crear citas que no vienen de la web, por ejemplo:

citas telefónicas
citas presenciales
reservas gestionadas manualmente

El flujo sería:

El admin entra al panel.
Accede al calendario o al módulo de citas.
Busca un cliente existente o crea uno nuevo.
Selecciona uno o varios servicios.
Asigna manualmente:
fecha
hora
profesional
sala o recurso
Guarda la cita.
La agenda se actualiza automáticamente.

Estas citas tendrán como origen:

teléfono
presencial
admin
6. Flujo de modificación de cita por parte del admin

El admin debe poder modificar completamente cualquier cita existente.

Las acciones posibles serán:

cambiar fecha
cambiar hora
cambiar profesional
cambiar sala o recurso
añadir o quitar servicios
reordenar servicios
cambiar notas
cambiar estado de la cita

Flujo:

El admin abre la cita desde el calendario o el listado.
Revisa la información actual.
Realiza los cambios necesarios.
El sistema valida que la nueva combinación sea posible.
Guarda los cambios.
La agenda se actualiza automáticamente.
7. Flujo de cancelación de cita

Una cita puede cancelarse desde el panel de administración.

Cancelación por parte de la clienta

En la versión inicial, la clienta no cancela desde la web.
Debe contactar con el centro por teléfono o WhatsApp.

El personal del centro será quien gestione la cancelación desde el CRM.

Regla de cancelación
si la cancelación se comunica con al menos 48 horas de antelación, podrá aplicarse devolución según la política del centro
si la cancelación se realiza con menos de 48 horas, la señal no será reembolsable
si la clienta no acude a la cita, se pierde la señal
Flujo
El admin abre la cita.
Cambia el estado a cancelada.
El sistema libera profesionales y recursos.
Si procede, se registra devolución o no devolución.
La agenda vuelve a mostrar ese hueco como disponible.
8. Flujo de reprogramación de cita

Cuando una cita necesita cambiarse de fecha u hora:

El admin abre la cita.
Consulta nuevas opciones disponibles.
Selecciona nueva fecha y hora.
Si hace falta, cambia también profesional o recurso.
Guarda la nueva asignación.
La cita queda marcada como reprogramada o actualizada.
La agenda se sincroniza con el cambio.
9. Flujo de realización de cita

Cuando la clienta acude al centro y se realiza el servicio:

El admin abre la cita o la localiza desde el calendario del día.
Marca la cita como realizada.
Registra, si hace falta, el pago restante realizado en el centro.
Puede añadir notas internas sobre la sesión.
La cita pasa al historial de la clienta.
10. Flujo de pagos
Pago online de señal
se realiza durante la reserva web
representa el 20% del total
confirma la reserva
si falla, la cita no se crea
Pago restante en el centro
se realiza presencialmente el día de la cita
el admin podrá marcarlo como cobrado desde el panel
Devoluciones
el admin podrá registrar devoluciones totales o parciales
la devolución dependerá de la política de cancelación aplicada
11. Flujo de sincronización de agenda

La agenda del CRM será la agenda real del negocio.

Eso significa que:

las reservas online confirmadas deben bloquear huecos automáticamente
las citas creadas manualmente por el admin deben aparecer en el calendario
las cancelaciones deben liberar huecos
las modificaciones deben mover la ocupación real de profesionales y recursos

La agenda pública de reservas debe consultar siempre la disponibilidad real del CRM para evitar solapamientos o citas imposibles.

12. Principios operativos del sistema

El sistema funcionará bajo estas reglas:

sin pago no hay cita registrada
la clienta no elige profesional
el sistema asigna automáticamente según disponibilidad
el admin puede modificar cualquier cita manualmente
la agenda del CRM es la fuente de verdad del negocio
la web pública solo mostrará huecos realmente reservables
los cambios y cancelaciones de la clienta se gestionan manualmente en la versión inicial