import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { getNewsByCategory } from "@/data/news";

const CategoryPage = () => {
  const { category = "world" } = useParams<{ category: string }>();
  const news = getNewsByCategory(category);
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2 pb-3 border-b-4 border-primary inline-block">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground mt-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Latest updates and stories from {categoryTitle.toLowerCase()}
          </p>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <NewsCard 
                key={article.id} 
                {...article} 
                animationDelay={100 * (index + 1)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
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
