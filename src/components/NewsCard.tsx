import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
}

const NewsCard = ({ id, title, excerpt, category, date, image, featured = false }: NewsCardProps) => {
  return (
    <Link to={`/news/${id}`} className="group">
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-lg",
        featured ? "lg:col-span-2" : ""
      )}>
        <div className={cn(
          "relative overflow-hidden",
          featured ? "h-64 lg:h-80" : "h-48"
        )}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              {category}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-3">
          <h3 className={cn(
            "font-bold leading-tight group-hover:text-primary transition-colors",
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
            <span>{date}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
