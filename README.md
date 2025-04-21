Below is a refined version of the README file for the **Mini Role-Based Construction App**. The updated version is concise, well-organized, and polished to enhance clarity and professionalism while maintaining all critical details. It includes corrections to inconsistencies (e.g., Firebase vs. Vercel deployment), improves formatting, and ensures alignment with the project's requirements and tech stack.

---

# Mini Role-Based Construction App

A role-based platform built with [Next.js](https://nextjs.org) enabling users to register and log in as **Buyer**, **Vendor**, or **Rider**, each accessing a role-specific dashboard. The app features authentication, protected routes, a simple UI, and vendor product listing capabilities.

## Features

- **Role-Based Authentication**:
  - Register as Buyer, Vendor, or Rider.
  - Secure login/logout functionality.
  - Protected dashboard routes by role.
- **Dashboards**:
  - **Buyer**: Marketplace access.
  - **Vendor**: Product listing management.
  - **Rider**: Delivery schedule view.
- **Additional Features**:
  - API for Vendors to create and view product listings.
  - User data stored in Firebase.

## Tech Stack

- **Frontend/Backend**: Next.js with React, styled with [Tailwind CSS](https://tailwindcss.com).
- **Database/Backend**: Firebase (Firestore for database, Firebase Authentication).
- **Font Optimization**: Uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to load [Geist](https://vercel.com/font) from Vercel.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, pnpm, or bun
- Firebase account for database and authentication
- (Optional) Vercel or Firebase Hosting account for deployment

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Richard-Raph/masterpiece-construction.git
   cd masterpiece-construction
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add Firebase configuration and other variables:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
     NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
     ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Project Structure

- **Frontend**: Pages in `pages/` (e.g., `pages/index.tsx` for homepage, `pages/api/` for API routes).
- **Backend**: API routes in `pages/api/` (e.g., `pages/api/auth/[...nextauth].ts` for authentication).
- **Dashboards**: Role-specific dashboards in `pages/dashboard/[role].tsx`.
- **Database**: Firebase configuration in `lib/firebase.ts`.

## Usage

1. **Register**: Select a role (Buyer, Vendor, Rider) and create an account.
2. **Login**: Access your role-specific dashboard.
3. **Explore Dashboards**:
   - **Buyer**: Browse the marketplace.
   - **Vendor**: Create and manage product listings via API.
   - **Rider**: View delivery schedules.
4. **Logout**: Sign out securely.

## API Routes

- **Authentication**: `/api/auth/[...nextauth]` handles login, logout, and role-based access.
- **Vendor Product Listing**:
  - `POST /api/products/create`: Create a product listing.
    ```bash
    POST /api/products/create
    Content-Type: application/json
    {
      "name": "Sample Product",
      "price": 29.99,
      "description": "my product",
      "vendorId": "<user-id>"
    }
    ```
  - `GET /api/products`: Retrieve product listings.

## Deployment

The app is deployed on Firebase Hosting (or Vercel, if applicable). To deploy your own:

1. Push code to a GitHub repository.
2. For Firebase Hosting:
   - Install Firebase CLI: `npm install -g firebase-tools`.
   - Login: `firebase login`.
   - Initialize hosting: `firebase init hosting`.
   - Deploy: `firebase deploy`.
3. For Vercel:
   - Connect the repository via the [Vercel Dashboard](https://vercel.com/new).
   - Configure environment variables.
   - Deploy and access the live URL.

**Live Demo**: [Insert live demo link here]

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and APIs.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - Interactive tutorial.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Styling with Tailwind.
- [Firebase Documentation](https://firebase.google.com/docs) - Firebase setup and usage.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Feedback and contributions.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.