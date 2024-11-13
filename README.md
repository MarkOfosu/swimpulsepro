This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



SwimPulsePro is a web application designed to bridge the gap between coaches and athletes using current technology. 
The platform serves as an all-in-one solution for a swim team administration, workout management,attendance recording and tracking,  and performance tracking.
Key Features:

Coach Portal:


Workout creation and management
Real-time attendance tracking
Performance analytics dashboard
Achievement system management


Swimmer Experience:

Personal progress tracking
Workout history and analytics
Badge/achievement system
Team communication tools
Activity participation management


Technical Capabilities:


Real-time workout tracking and storage
Advanced performance analytics
Automated attendance systems
Secure data management


Technical Stack:

Frontend: Next.js (React) with TypeScript for type-safe, robust code
Backend: Supabase for real-time database capabilities and authentication
Modern web technologies ensuring responsive design and optimal performance
Secure data handling and user privacy protection

The application streamlines the entire swimming program management process, from workout creation to performance analysis, making it an invaluable tool for both coaches and swimmers. It provides data-driven insights while maintaining an intuitive user experience, helping swimming programs operate more efficiently and effectively.






















# SwimPulsePro

SwimPulsePro is an application that allows swim teams to manage their coaches and swimmers. Coaches can create and manage swim groups, track progress, and invite swimmers to join their groups.

## Registration and Sign-In Process

### Registering a Team

To register a team, follow these steps:

1. **Register your team**: You need to be a coach or an admin to register a team.
   - Form fields:
     - Team Name
     - Team location
     - Name of admin
     - Email address of admin
     - Phone number of admin
     - Password
     - Confirm password
     - Are you a swim coach as well? (yes/no)
       - Note: If you are a swim coach, you will also be registered as a coach for the team, so you will not need to register as a coach again.
       - Only swim coaches can create swim groups and add swimmers to the swim groups.
   - Add important links to be integrated with the app (e.g., team records, team website, team social media pages, etc.).
   - **User name will always be the email address.**
   - Use Google sign-in to sign up, or use your email address to sign up. Once done, a confirmation email will be sent to your email address. You will have to confirm your email address before you can sign in.
   - **After submitting the team registration form, you will have to wait for approval from the SwimPulsePro team.**
   - **Once approved, you can sign in and start sending invites to your coaches.**

### Signing Up as a Coach or Swimmer

Coaches use the invite link to sign up and join your team. They will be redirected to the coach dashboard where they can manage their swim groups and swimmers.

Coaches can add swim groups and swimmers to the swim groups by generating a QR code for swimmers to join. This will be a unique code that the swimmer can scan to join the particular swim group.

This invite link would lead to a sign-up form page with the following fields:
- Fixed fields: Team Name, Swim Group Name, Swim Group Coach
- First Name
- Last Name
- Email
- Password
- Confirm Password
- Phone Number
- Date of Birth

## Walkthrough Process

### For Users
1. **Home Page**: The first page that users see when they visit SwimPulsePro.
   - There are two main actions: Sign In and Register a Team.

### Sign-In Form
1. **Sign-In**:
   - Form fields:
     - Select Team from a dropdown
     - Username (Email)
     - Password

### Registration Form
1. **Register Team**:
   - Form fields:
     - Team Name
     - Team location
     - Name of admin
     - Email address of admin
     - Phone number of admin
     - Password
     - Confirm password
     - Are you a swim coach as well? (yes/no)

### After Registration
1. **Team Registration Approval**: After submitting the team registration form, you will have to wait for approval from the SwimPulsePro team.
2. **Post-Approval**: Once approved, you can sign in and start sending invites to your coaches.

### Coach and Swimmer Sign-Up
1. **Coaches**: Use the invite link to sign up and join your team.
   - They will be redirected to the coach dashboard where they can manage their swim groups and swimmers.
2. **Swimmers**: Join the swim groups by scanning a unique QR code generated by the coach.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm run dev`.

## Tech Stack

- React
- Next.js
- Supabase
- PostgreSQL 

## Running Locally

To run the project locally, you will need a local PostgreSQL database. Make sure to set the `DATABASE_URL` environment variable in your `.env` file.

```sh
DATABASE_URL="postgresql://user:password@localhost:5432/swimpro"


##using graphql in supabase - Complete Apollo + GraphQL Code Generator Flow
Configure codegen.ts: Create the configuration for generating types.
Write GraphQL Queries: Write your queries in a separate graphql/queries folder.
Run Codegen: Generate types using npx graphql-codegen.
Use Queries with Types: Use generated types in your React components for querying or mutating data.
Step-by-Step Setup Process
Step 1: Install Dependencies
You need the following dependencies:

@apollo/client for Apollo Client integration
graphql for handling GraphQL logic
@graphql-codegen/cli for setting up the GraphQL code generation
Plugins for generating TypeScript types from GraphQL schema


npm install @apollo/client graphql
npm install -D typescript @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo




