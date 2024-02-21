import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';

import { useAuthContext } from '@/firebase/auth-context';
import firebase_app from '@/firebase/config';

import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';
// Initialize Firebase auth instance
const auth = getAuth(firebase_app);

const Hero = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        router.push('/');
        console.log('User signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };
  return (
    <div color="bg-gray-100">
      <Section yPadding="py-6">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li>
            <Link href="/">Home</Link>
          </li>
          {user ? (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          ) : (
            ''
          )}
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
          <li>
            <Link href="/blogs">Blogs</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            {user ? (
              <Link href="#" onClick={handleLogOut}>
                Logout
              </Link>
            ) : (
              <Link href="/signin">Sign in</Link>
            )}
          </li>
        </NavbarTwoColumns>
      </Section>
    </div>
  );
};

export { Hero };
