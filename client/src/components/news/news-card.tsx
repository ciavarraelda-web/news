import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
  className?: string;
}

export default function NewsCard({ article, featured = false, className }: NewsCardProps) {
  const timeAgo = (date: string | Date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "bitcoin":
        return "bg-primary/20 text-primary";
      case "ethereum":
        return "bg-secondary/20 text-secondary";
      case "defi":
        return "bg-accent/20 text-accent";
      case "nft":
      case "nfts":
        return "bg-destructive/20 text-destructive";
      case "regulation":
        return "bg-muted-foreground/20 text-muted-foreground";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const handleReadMore = () => {
    if (article.url) {
      window.open(article.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden news-card",
        className
      )}
      data-testid={`card-news-${featured ? 'featured' : 'regular'}`}
    >
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className={cn(
            "w-full object-cover",
            featured ? "h-48" : "h-40"
          )}
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      )}
      
      <CardContent className={cn("p-4", featured && "p-6")}>
        <div className="flex items-center gap-4 mb-3">
          {article.category && (
            <Badge 
              variant="outline" 
              className={getCategoryColor(article.category)}
              data-testid={`badge-category-${article.category.toLowerCase()}`}
            >
              {article.category}
            </Badge>
          )}
          <span className="text-muted-foreground text-sm" data-testid="text-time-ago">
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        
        <h3 
          className={cn(
            "font-semibold mb-3 line-clamp-2",
            featured ? "text-xl" : "text-base"
          )}
          data-testid="text-article-title"
        >
          {article.title}
        </h3>
        
        {article.description && (
          <p 
            className={cn(
              "text-muted-foreground mb-4 line-clamp-3",
              featured ? "text-base" : "text-sm"
            )}
            data-testid="text-article-description"
          >
            {article.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {article.source && (
              <>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {article.source.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium" data-testid="text-article-source">
                    {article.source}
                  </span>
                  {article.author && (
                    <p className="text-xs text-muted-foreground" data-testid="text-article-author">
                      by {article.author}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          
          <Button 
            variant="link" 
            className="text-primary hover:text-primary/80 p-0"
            onClick={handleReadMore}
            data-testid="button-read-more"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-1" />
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
