# Clarisign Frontend

### Implementation of a Secure Digital Signature System with Custom KMS and Envelope Encryption Architecture

Clarisign is a web-based digital signature application that provides a secure interface for document management, signing workflows, and document verification.

This repository contains the **frontend application** of the Clarisign digital signature system. It provides the user interface and communicates with the backend and supporting services through configured API endpoints.

The backend API, Custom Key Management System (KMS), digital signing service, and supporting services are maintained in separate repositories.

---

## Technology Stack

- **Next.js**
- **React**
- **TypeScript**
- **Node.js 22 LTS**

---

## Prerequisites

Before running the project, make sure the following software is installed:

- [Node.js 22 LTS](https://nodejs.org/)
- Git
- One of the following package managers:
  - npm
  - Yarn
  - pnpm
  - Bun

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Samuelthoma/Clarisign-FE.git
cd Clarisign-FE
```

### 2. Configure Environment Variables

The repository provides an `.env.example` file containing the required environment variables.

Copy the example file to create your local environment configuration:

```bash
cp .env.example .env.local
```

The default configuration is:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
NEXT_PUBLIC_FAST_API_BASE_URL=http://localhost:8000
SIGN_API_INTERNAL_URL=http://127.0.0.1:8081
```

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the Clarisign Backend API | `http://localhost:8081` |
| `NEXT_PUBLIC_FAST_API_BASE_URL` | Base URL for the FastAPI supporting service | `http://localhost:8000` |
| `SIGN_API_INTERNAL_URL` | Internal URL used for communication with the signing API | `http://127.0.0.1:8081` |

Update the values in `.env.local` according to your local or deployment environment.

> **Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. Do not store secrets, private keys, credentials, or other sensitive information in these variables.

Do not commit `.env.local` or other environment-specific configuration files containing sensitive information to the repository.

### 3. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

Or using Yarn:

```bash
yarn install
```

Or using Bun:

```bash
bun install
```

### 4. Run the Application

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run the project's linting checks |

---

## Development Environment

For local development, the frontend communicates with the following services by default:

| Service | URL |
|---|---|
| Clarisign Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8081` |
| FastAPI Service | `http://localhost:8000` |
| Signing API (Internal) | `http://127.0.0.1:8081` |

The backend and supporting services must be running for functionality that depends on API communication.

---

## Application Architecture

The frontend acts as the primary user interface for the Clarisign platform.

```text
                         ┌─────────────────────┐
                         │   Clarisign Web     │
                         │      Frontend       │
                         │       Next.js       │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │  Backend API │  │   FastAPI    │  │  Signing API │
          │              │  │   Service    │  │   (Internal) │
          └──────────────┘  └──────────────┘  └──────────────┘
                                   
                  Other platform services are
                  maintained in separate repositories.
```

The frontend repository is responsible only for the web application and its client/server-side application logic. Cryptographic key management and digital signing infrastructure are handled by separate services.

---

## Development Workflow

For local development:

1. Clone the repository.
2. Copy `.env.example` to `.env.local`.
3. Configure the required environment variables.
4. Install the project dependencies.
5. Make sure the required backend and supporting services are running.
6. Start the Next.js development server.
7. Open the application at `http://localhost:3000`.

Example:

```bash
git clone https://github.com/Samuelthoma/Clarisign-FE.git
cd Clarisign-FE

cp .env.example .env.local

npm install
npm run dev
```

---

## Related Services

The Clarisign platform consists of multiple independently maintained repositories.

This repository contains the **frontend application** only.

Other components include:

- Backend API
- Custom Key Management System (KMS)
- Digital Signing Service
- FastAPI supporting service

Each service has its own installation, configuration, and deployment requirements.

---

## Team

**Clarisign Team**

---

## Project

**Implementation of a Secure Digital Signature System with Custom KMS and Envelope Encryption Architecture**