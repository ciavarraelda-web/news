import { Link } from "wouter";
import { ChartLine } from "lucide-react";
import { FaTwitter, FaTelegram, FaDiscord } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { name: "Latest News", href: "/" },
    { name: "Active ICOs", href: "#icos" },
    { name: "Market Analysis", href: "#markets" },
    { name: "Price Alerts", href: "#alerts" },
  ];

  const sponsorshipLinks = [
    { name: "Sponsor ICO", href: "#sponsor-ico" },
    { name: "Banner Ads", href: "#banner-ads" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact Sales", href: "#contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Disclaimer", href: "#disclaimer" },
    { name: "Cookie Policy", href: "#cookies" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-16" data-testid="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold gradient-text text-lg mb-4 flex items-center gap-2">
              <ChartLine className="w-5 h-5" />
              CryptoICO
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted source for cryptocurrency news and ICO opportunities.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-telegram"
              >
                <FaTelegram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-discord"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-quick-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Sponsorship</h4>
            <ul className="space-y-2 text-sm">
              {sponsorshipLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-sponsorship-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-legal-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CryptoICO. All rights reserved. | Powered by News API & Coinbase Commerce</p>
        </div>
      </div>
    </footer>
  );
}
