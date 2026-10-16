# QueueLess

QueueLess is a web app for joining service queues online. Customers can take a token and follow their place in line, while administrators manage services, serve customers, and review queue outcomes.

**Live demo:** [queue-less-react.vercel.app](https://queue-less-react.vercel.app/)

## Features

### Customer

- Register and sign in with email and password.
- Browse open services and join a queue.
- View a token, queue position, and estimated wait on **My Queue**.
- Leave a queue while it is still waiting.
- Enable browser buzz notifications for queue start, two people ahead, and one person ahead.

### Administrator

- Monitor live service and queue activity from the dashboard.
- Create, edit, open, close, and delete services.
- Start serving, serve the next customer, skip, or mark a customer as a no-show.
- Expand and scroll through waiting customers within each queue card.
- Filter queue reports by service and date, and export the results to a formatted Excel workbook.
- Open the customer-facing site from the dashboard to preview the user experience.

## Technology

- React 19 and Vite
- React Router
- Firebase Authentication and Cloud Firestore
- Tailwind CSS
- `xlsx-js-style` for formatted Excel exports

## Run locally

### Requirements

- Node.js and npm
- A Firebase project with Email/Password Authentication and Cloud Firestore enabled

### Install dependencies

```bash
git clone https://github.com/bhushank45/QueueLess.git
cd QueueLess
npm install
```

### Configure Firebase

Copy `.env.example` to `.env.local` and fill in the Firebase web app configuration values:

```bash
cp .env.example .env.local
```

Set these variables in `.env.local`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Use the web app configuration from **Firebase Console → Project settings → General → Your apps**. Configure Firestore security rules for the app before using real accounts or data. The Firebase web configuration is public client configuration; never put service account credentials or other private secrets in `VITE_*` variables.

To use the admin area, sign in with an account whose Firestore profile at `users/{uid}` has `role` set to `admin`. Set up the account and its permissions in Firebase Console according to your security rules.

### Start the development server

```bash
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

## Notifications

Buzz alerts use browser notifications and vibration where supported. The customer must grant notification permission and keep the **My Queue** page open to receive live queue alerts. This is a demo feature; it does not use Firebase Cloud Messaging and does not send notifications when the website is closed. Browser notifications require a secure context, such as HTTPS or localhost.

## Deploy

The app is configured for Vercel, including a rewrite for client-side routes. When deploying, add the six `VITE_FIREBASE_*` variables from above to the Vercel project environment settings. Add the deployed site domain to Firebase Authentication's authorized domains.

## Available scripts

```bash
npm run dev      # Start the local development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```
