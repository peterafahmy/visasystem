import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visa Case Database',
  description: 'Internal visa department case tracking'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
