import './globals.css';
import UserProviderWrapper from '@/components/common/UserProviderWrapper';
import Navbar from '@/components/common/Navbar';

export const metadata = {
  title: 'Leela',
  description: 'Event management app with Auth0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProviderWrapper>
          <Navbar />
          {children}
        </UserProviderWrapper>
      </body>
    </html>
  );
}
