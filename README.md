# SG MotoPark

A web app to help Singapore users find motorcycle parking locations. Built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Accurate Location Search**: Search for places using Google Maps Geocoding API
- **Interactive Map**: Google Maps integration with custom motorcycle parking markers
- **Comprehensive Database**: Own database of motorcycle parking locations (not relying on Google Maps POIs)
- **Real-time Geolocation**: Use current location to find nearby parking
- **Responsive Design**: Mobile-first design that works on all devices
- **Detailed Information**: Carpark details including pricing, types, and photos

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Maps**: @react-google-maps/api
- **Database**: SQLite with Prisma ORM
- **APIs**: Google Maps Geocoding API

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd sg-motopark
npm install
```

### 2. Environment Setup

Copy the environment file and add your Google Maps API key:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Maps API key:

```env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Get your API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API" and "Geocoding API"
4. Create credentials (API Key)
5. Optionally restrict the key to your domain for security

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:migrate   # Run migrations
npm run db:generate # Generate Prisma client
npm run db:seed     # Seed database
npm run db:studio   # Open Prisma Studio

# Code Quality
npm run lint        # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── geocode/       # Location geocoding
│   │   └── carparks/      # Carpark search
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── SearchBar.tsx      # Search input component
│   ├── MapView.tsx        # Google Maps component
│   ├── CarparkList.tsx    # Results list
│   └── CarparkCard.tsx    # Individual carpark card
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Prisma client
│   └── geo.ts             # Geolocation helpers
└── types/                 # TypeScript types
    └── carpark.ts         # Carpark type definitions

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seed script
```

## Database Schema

The app uses two main models:

- **Carpark**: Parking location details (name, address, coordinates, type, etc.)
- **Photo**: Associated images for carparks

## API Endpoints

### GET `/api/geocode?query=<location>`
Geocodes a location string to coordinates using Google Maps API.

### GET `/api/carparks/search?lat=<lat>&lng=<lng>&radiusMeters=<radius>`
Finds motorcycle parking locations near the given coordinates.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Future Improvements

- Photo gallery for each carpark
- Advanced filters (HDB vs Mall, covered parking, etc.)
- User reviews and ratings
- Real-time availability
- Route planning integration
- Push notifications for favorite locations
