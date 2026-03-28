# AGENTS.md

## Project name

Glow Up Studio

## Project overview

Glow Up Studio is a professional beauty center web application that combines:

- a public-facing marketing website
- an online booking system
- an internal CRM / admin panel

The system must allow clients to browse services, book one or more treatments online, pay a booking deposit, and receive confirmation.  
The internal admin panel must allow staff to manage clients, appointments, professionals, rooms/resources, payments, and refunds.

This repository is being developed progressively, starting from a public website already built with HTML, CSS, JavaScript, and Vite, and evolving into a full booking + CRM application.

---

## Product goals

The project must support these business goals:

- maintain a premium public-facing beauty center website
- allow online booking with automatic staff/resource assignment
- use the CRM calendar as the real source of availability
- avoid unpaid bookings blocking the schedule
- allow complete manual override from the admin panel
- support future growth toward a more complete product

---

## Core business rules

Always respect these rules when generating code, planning features, or editing files:

1. A booking is created only after successful payment.
2. If payment fails, no booking must be stored and no slot must be blocked.
3. The client does not choose the professional.
4. The system assigns professionals automatically based on service compatibility and availability.
5. The system also assigns required resources (rooms, cabins, manicure stations, machines, etc.).
6. The public booking flow must only show truly available slots.
7. The CRM calendar is the source of truth for the business schedule.
8. Admin users must be able to manually modify any appointment created automatically.
9. Multiple services may be included in the same booking.
10. The system may reorder services internally to optimize availability.
11. Maximum allowed waiting time between service blocks is 15 minutes.
12. Deposit for online booking is 20% of total price.
13. Cancellations with less than 48 hours notice are not refundable.
14. No-show implies loss of deposit.

---

## Existing documentation

Before implementing anything important, consult these files inside `docs/`:

- `vision-general.md`
- `flujo-sistema.md`
- `catalogo-servicios.md`
- `entidades-y-reglas.md`
- `architecture.md`
- `roadmap.md`

Use them as the source of truth for:

- business logic
- booking flow
- entities
- system architecture
- implementation phases

Do not invent business rules that contradict the documentation.

---

## Development priorities

Build the system in this order unless explicitly instructed otherwise:

1. Documentation and architecture
2. Admin login
3. Admin panel base layout
4. Clients module
5. Manual appointments module
6. CRM calendar
7. Booking engine
8. Online booking flow
9. Online payments
10. Confirmation emails
11. Future automations and improvements

Do not jump to advanced features before the foundations exist.

---

## Current project structure philosophy

This project is expected to evolve into separate concerns:

- public website
- booking flow
- admin CRM
- backend/API
- database layer
- shared utilities

Prefer clean, modular organization over dumping everything into a few files.

When creating new code, keep separation of concerns clear:

- UI rendering
- business logic
- API calls
- state handling
- data models

---

## Git and branch strategy

Use branches carefully and keep work scoped.

Main branch intentions:

- `main` → stable public website
- `docs-sistema-crm` → system documentation and architecture
- `crm` → admin panel
- `clientes` → clients module
- `reservas` → booking system
- `pagos` → payment-related work
- `mejoras-ui` → design refinements

When working on a task:

- respect the purpose of the current branch
- avoid unrelated edits
- do not refactor large unrelated areas without need
- do not mix documentation work with large code changes unless requested

---

## Code style principles

Follow these principles:

- prefer readability over cleverness
- use clear naming in English for code structures unless the existing file strongly uses Spanish
- keep functions focused and small
- avoid duplicated logic
- extract reusable helpers when repetition appears
- use consistent folder naming
- avoid unnecessary dependencies
- prefer explicit code over magic abstractions
- add comments only where they add real clarity

When possible:

- validate inputs
- handle edge cases
- fail safely
- keep code easy to extend

---

## Frontend guidance

The public side of the project must feel premium, elegant, modern, and clear.

UI goals:

- beauty clinic / premium aesthetics look and feel
- clean layout
- strong readability
- soft, elegant visual hierarchy
- mobile-friendly and responsive behavior
- consistent buttons, spacing, and typography

When editing UI:

- preserve the existing Glow Up Studio visual identity
- avoid harsh or generic dashboard aesthetics on the public side
- keep forms clean and user-friendly
- reduce friction in the booking flow

For admin UI:

- prioritize clarity, speed, and usability
- favor practical layouts over decorative ones
- make important actions obvious
- keep calendar and appointment workflows easy to understand

---

## Booking engine guidance

The booking engine is a critical part of the system.

It must:

- use service data from `catalogo-servicios.md`
- consider total service duration including margins
- consider professional compatibility
- consider resource availability
- allow up to 15 minutes waiting time between service blocks
- minimize waiting time whenever possible
- return only valid global slots

The client should only see:

- date
- start time
- total estimated duration
- selected services
- total price
- deposit amount
- remaining amount to pay in person

Do not expose internal assignment complexity unless explicitly requested.

---

## Admin panel guidance

The admin panel must support real business operations.

Required capabilities include:

- admin authentication
- dashboard
- clients list and detail
- manual appointment creation
- appointment editing
- appointment cancellation
- appointment rescheduling
- reassignment of professionals
- reassignment of resources
- payment visualization
- payment completion recording
- refund handling
- schedule control

Admin must be able to override automatic assignments.

---

## Data and modeling guidance

Model the system around these core entities:

- Client
- Service
- Professional
- Resource
- Appointment
- AppointmentBlock
- Payment
- AdminUser

Use the documentation files as the initial data modeling reference.

When implementing data structures:

- keep relationships explicit
- avoid ambiguous naming
- distinguish global appointment data from internal appointment blocks
- distinguish appointment state from payment state

---

## Payment logic guidance

Online booking requires a 20% deposit.

Rules:

- no successful payment → no appointment created
- successful payment → appointment created and schedule blocked
- remaining amount is paid in person
- refunds are managed from admin according to cancellation rules

Do not implement fake “pending bookings” that block schedule without payment unless explicitly requested later.

---

## Architecture and implementation guidance

Prefer a progressive implementation strategy.

When building features:

1. start with the simplest correct version
2. make it functional
3. keep it extensible
4. improve complexity later if needed

Do not overengineer the first implementation.

Examples:

- start with a clean admin layout before complex permissions
- start with basic booking slot generation before advanced optimization
- start with clear models before advanced automation

---

## When making changes

Before making substantial changes:

- inspect the relevant documentation
- understand the current branch purpose
- identify the minimum necessary change
- avoid unrelated edits

After making changes:

- keep the implementation consistent with the project documentation
- ensure naming remains coherent
- do not leave half-integrated features
- prefer incremental, reviewable progress

---

## Output expectations

When asked to implement something:

- explain what will be built
- keep the scope focused
- create files with clear names
- keep logic modular
- avoid breaking the stable public website
- prepare code that can realistically become part of a portfolio-quality project

This repository should evolve like a real product, not like a disposable prototype.
