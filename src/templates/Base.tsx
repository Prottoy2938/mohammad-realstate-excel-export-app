import { useAuthContext } from '@/firebase/auth-context';

import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Meta } from '../layout/Meta';
import { Section } from '../layout/Section';
import { AppConfig } from '../utils/AppConfig';
import { Footer } from './Footer';
import { Hero } from './Hero';

const Base = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }

  return (
    <div className="text-gray-600 antialiased">
      <Meta title={AppConfig.title} description={AppConfig.description} />
      <Hero />
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
            button={
              user ? (
                <a href="/dashboard">
                  <Button xl>Dashboard</Button>
                </a>
              ) : (
                <a href="/signin">
                  <Button xl>Get Started</Button>
                </a>
              )
            }
          />
        </Section>
      </div>
      {/* <Sponsors /> */}
      {/* <VerticalFeatures /> */}
      {/* <Banner /> */}
      <Footer />
    </div>
  );
};

export { Base };
