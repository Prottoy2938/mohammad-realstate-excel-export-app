import Link from 'next/link';

import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => (
  <div color="bg-gray-100">
    <Section yPadding="py-6">
      <NavbarTwoColumns logo={<Logo xl />}>
        <li>
          <Link href="/">Home</Link>
        </li>       
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
          <Link href="/signin">Sign in</Link>
        </li>
      </NavbarTwoColumns>
    </Section>
  </div>
);

export { Hero };
