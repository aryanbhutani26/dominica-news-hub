import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";

// Mock news data
const featuredNews = {
  id: "1",
  title: "Prime Minister Announces New Economic Development Initiative for Dominica",
  excerpt: "The government unveils a comprehensive plan to boost economic growth through sustainable tourism and renewable energy investments.",
  category: "Economy",
  date: "October 30, 2025",
  image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=800&h=600&fit=crop",
  featured: true,
};

const newsData = [
  {
    id: "2",
    title: "Agricultural Exports Reach Record High This Quarter",
    excerpt: "Dominica's agricultural sector reports unprecedented growth in banana and citrus exports to international markets.",
    category: "Agriculture",
    date: "October 29, 2025",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Caribbean Leaders Meet to Discuss Climate Action",
    excerpt: "Regional summit addresses urgent climate challenges and collaborative solutions for island nations.",
    category: "World",
    date: "October 28, 2025",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "New Marine Conservation Area Established",
    excerpt: "Environmental initiative protects vital coral reef ecosystem along Dominica's western coast.",
    category: "Dominica",
    date: "October 27, 2025",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Tech Hub Opens in Roseau Creating Job Opportunities",
    excerpt: "New technology center aims to position Dominica as a Caribbean digital innovation leader.",
    category: "Economy",
    date: "October 26, 2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Traditional Farming Methods Blend with Modern Techniques",
    excerpt: "Local farmers successfully integrate sustainable practices while preserving cultural heritage.",
    category: "Agriculture",
    date: "October 25, 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    title: "UNESCO Recognizes Dominica's Cultural Heritage Sites",
    excerpt: "International organization honors the nation's commitment to preserving historical landmarks.",
    category: "Dominica",
    date: "October 24, 2025",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero/Featured Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b-2 border-primary">
            Featured Story
          </h2>
          <NewsCard {...featuredNews} />
        </section>

        {/* Latest News Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground pb-2 border-b-2 border-primary">
              Latest News
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </div>
        </section>

        {/* Categories Quick Access */}
        <section className="mt-12 py-8 bg-secondary/30 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Stay informed with news from across Dominica and the world
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
            <Button variant="outline" className="h-20 text-lg font-semibold" asChild>
              <a href="/world">World</a>
            </Button>
            <Button variant="outline" className="h-20 text-lg font-semibold" asChild>
              <a href="/dominica">Dominica</a>
            </Button>
            <Button variant="outline" className="h-20 text-lg font-semibold" asChild>
              <a href="/economy">Economy</a>
            </Button>
            <Button variant="outline" className="h-20 text-lg font-semibold" asChild>
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
