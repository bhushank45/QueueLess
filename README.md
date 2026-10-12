# QueueLess

QueueLess is a simple web app for joining service queues online. Customers can view available services, take a token, and track queue updates in real time. Staff can manage queues and monitor service activity from an admin dashboard.

**Live demo:** [queue-less-react.vercel.app](https://queue-less-react.vercel.app/)

## Features

- Customer sign-in and registration
- Browse services and join a queue
- Get a token and track your place in line
- Admin dashboard for queue and service management
- Responsive UI for desktop and mobile

## Tech stack

- React
- Vite
- Firebase Authentication and Firestore
- Tailwind CSS

## Getting started

### Requirements

- Node.js and npm
- Firebase project with Authentication and Firestore enabled

### Install

```bash
git clone https://github.com/bhushank45/QueueLess.git
cd QueueLess
npm install
```

### Run locally

```bash
npm run dev
```

The app will usually run at `http://localhost:5173`.

### Environment setup

Create a `.env.local` file from `.env.example` and add your Firebase config:

```bash
cp .env.example .env.local
```

Then fill in your `VITE_FIREBASE_*` values.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
