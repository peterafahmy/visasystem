# Visa Department Database

Internal case tracking system for visa operations.

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Create a user:
   - `npm run create-user -- admin@example.com "StrongPassword" "Admin User"`
6. Start the dev server:
   - `npm run dev`

## CSV Formats

Applicants CSV columns:
`firstName,lastName,dateOfBirth,nationality,passportNumber,phone,email,address`

Cases CSV columns:
`caseId,applicantPassportNumber,status,submittedAt,notes`

## Deployment (Dokploy)

- Build with `npm run build` and start with `npm run start`.
- Ensure `DATABASE_URL`, `AUTH_SECRET`, and `UPLOAD_DIR` are set in the environment.
- Mount a persistent volume for `/data/uploads`.

## Backups

Use a daily cron to dump Postgres and archive `/data/uploads`.
