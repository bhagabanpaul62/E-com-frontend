# E-Commerce Platform Frontend

This is the frontend for a full-featured e-commerce platform built with Next.js, featuring a complete shopping experience for customers and a comprehensive dashboard for administrators.

## Project Status

For a detailed overview of implemented features, recent improvements, and pending features, please see [PROJECT_STATUS.md](./PROJECT_STATUS.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

```
frontend/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── ui/             # Reusable UI components (buttons, inputs, etc.)
│   └── user/           # User-facing components (product cards, reviews, etc.)
├── lib/                # Utility functions and helpers
├── public/             # Static assets
├── redux/              # Redux state management
│   └── features/       # Redux slices for different features
└── src/
    └── app/            # Next.js app router pages
        ├── (user)/     # User routes (home, products, etc.)
        ├── admin/      # Admin routes (dashboard, product management, etc.)
        ├── login/      # Authentication routes
        └── sign-up/    # Registration routes
```

## Features

- **User Authentication**: Registration, login, password reset
- **Product Management**: Browsing, filtering, search, details
- **Shopping Cart**: Add, remove, adjust quantities
- **Wishlist**: Save products for later
- **Checkout Process**: Address selection, payment, order confirmation
- **Order Management**: Order history, tracking
- **User Profiles**: Personal information, addresses
- **Admin Dashboard**: Sales analytics, order management
- **Product Administration**: Add, edit, delete products
- **Category Management**: Create and manage product categories
- **Reviews System**: Rate and review products with star ratings

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for a complete list of implemented and pending features.
