# PharmaTech

PharmaTech is a modern, high-performance web application designed to streamline and automate daily pharmacy operations. It provides an end-to-end management workflow covering sales and purchase invoices, inventory tracking, customer debt management, and real-time cash flow analytics with intuitive visual charts.

## Features

* **Cash Box & Financial Analytics:** Live tracking of liquid assets, daily income vs. expenses, and transaction logs broken down by week or month using interactive charts.
* **Smart Inventory & Stock Management:** Instant inventory updates synchronized with every purchase invoice, sales receipt, and return voucher.
* **Strict Client-Side Validation:** High-performance form handling backed by zero-re-render form controllers and Zod schema enforcement.
* **Dark / Light Mode Support:** Modern UI designed with Tailwind CSS and Shadcn UI, offering a fully themed interface tailored for high-contrast visibility.
* **Sales & Purchase Management:** Create, manage, and track sales invoices, purchase invoices, and return vouchers through a streamlined workflow.
* **Customer Debt Management:** Track customer balances, outstanding debts, payments, and transaction history.
* **Real-Time Dashboard:** Get an overview of key pharmacy metrics, financial activity, inventory status, and recent transactions.
* **Responsive Design:** Fully responsive interface optimized for desktop, tablet, and mobile devices.
* **Internationalization:** Multi-language support powered by i18next, making the application easy to adapt to different languages and regions.

## Tech Stack

* **Core Framework:** React, TypeScript, Vite
* **State Management & Data Fetching:** TanStack Query (React Query), Axios
* **Forms & Schema Validation:** React Hook Form, Zod
* **UI & Styling:** Tailwind CSS, Shadcn UI, Lucide Icons
* **Data Visualization:** Recharts
* **Localization:** i18next, react-i18next
* **Backend Integration:** RESTful API (Laravel)

## Project Structure

```text
src/
├── components/        # Reusable UI components
├── features/          # Feature-specific modules
├── hooks/             # Custom React hooks
├── lib/               # Shared utilities and configurations
├── pages/             # Application pages
├── services/          # API and backend service integrations
├── types/             # TypeScript type definitions
├── locales/           # Translation files
├── App.tsx            # Application root
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm, pnpm, or yarn
* Access to the PharmaTech Laravel REST API

### Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd pharmatech
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the required environment variables:

```env
VITE_API_URL=http://localhost:8000/api
```

> Adjust the API URL according to your Laravel backend configuration.

### Run the Development Server

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint and check the codebase    |

## Architecture

PharmaTech follows a feature-oriented architecture designed to keep the application scalable and maintainable.

The frontend communicates with the Laravel backend through a RESTful API. TanStack Query handles server-state management, caching, synchronization, and asynchronous data fetching, while React Hook Form and Zod provide performant and type-safe form validation.

The application is organized around pharmacy workflows such as:

```text
Dashboard
   │
   ├── Cash Box & Analytics
   │
   ├── Sales
   │    ├── Sales Invoices
   │    └── Sales Returns
   │
   ├── Purchases
   │    ├── Purchase Invoices
   │    └── Purchase Returns
   │
   ├── Inventory
   │    ├── Products
   │    ├── Stock
   │    └── Inventory Movements
   │
   └── Customers
        ├── Customer Accounts
        ├── Debts
        └── Payments
```

## Data Flow

A core principle of PharmaTech is keeping financial and inventory data synchronized with business operations.

For example, when a purchase invoice is created:

```text
Purchase Invoice
       │
       ├── Update Product Stock
       │
       ├── Record Financial Transaction
       │
       └── Update Supplier Balance
```

Likewise, a completed sale updates the relevant inventory, cash flow, and customer balance when applicable.

## Validation & Error Handling

Forms are validated on the client side using **Zod** schemas and **React Hook Form**. This provides:

* Type-safe form validation
* Consistent validation rules
* Reduced unnecessary re-renders
* Immediate user feedback
* Clear and reusable error messages

Server-side validation errors returned by the Laravel API should also be handled consistently and presented to the user through the application UI.

## Theming

PharmaTech supports both **Light** and **Dark** themes.

The UI is built with Tailwind CSS and Shadcn UI, allowing components to maintain a consistent design system while remaining customizable and accessible.

## Localization

Internationalization is handled through **i18next** and **react-i18next**.

Translation resources are organized separately from application logic, making it easier to add new languages without modifying the underlying components.

Example:

```text
locales/
├── en/
│   └── en.json
└── ar/
    └── ar.json
```

## API Integration

The frontend communicates with the Laravel backend through RESTful endpoints.

A typical API flow looks like:

```text
React Component
      │
      ▼
TanStack Query
      │
      ▼
API Service / Axios
      │
      ▼
Laravel REST API
      │
      ▼
Database
```

Keeping API communication separated from UI components makes the application easier to test, maintain, and extend.

## Performance

PharmaTech is designed with performance in mind:

* Server-state caching through TanStack Query
* Minimal unnecessary component re-renders
* Efficient form state management
* Component-based UI architecture
* Lazy loading where appropriate
* Optimized production builds through Vite

## Security

Authentication and authorization are handled through the backend API. The frontend should never be considered a trusted security boundary.

All sensitive operations must be validated and authorized by the Laravel backend, including:

* User permissions
* Financial transactions
* Inventory modifications
* Customer balance changes
* Invoice operations

## Production Build

Create an optimized production build with:

```bash
npm run build
```

The generated files can then be served by a production web server or deployed to a suitable hosting platform.


**PharmaTech** — Modern pharmacy management, simplified.
