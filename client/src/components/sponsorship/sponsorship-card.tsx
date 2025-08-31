import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface SponsorshipCardProps {
  onSponsorClick: (type: "ico" | "banner") => void;
}

export default function SponsorshipCard({ onSponsorClick }: SponsorshipCardProps) {
  const icoFeatures = [
    "Homepage hero banner",
    "Featured in ICO section",
    "Social media mention",
  ];

  return (
    <Card className="crypto-glow sticky top-24" data-testid="card-sponsorship-pricing">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center" data-testid="text-sponsor-title">
          Sponsor Your ICO
        </h3>
        
        <div className="space-y-4">
          {/* ICO Sponsorship */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">ICO Spotlight</span>
              <Badge className="bg-primary text-primary-foreground" data-testid="badge-popular">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            </div>
            <div className="text-2xl font-bold text-primary mb-2" data-testid="text-ico-price">
              100 USDC
            </div>
            <div className="text-muted-foreground text-sm mb-3" data-testid="text-ico-duration">
              3 days featured placement
            </div>
            <ul className="text-sm space-y-1 mb-4">
              {icoFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2" data-testid={`text-ico-feature-${index}`}>
                  <Check className="w-4 h-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              onClick={() => onSponsorClick("ico")}
              data-testid="button-sponsor-ico"
            >
              Sponsor ICO
            </Button>
          </div>
          
          {/* Banner Advertising */}
          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3" data-testid="text-banner-advertising">
              Banner Advertising
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center" data-testid="banner-price-3-days">
                <span className="text-sm">3 Days</span>
                <span className="font-bold text-secondary">100 USDC</span>
              </div>
              <div className="flex justify-between items-center" data-testid="banner-price-1-week">
                <span className="text-sm">1 Week</span>
                <span className="font-bold text-secondary">150 USDC</span>
              </div>
            </div>
            <Button 
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors font-medium mt-4"
              onClick={() => onSponsorClick("banner")}
              data-testid="button-buy-banner-ad"
            >
              Buy Banner Ad
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
