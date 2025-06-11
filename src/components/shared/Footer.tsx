const Footer = () => {
  return (
    <footer className="py-6 mt-auto bg-card border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="font-body">&copy; {new Date().getFullYear()} AstroVibes. All rights reserved.</p>
        <p className="font-body text-sm mt-1">Powered by Cosmic Energy & Next.js</p>
      </div>
    </footer>
  );
};

export default Footer;
