import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { featuredNews, getLatestNews } from "@/data/news";

const Index = () => {
  const latestNews = getLatestNews(6);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero/Featured Section */}
        <section className="mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b-2 border-primary inline-block">
            Featured Story
          </h2>
          <div className="mt-6">
            <NewsCard {...featuredNews} animationDelay={100} />
          </div>
        </section>

        {/* Latest News Section */}
        <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground pb-2 border-b-2 border-primary inline-block">
              Latest News
            </h2>
            <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <NewsCard 
                key={news.id} 
                {...news} 
                animationDelay={100 * (index + 1)}
              />
            ))}
          </div>
        </section>

        {/* Categories Quick Access */}
        <section className="mt-12 py-8 bg-secondary/30 rounded-lg animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Stay informed with news from across Dominica and the world
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
            <Button 
              variant="outline" 
              className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300" 
              asChild
            >
              <a href="/world">World</a>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300" 
              asChild
            >
              <a href="/dominica">Dominica</a>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300" 
              asChild
            >
              <a href="/economy">Economy</a>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300" 
              asChild
            >
              <a href="/agriculture">Agriculture</a>
            </Button>
          </div>
        </section>
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

export default Index;
