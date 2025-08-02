import type { Dictionary } from '@/types';

interface FooterProps {
  dictionary: Dictionary;
}

const Footer = ({ dictionary }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = dictionary['Footer.copyright']?.replace('{year}', currentYear.toString()) || `© ${currentYear} AstroVibes. All rights reserved.`;

  return (
    <footer className="py-6 mt-auto bg-card border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="font-body">{copyrightText}</p>
        <p className="font-body text-sm mt-1">{dictionary['Footer.poweredBy']}</p>
      </div>
    </footer>
  );
};

export default Footer;
