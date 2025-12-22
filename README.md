# TrucksterSingh - A Smart Truck Loading Optimization Platform

## Table of Contents

- [Introduction](#introduction)
- [Acknowledgement](#acknowledgement)
- [Deployment Link](#deployment-link)
- [Demo Video](#demo-video)
- [Test Emails](#test-emails)
- [Website Screenshots](#website-screenshots)
- [Frontend Documentation](#frontend-documentation)
  - [Tech Stack](#tech-stack)
  - [Architecture Overview](#architecture-overview)
  - [Key Features](#key-features)
  - [UX & Validation Principles](#ux--validation-principles)
  - [Environment Configuration](#environment-configuration)
- [Backend Documentation](#backend-documentation)
  - [Tech Stack](#tech-stack-1)
  - [Architecture Overview](#architecture-overview-1)
  - [Core Domains](#core-domains)
    - [Authentication & User Management](#authentication--user-management)
    - [Warehouse Management](#warehouse-management)
    - [Shipment Management](#shipment-management)
    - [Optimization Concept](#optimization-concept)
    - [Truck Dealer & Truck Management](#truck-dealer--truck-management)
  - [Validation & Error Handling](#validation--error-handling)
  - [Security Considerations](#security-considerations)
  - [API Design Principles](#api-design-principles)
- [Authentication APIs](#authentication-apis)
- [User APIs](#user-apis)
- [Warehouse APIs](#warehouse-apis)
- [Shipment APIs](#shipment-apis)
- [Truck Dealer APIs](#truck-dealer-apis)
- [Truck APIs](#truck-apis)
- [Notes](#notes)


## Introduction

Truckster-Singh is a logistics and fleet management platform designed to streamline shipment planning, truck assignment, and delivery tracking between warehouses and truck dealers. The system enforces structured shipment lifecycles, supports capacity-based optimization, and provides operational insights through real-time analytics and dashboards.

## Acknowledgement

This project was built as part of a Flipr Labs 30.1 (Fullstack Web Development) - Smart Truck Loading Optimization System hackathon focused on solving real-world logistics challenges. The idea behind *Truckster-Singh* comes from a simple but common problem we see everywhere — trucks running half-empty due to poor coordination between warehouses and truck dealers.

The hackathon gave us the opportunity to think beyond just building an app and instead focus on efficiency, optimization, and impact. It pushed us to design a system that improves truck utilization, reduces unnecessary trips, and promotes smarter logistics decisions, while still keeping the workflows practical and easy to use.

We’re grateful to **Flipr Labs** for creating this challenge and providing a platform that encouraged hands-on problem-solving, creativity, and learning through building.

## Deployment Link: 
[https://truckster-singh.vercel.app](https://truckster-singh.vercel.app)

## Demo Video:
[https://drive.google.com/file/d/1JegYYDjkrmePKibuW9RqR5MwqISl0W0k/view?usp=drive_link](https://drive.google.com/file/d/1JegYYDjkrmePKibuW9RqR5MwqISl0W0k/view?usp=drive_link)

## Website Screenshots:
<img width="1920" height="946" alt="Screenshot from 2025-12-22 12-48-40" src="https://github.com/user-attachments/assets/f8aca6ff-cdc0-4135-9b24-131d679fad0d" />

<img width="1920" height="946" alt="Screenshot from 2025-12-22 12-48-47" src="https://github.com/user-attachments/assets/5a31fbad-fd88-4c6b-b734-ff2b83b98d66" />

<img width="1920" height="946" alt="Screenshot from 2025-12-22 12-49-12" src="https://github.com/user-attachments/assets/a32df989-68c3-4f3f-886b-3a27ef621abe" />

<img width="1920" height="946" alt="Screenshot from 2025-12-22 12-49-23" src="https://github.com/user-attachments/assets/3a19cb1c-9e9a-4952-930e-741b61f19541" />

<img width="1920" height="946" alt="Screenshot from 2025-12-22 12-49-45" src="https://github.com/user-attachments/assets/13c8607a-bd9e-48e9-bc74-adc3ce256ace" />

## Test Emails:
- **Warehouse User**: {email: mtalons123@gmail.com, password: Test@123}
- **Truck Dealer**: {email: ujjawalgusain31@gmail.com, password: Test@123}

## Frontend Documentation

The Truckster-Singh frontend is a React-based web application built to provide a clean, role-driven interface for warehouse users and truck dealers. It focuses on shipment lifecycle management, truck assignment, and operational visibility while enforcing backend business rules at the UI level.

### Tech Stack
- **React** (Vite) for fast development and optimized builds  
- **Tailwind CSS** for utility-first, consistent styling  
- **Axios** for API communication  
- **React Icons** for UI actions and indicators  

### Architecture Overview
- **Component-based structure**: Each business feature (Shipments, Trucks, Warehouses) is isolated into reusable components.
- **API abstraction**: All backend endpoints are centralized in `apis.js` for consistency and maintainability.
- **Protected API access**: Authenticated requests use `privateApi` with cookies enabled.
- **State-driven UI**: Local state and lifted state are used to control modals, filters, pagination, and optimistic updates.

### Key Features
- **Authentication Flow**
  - Signup, login, OTP verification, and logout.
  - Session-based authentication handled via HTTP-only cookies.

- **Shipment Management**
  - Create, list, filter, update, and delete shipments.
  - Status transitions are strictly controlled (one-step progression only).
  - UI prevents illegal actions (e.g., skipping statuses, booking without truck assignment).
  - Update and delete actions are handled via modal components.

- **Shipment Optimization**
  - “Optimization” represents readiness for booking based on capacity and feasibility checks.
  - Optimized shipments can move to booking with mandatory truck assignment.

- **Truck Management**
  - Truck dealers can create, update, and delete trucks.
  - Truck availability and stats are reflected in dashboards.

- **Best-Fit Truck Calculator**
  - Allows warehouse users to calculate the most suitable truck based on shipment constraints (weight, volume, boxes).
  - Ensures better utilization and reduced operational inefficiencies.

- **Dashboards & Analytics**
  - Shipment statistics and KPIs for warehouses.
  - Truck utilization and performance metrics for truck dealers.

### UX & Validation Principles
- Backend rules are mirrored on the frontend to prevent invalid actions.
- Errors returned from the backend are surfaced clearly to users.
- Destructive actions (delete, critical updates) require explicit user confirmation.

### Environment Configuration
- API base URL is configured using environment variables:
  ```env
  VITE_API_BASE_URL=<backend_base_url>
  ```

## Backend Documentation

The Truckster-Singh backend is a Node.js–based REST API designed to handle shipment lifecycle management, truck operations, and role-based workflows for warehouses and truck dealers. It enforces strict business rules, transactional integrity, and state transitions to ensure operational correctness.

### Tech Stack
- **Node.js** with **Express.js** for RESTful APIs  
- **MongoDB** with **Mongoose** for data persistence  
- **JWT + HTTP-only cookies** for authentication  
- **Yup** for request validation  
- **Mongoose Transactions (Sessions)** for atomic updates  

### Architecture Overview
- **Modular structure**: Controllers, models, routes, and validations are separated by domain.
- **Role-based access**: Warehouse users and truck dealers have clearly scoped permissions.
- **Centralized validation**: All incoming payloads are validated using Yup schemas.
- **Transactional safety**: Critical operations (shipment updates, booking, status changes) run inside MongoDB transactions.

### Core Domains

#### Authentication & User Management
- User signup, login, OTP verification, and logout.
- Secure session handling using cookies.
- `/api/user/me` provides authenticated user context for frontend role-based rendering.

#### Warehouse Management
- Create and list warehouses.
- Fetch warehouse-level shipment statistics.
- Perform shipment optimization and best-fit truck calculations.

#### Shipment Management
- Create, read, update, and delete shipments.
- Shipments follow a **strict state machine**: PENDING → OPTIMIZED → BOOKED → IN-TRANSIT → DELIVERED

- Status transitions:
- Only one-step progression is allowed.
- Delivered shipments are immutable.
- Booking requires a valid truck ID.
- Shipment updates are executed inside transactions to ensure consistency.
- Shipment events are logged on every valid status change for traceability.

#### Optimization Concept
- “OPTIMIZED” indicates that a shipment has passed feasibility checks
(capacity, volume, constraints) and is ready to be booked.
- Optimization does not assign a truck; it only validates readiness.

#### Truck Dealer & Truck Management
- Truck dealers can onboard themselves and manage fleets.
- Create, update, delete, and list trucks.
- Truck statistics and KPIs support operational visibility.
- Trucks are validated during booking to ensure existence and correctness.

### Validation & Error Handling
- Yup schemas validate request bodies before any DB operation.
- Clear, deterministic error messages for:
- Invalid status transitions
- Missing required fields (e.g., truckId during booking)
- Non-existent resources
- Transactions are aborted on any failure to prevent partial updates.

### Security Considerations
- Protected routes require authentication middleware.
- Cookies are used instead of local storage for session security.
- Backend remains the final authority even if frontend validation fails.

### API Design Principles
- RESTful conventions for CRUD operations.
- Predictable request/response formats.
- Business logic is never delegated to the client.

The backend acts as the single source of truth for shipment state, optimization rules, and truck assignments, ensuring the Truckster-Singh platform remains consistent, secure, and scalable.




## Authentication APIs

### POST /api/auth/signup
Registers a new user into the system.  
Accepts user details and initiates the authentication flow.

### POST /api/auth/login
Authenticates a user using credentials.  
Returns authentication cookies or tokens on successful login.

### POST /api/auth/verify-otp
Verifies the OTP sent to the user during signup or login.  
Completes the authentication process.

### POST /api/auth/logout (Protected)
Logs out the currently authenticated user.  
Clears authentication session or cookies.

---

## User APIs

### GET /api/user/me (Protected)
Fetches details of the currently logged-in user.  
Used to determine user role and session validity.

---

## Warehouse APIs

### GET /api/warehouse/get-warehouses (Protected)
Retrieves all warehouses accessible to the authenticated user.  
Used for warehouse selection and dashboards.

### POST /api/warehouse/create (Protected)
Creates a new warehouse with provided metadata.  
Accessible only to authorized users.

### POST /api/warehouse/best-fit-truck (Protected)
Computes the best-fit truck for a shipment based on constraints.  
Used during shipment planning and optimization.

### POST /api/warehouse/best-fit-calculator (Protected)
Performs load and capacity calculations without booking.  
Returns feasibility and utilization metrics.

### POST /api/warehouse/booked-email (Protected)
Triggers an email notification after a shipment is booked.  
Used for operational alerts and confirmations.

### GET /api/warehouse/shipment-stats (Protected)
Returns shipment statistics for a warehouse.  
Supports analytics and dashboard KPIs.

---

## Shipment APIs

### POST /api/shipment (Protected)
Creates a new shipment in the PENDING state.  
Stores shipment metadata for further optimization and booking.

### GET /api/shipment (Protected)
Fetches all shipments accessible to the user.  
Supports filtering and listing in dashboards.

### PATCH /api/shipment (Protected)
Updates shipment details such as deadline or status.  
Enforces strict state transitions (OPTIMIZED → BOOKED → IN-TRANSIT → DELIVERED).

### DELETE /api/shipment/:shipmentId (Protected)
Deletes a shipment by ID.  
Allowed only when the shipment is not already delivered.

---

## Truck Dealer APIs

### POST /api/truck-dealer/sign (Protected)
Registers the authenticated user as a truck dealer.  
Initializes dealer-specific profile and permissions.

### GET /api/truck-dealer (Protected)
Fetches truck dealer profile information.  
Used to validate dealer onboarding status.

### GET /api/truck-dealer/dashboard-kpi (Protected)
Returns KPI metrics for the truck dealer dashboard.  
Includes booking, utilization, and performance data.

### GET /api/truck-dealer/:truckDealerId (Protected)
Fetches trucks associated with a specific truck dealer.  
Used by warehouse users during truck assignment.

---

## Truck APIs

### POST /api/truck/create-many (Protected)
Creates multiple trucks in a single request.  
Used for bulk onboarding of fleet data.

### DELETE /api/truck/:truckId (Protected)
Deletes a truck by ID.  
Restricted based on truck status and assignments.

### PATCH /api/truck/:truckId (Protected)
Updates truck details such as capacity or availability.  
Does not allow updates when the truck is actively assigned.

### GET /api/truck/truck-stats/:truckDealerId (Protected)
Returns statistical data for trucks under a dealer.  
Supports analytics on fleet utilization and performance.

---

## Notes

- All protected APIs require authentication using a valid session.
- Shipment status transitions are strictly enforced server-side.
- Backend validations are authoritative; frontend checks exist only for user guidance.
