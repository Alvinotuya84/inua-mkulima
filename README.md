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
- **UI Framework**: Material UI
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
   git clone https://github.com/Alvinotuya84/inua-mkulima.git
   cd inua-mkulima
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   VITE_API_BASE_URL=https://dummyjson.com
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
│── routes/
│   │── AppRouter.tsx        # Main router configuration
│   │── ProtectedRoute.tsx   # Protected route wrapper component
│   │── routes.ts            # Route definitions
│
│── pages/
│   │── Login.tsx            # Two-step login page
│   │── Dashboard.tsx        # Main dashboard
│   │── ProductDetails.tsx   # Product selection and subsidy application
│   │── Summary.tsx          # Transaction summary and confirmation
│   │── Receipt.tsx          # Transaction receipt
│   │── Reports.tsx          # Reporting tools
│   │── Transactions.tsx     # Transaction history
│   │── NotFound.tsx         # 404 page
│
│── layouts/
│   │── MainLayout.tsx       # Layout for authenticated pages
│   │── AuthLayout.tsx       # Layout for authentication pages
│
│── components/
│   │── ui/                  # UI components
│   │── common/              # Shared components
│
│── hooks/
│   │── useAuth.ts           # Authentication logic
│   │── useProducts.ts       # Product management
│   │── useTransactions.ts   # Transaction processing
│   │── useToast.ts          # Toast notifications
│
│── utils/
│   │── fetch.utils.ts         # API utility functions
│   │── auth-utils.ts        # Authentication utilities
│   │── format.utils.ts      # Formatting helpers
│
│── stores/
│   │── user.stores.ts       # User and authentication state
│   │── cart.stores.ts       # Shopping cart state
│
│── constants/
│   │── network.ts           # API URLs and constants
│
│── types/
│   │── api.types.ts         # API response types
│   │── user.types.ts        # User related types
│   │── product.types.ts     # Product related types
│
│── providers/
│   │── QueryProvider.tsx    # React Query provider
│
│── App.tsx                  # Main app component
│── main.tsx                 # Application entry point
```

## Usage

### Login

The application uses a two-step login process:

1. Enter your username and click "Continue"
2. Enter your password and click "Sign In"

For testing, use the following credentials:

- Username: `emilys` or `admin`
- Password: `emilyspass` or `adminpass`

### Dashboard

The dashboard provides an overview of recent transactions, wallet balance, and quick access to key functions. From here, you can:

- Start a new transaction
- View transaction history
- Access reports

### Processing a Transaction

1. Click "New Transaction" from the dashboard
2. Select products from the available list
3. Adjust quantities and subsidy amounts as needed
4. Click "Proceed" to review the transaction
5. Verify the transaction details and click "Pay"
6. Enter the verification code sent to the farmer
7. Complete the transaction and download the receipt

## API Integration

The application is designed to work with a REST API backend. Key endpoints include:

- `/auth/login` - User authentication
- `/products` - List available products
- `/transactions` - Process and retrieve transactions
- `/reports` - Generate and retrieve reports

For development purposes, mock data is provided for demonstration.

## Customization

### Styling

The application uses a combination of Material UI styling and Tailwind CSS. The primary colors are:

- Primary green: `#355E3B` (used for headers and primary elements)
- Secondary gold: `#E0B643` (used for buttons and call-to-action elements)

These can be adjusted in the theme configuration in `App.tsx`.

### Adding New Pages

1. Create a new component in the `pages` directory
2. Add the route definition in `routes.ts`
3. Update `AppRouter.tsx` if needed

## Troubleshooting

### Common Issues

1. **Date picker import errors**

   - Solution: The project uses Shadcn UI components for date picking to avoid compatibility issues with MUI date pickers

2. **Authentication failures**

   - Ensure you're using the correct test credentials
   - Check that your API URL is correctly configured in the `.env` file

3. **Build errors related to Tailwind**
   - Run `npm run build:css` to regenerate the Tailwind styles

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact:

- Email: support@inua-mkulima.com
- Website: [www.inua-mkulima.com](https://www.inua-mkulima.com)
