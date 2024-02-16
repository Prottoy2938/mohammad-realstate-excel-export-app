import Link from 'next/link';

import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => (
  <div color="bg-gray-100">
    <Section yPadding="py-6">
      <NavbarTwoColumns logo={<Logo xl />}>
        <li>Home</li>

        <li>
          <Link href="/">Sign in</Link>
        </li>
      </NavbarTwoColumns>
    </Section>
    <div
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/460695/pexels-photo-460695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Section yPadding="pt-20 pb-32">
        <HeroOneButton
          title={
            <>
              <span className="text-white">{'Streamline Real estate\n'}</span>
              <span className="text-primary-500">Valuation</span>
            </>
          }
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          button={<Button xl>Get Started</Button>}
        />
      </Section>
    </div>
  </div>
);

export { Hero };
