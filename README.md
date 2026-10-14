This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MySQL 8.0 or later

### Database Setup

1. **Create MySQL Database**:
```sql
CREATE DATABASE analyticsdev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Run Migrations**:
```bash
mysql -u root -p analyticsdev < migrations/001_create_tables.sql
```

3. **Configure Environment Variables**:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=analyticsdev
JWT_SECRET=your-secret-key-here-change-in-production
```

### Running the Development Server

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on cPanel or MySQL-based Hosting

This application uses MySQL and is optimized for cPanel or any MySQL-compatible hosting environment. 

### Deployment Steps:

1. Upload the project files to your hosting server
2. Create a MySQL database through your hosting control panel
3. Import the `migrations/001_create_tables.sql` file into your database
4. Configure environment variables in `.env` with your production database credentials
5. Run `npm install` to install dependencies
6. Run `npm run build` to create the production build
7. Start the server with `npm start`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
