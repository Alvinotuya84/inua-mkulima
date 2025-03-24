# Inua Mkulima Subsidy Program

## Overview

Inua Mkulima is a digital subsidy management platform designed to facilitate agricultural subsidies for farmers through agro-dealers. The platform enables agro-dealers to process transactions for farmers using preloaded digital wallets, allowing farmers to purchase essential agricultural products with subsidized rates.

The application offers a seamless interface for agro-dealers to manage product selections, process transactions, and generate receipts. It also provides comprehensive reporting and tracking capabilities for administrators.

## Features

- **Two-step Authentication**: Secure login process with separate username and password screens
- **Dashboard**: Overview of transactions, wallet balance, and key metrics
- **Product Management**: Browse and select from available agricultural products
- **Transaction Processing**: Apply subsidies to selected products
- **Receipt Generation**: Generate and download transaction receipts
- **Reporting**: Comprehensive reporting tools for tracking financial data
- **Mobile Responsive Design**: Works seamlessly on both desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, TypeScript
- **UI Framework**: Material UI, Shadcn UI components
- **State Management**: Zustand for global state
- **API Integration**: React Query for data fetching
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: JWT-based authentication flow
- **Styling**: Combination of Material UI styling and Tailwind CSS

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/inua-mkulima.git
   cd inua-mkulima
   ```
2. Install dependencies:

````bash
npm install
3. Run the development server:
```bash
npm run dev

````

src/
│── routes/
│ │── AppRouter.tsx # Main router configuration
│ │── ProtectedRoute.tsx # Protected route wrapper component
│ │── routes.ts # Route definitions
│
│── pages/
│ │── Login.tsx # Two-step login page
│ │── Dashboard.tsx # Main dashboard
│ │── ProductDetails.tsx # Product selection and subsidy application
│ │── Summary.tsx # Transaction summary and confirmation
│ │── Receipt.tsx # Transaction receipt
│ │── Reports.tsx # Reporting tools
│ │── Transactions.tsx # Transaction history
│ │── NotFound.tsx # 404 page
│
│── layouts/
│ │── MainLayout.tsx # Layout for authenticated pages
│ │── AuthLayout.tsx # Layout for authentication pages
│
│── components/
│ │── ui/ # Shadcn UI components
│ │── common/ # Shared components
│
│── hooks/
│ │── useAuth.ts # Authentication logic
│ │── useProducts.ts # Product management
│ │── useTransactions.ts # Transaction processing
│ │── useToast.ts # Toast notifications
│
│── utils/
│ │── api.utils.ts # API utility functions
│ │── auth-utils.ts # Authentication utilities
│ │── format.utils.ts # Formatting helpers
│
│── stores/
│ │── user.stores.ts # User and authentication state
│ │── cart.stores.ts # Shopping cart state
│
│── constants/
│ │── network.ts # API URLs and constants
│
│── types/
│ │── api.types.ts # API response types
│ │── user.types.ts # User related types
│ │── product.types.ts # Product related types
│
│── providers/
│ │── QueryProvider.tsx # React Query provider
│
│── App.tsx # Main app component
│── main.tsx # Application entry point

```

```
