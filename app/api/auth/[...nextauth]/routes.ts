// import NextAuth from "next-auth"
// import Providers from "next-auth/providers"
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export default NextAuth({
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   adapter: PrismaAdapter(prisma),
// })

// Example API route handler in Next.js



// export default async function handler(req, res) {
//     const db = await connectToDatabase();
//     const { metricId, swimmerId, computedScore } = JSON.parse(req.body);
  
//     // Insert the result into the database
//     const result = await db.query(`
//       INSERT INTO results (metric_id, swimmer_id, computed_score, recorded_at)
//       VALUES ($1, $2, $3, now())
//     `, [metricId, swimmerId, computedScore]);
  
//     res.status(200).json({ message: 'Result saved successfully' });
//   }
  