import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import './style.css';
import { Header, Footer } from './site-shell';

export const metadata = {
  title: 'Swift AI Solutions | Version 2 — Never Miss a Customer Call Again',
  description: 'AI receptionist services for Australian tradies and local businesses. Explore call answering, appointment requests and practical support with Swift AI Solutions.',
  robots: { index: false, follow: false },
  icons: { icon: { url: '/images/swift-ai-solutions-logo.png', type: 'image/png' } },
  openGraph: {
    title: 'Swift AI Solutions',
    description: 'Your next customer is calling. Be ready with an AI receptionist built around your business.',
    type: 'website',
    locale: 'en_AU',
  },
};

export default function RootLayout({children}) {
  return <html lang="en-AU"><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    {children}
    <Footer />
  </body></html>;
}
