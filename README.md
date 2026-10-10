# QueueLess

QueueLess is a web app for joining service queues online and tracking your place without waiting in a physical line. Customers can browse available services, take a queue token, and follow live queue updates. Staff can manage services and monitor waiting and currently served customers from an admin dashboard.

**Live demo:** [queue-less-react.vercel.app](https://queue-less-react.vercel.app/)

## Features

- Customer registration and sign-in with Firebase Authentication.
- Browse services and join a queue to receive a token.
- View the active queue and service updates in real time.
- Admin dashboard with queue and service management.
- Role-protected customer and admin pages.
- Responsive React interface styled with Tailwind CSS.

## Tech stack

- React 19
- Vite 8
- React Router
- Firebase Authentication and Cloud Firestore
- Tailwind CSS 4
- Lucide React icons

## Getting started

### Requirements

- Node.js and npm
- A Firebase project with Authentication and Cloud Firestore enabled

### Install and run

```bash
git clone https://github.com/bhushank45/QueueLess.git
cd QueueLess
npm install
npm run dev
```

Vite prints the local development URL in the terminal, usually `http://localhost:5173`.

## Firebase configuration

Copy `.env.example` to `.env.local` and fill in the Firebase web app settings from your Firebase project. `.env.local` is ignored by Git. Configure the same `VITE_FIREBASE_*` variables in your deployment environment (for example, Vercel's project settings) before building. The app requires these variables at startup; see [`src/firebase/firebase.js`](./src/firebase/firebase.js).

Vite embeds `VITE_*` values in the browser bundle, so environment variables keep configuration out of the GitHub source but do not make Firebase web settings secret. Restrict the API key to your app's required APIs and domains, and use Firebase Authentication and Firestore security rules to protect data.

QueueLess reads user profiles from the `users` collection and uses the `services` and `queues` collections for service and queue data. Configure Firestore security rules to enforce authenticated access and appropriate customer/admin permissions. Admin access depends on the user's Firestore profile having the `admin` role; assign that role only through a trusted administrative process.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

The app is deployed on [Vercel](https://vercel.com/). Import the repository into Vercel and deploy with the default Vite build settings (`npm run build`, output directory `dist`). The included [`vercel.json`](./vercel.json) rewrites application routes to `index.html`, so direct navigation to client-side routes works.
