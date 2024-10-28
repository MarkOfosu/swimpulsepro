// app/auth/signup/VerificationEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
  } from '@react-email/components'
  import * as React from 'react'
  
  interface VerificationEmailProps {
    firstName: string
    verificationUrl: string
    isExisting: boolean
  }
  
  export const VerificationEmail = ({
    firstName,
    verificationUrl,
    isExisting
  }: VerificationEmailProps) => (
    <Html>
      <Head />
      <Preview>
        {isExisting 
          ? 'Confirm your email address for SwimClouds' 
          : 'Welcome to SwimClouds - Please verify your email'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isExisting ? 'Confirm your email' : 'Welcome to SwimClouds!'}
          </Heading>
          <Text style={text}>
            Hello {firstName},
          </Text>
          <Text style={text}>
            {isExisting
              ? 'We noticed a new sign-in attempt with your email address. If this was you, please confirm your email address by clicking the button below:'
              : 'Thank you for joining SwimClouds! To complete your registration, please verify your email address by clicking the button below:'}
          </Text>
          <Link
            href={verificationUrl}
            target="_blank"
            style={button}
          >
            Verify Email Address
          </Link>
          <Text style={footer}>
            If you didn't request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  )


const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  }
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  }
  
  const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
    lineHeight: '1.25',
  }
  
  const text = {
    color: '#1a1a1a',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '24px 0',
  }
  
  const button = {
    backgroundColor: '#000000',
    borderRadius: '4px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '50px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    width: '200px',
    margin: '24px 0',
  }
  
  const footer = {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '48px 0 20px',
  }