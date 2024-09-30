import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Footer from '../components/ui/Footer';
import './globals.css';

const ClientApolloProvider = dynamic(
  () => import('../components/ClientApolloProvider'),
  { ssr: false }
);

export const metadata = {
  title: 'SwimPulsePro',
  description: 'Swim Training Fit Analysis and Tracking Tool',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: '/apple-touch-icon.png?v=4',
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
};

function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body>
        <ClientApolloProvider>
          <main className='content'>{children}</main>
          <Footer />
        </ClientApolloProvider>
      </body>
    </html>
  );
}

export default RootLayout;