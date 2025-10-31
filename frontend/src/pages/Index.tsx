import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articlesService } from "../services/articles";
import { categoriesService } from "../services/categories";
import { Search, X } from "lucide-react";

const Index = () => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update local search when URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Fetch published articles (with search if provided)
  const { data: articlesData, isLoading: isLoadingArticles, error: articlesError } = useQuery({
    queryKey: ['published-articles', { page, limit: 9, search: searchQuery }],
    queryFn: () => articlesService.getPublishedArticles({ page, limit: 9 }),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  });

  const articles = articlesData?.data.articles || [];
  const categories = categoriesData?.data.categories || [];
  const pagination = articlesData?.data.pagination;

  // Get featured article (first article)
  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1, 7); // Next 6 articles

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchParams({ search: localSearchQuery.trim() });
      setPage(1);
    }
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  // Filter articles based on search query (client-side filtering for now)
  const filteredArticles = searchQuery 
    ? articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        {searchQuery && (
          <section className="mb-8 animate-fade-in">
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Search Results for "{searchQuery}"
                </h2>
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
              </div>
              <p className="text-muted-foreground">
                Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </section>
        )}

        {/* Search Bar (Alternative) */}
        <section className="mb-8 animate-fade-in">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </section>

        {/* Hero/Featured Section - Only show if not searching */}
        {!searchQuery && (
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b-2 border-primary inline-block">
              Featured Story
            </h2>
            <div className="mt-6">
              {isLoadingArticles ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : articlesError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Failed to load articles. Please try again later.</p>
                </div>
              ) : featuredArticle ? (
                <NewsCard
                  id={featuredArticle.id}
                  title={featuredArticle.title}
                  excerpt={featuredArticle.excerpt || ''}
                  image={featuredArticle.featuredImage || ''}
                  category={featuredArticle.category.name}
                  date={featuredArticle.publishedAt || featuredArticle.createdAt}
                  slug={featuredArticle.slug}
                  animationDelay={100}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No featured articles available.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Articles Section */}
        <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground pb-2 border-b-2 border-primary inline-block">
              {searchQuery ? 'Search Results' : 'Latest News'}
            </h2>
            {!searchQuery && pagination && pagination.totalPages > 1 && (
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                View All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingArticles ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                </div>
              ))
            ) : filteredArticles.length > 0 ? (
              (searchQuery ? filteredArticles : latestArticles).map((article, index) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt || ''}
                  image={article.featuredImage || ''}
                  category={article.category.name}
                  date={article.publishedAt || article.createdAt}
                  slug={article.slug}
                  animationDelay={100 * (index + 1)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">
                  {searchQuery ? `No articles found for "${searchQuery}"` : 'No articles available.'}
                </p>
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline" className="mt-4">
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Load More Button - Only show if not searching */}
          {!searchQuery && pagination && pagination.hasNextPage && (
            <div className="text-center mt-8">
              <Button
                onClick={() => setPage(page + 1)}
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Load More Articles
              </Button>
            </div>
          )}
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
            {categories.slice(0, 8).map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
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
