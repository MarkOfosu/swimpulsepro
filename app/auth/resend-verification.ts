
// pages/api/auth/resend-verification.ts
import { Resend } from 'resend'
import { createClient } from '@utils/supabase/server'
import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  try {
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store token in Supabase
    const { error: tokenError } = await supabase
      .from('verification_tokens')
      .insert({
        email,
        token,
        expires_at: tokenExpiry
      })

    if (tokenError) throw tokenError

    // Send verification email using Resend
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`
    
    await resend.emails.send({
      from: 'verification@yourdomain.com',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome!</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    })

    return res.status(200).json({ message: 'Verification email sent' })

  } catch (error) {
    console.error('Error sending verification:', error)
    return res.status(500).json({ error: 'Failed to send verification email' })
  }
}