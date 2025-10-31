import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  slug?: string;
  featured?: boolean;
  animationDelay?: number;
}

const NewsCard = ({ 
  id, 
  title, 
  excerpt, 
  category, 
  date, 
  image, 
  slug,
  featured = false,
  animationDelay = 0 
}: NewsCardProps) => {
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  return (
    <Link 
      to={slug ? `/articles/${slug}` : `/news/${id}`} 
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        featured ? "lg:col-span-2" : ""
      )}>
        <div className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "h-64 lg:h-80" : "h-48"
        )}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 animate-scale-in" style={{ animationDelay: `${animationDelay + 200}ms` }}>
            <Badge className="bg-primary text-primary-foreground shadow-md">
              {category}
            </Badge>
          </div>
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardHeader className="pb-3">
          <h3 className={cn(
            "font-bold leading-tight transition-colors duration-300",
            "group-hover:text-primary",
            featured ? "text-2xl" : "text-lg"
          )}>
            {title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
