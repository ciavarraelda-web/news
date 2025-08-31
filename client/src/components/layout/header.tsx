import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChartLine, Plus } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "News", href: "/" },
    { name: "ICOs", href: "#icos" },
    { name: "Markets", href: "#markets" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top Banner Sponsored Area */}
        <div className="sponsored-banner py-2 mb-4 rounded-lg text-center" data-testid="banner-sponsored-top">
          <Badge variant="outline" className="mb-1">SPONSORED</Badge>
          <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ChartLine className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground font-medium">NextGenCoin ICO - Early Bird 50% Bonus!</span>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-sponsored-top-cta">
              Join Now
            </Button>
          </div>
        </div>
        
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <h1 className="text-2xl font-bold gradient-text">
                <ChartLine className="w-6 h-6 inline mr-2" />
                CryptoICO
              </h1>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-foreground hover:text-primary transition-colors ${
                    location === item.href ? "text-primary font-medium" : ""
                  }`}
                  data-testid={`link-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              className="hidden sm:flex bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-testid="button-sponsor-ico-header"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sponsor ICO
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-foreground hover:text-primary transition-colors py-2 ${
                        location === item.href ? "text-primary font-medium" : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`link-mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-4"
                    data-testid="button-mobile-sponsor-ico"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Sponsor ICO
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
