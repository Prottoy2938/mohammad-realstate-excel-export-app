import { Button } from '../button/Button';
import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';

const Banner = () => (
  <Section>
    <CTABanner
      title="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      subtitle="Reach Out to Us"
      button={
        <a href="mailto:contact@srev.com">
          <Button>Contact Us</Button>
        </a>
      }
    />
  </Section>
);

export { Banner };
