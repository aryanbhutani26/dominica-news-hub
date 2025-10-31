import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";

// Mock news data by category
const categoryNews: Record<string, any[]> = {
  world: [
    {
      id: "w1",
      title: "Caribbean Leaders Meet to Discuss Climate Action",
      excerpt: "Regional summit addresses urgent climate challenges and collaborative solutions for island nations.",
      category: "World",
      date: "October 28, 2025",
      image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=600&h=400&fit=crop",
    },
    {
      id: "w2",
      title: "International Trade Agreement Benefits Small Island Nations",
      excerpt: "New trade pact opens markets for Caribbean agricultural exports and tourism services.",
      category: "World",
      date: "October 26, 2025",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop",
    },
  ],
  dominica: [
    {
      id: "d1",
      title: "New Marine Conservation Area Established",
      excerpt: "Environmental initiative protects vital coral reef ecosystem along Dominica's western coast.",
      category: "Dominica",
      date: "October 27, 2025",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
    },
    {
      id: "d2",
      title: "UNESCO Recognizes Dominica's Cultural Heritage Sites",
      excerpt: "International organization honors the nation's commitment to preserving historical landmarks.",
      category: "Dominica",
      date: "October 24, 2025",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
    },
  ],
  economy: [
    {
      id: "e1",
      title: "Prime Minister Announces New Economic Development Initiative",
      excerpt: "Government unveils comprehensive plan to boost economic growth through sustainable tourism.",
      category: "Economy",
      date: "October 30, 2025",
      image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=600&h=400&fit=crop",
    },
    {
      id: "e2",
      title: "Tech Hub Opens in Roseau Creating Job Opportunities",
      excerpt: "New technology center aims to position Dominica as a Caribbean digital innovation leader.",
      category: "Economy",
      date: "October 26, 2025",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    },
  ],
  agriculture: [
    {
      id: "a1",
      title: "Agricultural Exports Reach Record High This Quarter",
      excerpt: "Dominica's agricultural sector reports unprecedented growth in banana and citrus exports.",
      category: "Agriculture",
      date: "October 29, 2025",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
    },
    {
      id: "a2",
      title: "Traditional Farming Methods Blend with Modern Techniques",
      excerpt: "Local farmers successfully integrate sustainable practices while preserving cultural heritage.",
      category: "Agriculture",
      date: "October 25, 2025",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
    },
  ],
};

const CategoryPage = () => {
  const { category = "world" } = useParams<{ category: string }>();
  const news = categoryNews[category.toLowerCase()] || [];
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 pb-3 border-b-4 border-primary inline-block">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground mt-4">
            Latest updates and stories from {categoryTitle.toLowerCase()}
          </p>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No articles found in this category yet.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">DOMINICA NEWS</h3>
            <p className="text-primary-foreground/80 text-sm">
              Your trusted source for news from Dominica and around the world
            </p>
            <p className="text-primary-foreground/60 text-xs mt-4">
              © 2025 Dominica News. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;
