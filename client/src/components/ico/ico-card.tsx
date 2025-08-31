import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rocket, Gamepad2, Leaf, Building, Coins } from "lucide-react";
import type { SponsoredIco } from "@/lib/types";

interface IcoCardProps {
  ico: SponsoredIco;
  sponsored?: boolean;
}

export default function IcoCard({ ico, sponsored = false }: IcoCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "defi":
      case "defi platform":
        return <Coins className="w-5 h-5 text-primary-foreground" />;
      case "gaming":
      case "gaming/nft":
        return <Gamepad2 className="w-5 h-5 text-secondary-foreground" />;
      case "sustainability":
        return <Leaf className="w-5 h-5 text-accent-foreground" />;
      case "enterprise":
        return <Building className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Rocket className="w-5 h-5 text-primary-foreground" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "defi":
      case "defi platform":
        return "bg-primary";
      case "gaming":
      case "gaming/nft":
        return "bg-secondary";
      case "sustainability":
        return "bg-accent";
      case "enterprise":
        return "bg-muted";
      default:
        return "bg-primary";
    }
  };

  const getBorderColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "defi":
      case "defi platform":
        return "border-primary/30";
      case "gaming":
      case "gaming/nft":
        return "border-secondary/30";
      case "sustainability":
        return "border-accent/30";
      default:
        return "border-border";
    }
  };

  const progress = ico.targetAmount 
    ? Math.round((parseFloat(ico.raisedAmount || "0") / parseFloat(ico.targetAmount)) * 100)
    : 0;

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const handleInvestClick = () => {
    if (ico.websiteUrl) {
      window.open(ico.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  const cardClasses = sponsored
    ? `sponsored-banner ${getBorderColor(ico.category)}`
    : "";

  return (
    <Card className={cardClasses} data-testid={`card-ico-${ico.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${getCategoryColor(ico.category)} rounded-full flex items-center justify-center`}>
              {ico.logoUrl ? (
                <img 
                  src={ico.logoUrl} 
                  alt={`${ico.name} logo`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                getCategoryIcon(ico.category)
              )}
            </div>
            <div>
              <h3 className="font-bold" data-testid={`text-ico-name-${ico.id}`}>
                {ico.name}
              </h3>
              <span className="text-muted-foreground text-sm" data-testid={`text-ico-category-${ico.id}`}>
                {ico.category}
              </span>
            </div>
          </div>
          {sponsored && (
            <Badge variant="outline" className="bg-primary/20 text-primary" data-testid={`badge-sponsored-${ico.id}`}>
              SPONSORED
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-4" data-testid={`text-ico-description-${ico.id}`}>
          {ico.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-accent font-medium" data-testid={`text-ico-progress-${ico.id}`}>
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid={`progress-ico-${ico.id}`} />
          <div className="flex justify-between text-sm">
            <span>
              Raised:{" "}
              <span className="text-foreground font-medium" data-testid={`text-ico-raised-${ico.id}`}>
                {formatAmount(ico.raisedAmount || "0")}
              </span>
            </span>
            <span>
              Target:{" "}
              <span className="text-foreground font-medium" data-testid={`text-ico-target-${ico.id}`}>
                {formatAmount(ico.targetAmount)}
              </span>
            </span>
          </div>
        </div>
        
        <Button 
          className={`w-full ${sponsored ? getCategoryColor(ico.category) : "bg-accent"} text-white hover:opacity-90 transition-opacity`}
          onClick={handleInvestClick}
          data-testid={`button-invest-${ico.id}`}
        >
          {sponsored ? "Invest Now" : "Learn More"}
        </Button>
      </CardContent>
    </Card>
  );
}
