# ASETI-TIK Monorepo

Sistem Manajemen Aset dan Infrastruktur Teknologi Informasi dan Komunikasi (ASETI-TIK).

## Project Structure

- `apps/api`: Backend service using Express, Prisma, and PostgreSQL.
- `apps/web`: Frontend application using React, Vite, and Brutalist design system.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   - Copy `apps/api/.env.example` to `apps/api/.env`.
   - Update the database credentials and secrets.

3. Run the project:
   ```bash
   npm run dev
   ```
