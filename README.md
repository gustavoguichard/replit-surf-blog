# Wave Rider - Surfing Blog

A surfing-themed blog with pre-populated content from multiple authors using React, Express, and PostgreSQL on Neon.

## Features

- Rich surfing-themed content from multiple expert authors
- Categories include Surf Techniques, Destinations, Equipment, Stories, and Environment
- Responsive design with modern UI components
- Full-featured blog with comments and tagging system
- PostgreSQL database with Drizzle ORM for data management

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL database or Neon database account

### Database Configuration

1. Create a `.env` file in the root directory
2. Add your database connection string:
   ```
   DATABASE_URL=postgres://username:password@endpoint/database
   ```
   
   You can copy the `.env.example` file as a starting point:
   ```
   cp .env.example .env
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Push database schema:
   ```bash
   npm run db:push
   ```

3. Seed the database with sample content:
   ```bash
   tsx scripts/seed.ts
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5000`

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared types and schemas
- `/scripts` - Utility scripts like database seeding

## Technologies Used

- Frontend: React, TailwindCSS, shadcn/ui, TanStack Query
- Backend: Express, PostgreSQL, Drizzle ORM
- Authentication: Express sessions
- Styling: TailwindCSS with custom surfing-themed design system

## License

MIT
