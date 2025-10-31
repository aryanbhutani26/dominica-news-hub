import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { articlesService } from '../../services/articles';
import { categoriesService } from '../../services/categories';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  featuredImage: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Please select a category'),
  status: z.enum(['draft', 'published']),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export const AdminArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id && id !== 'new';

  // Fetch article data if editing
  const { data: articleData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['admin-article', id],
    queryFn: () => articlesService.getAdminArticleById(id!),
    enabled: isEditing,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      categoryId: '',
      status: 'draft',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (articleData?.data.article) {
      const article = articleData.data.article;
      form.reset({
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content,
        featuredImage: article.featuredImage || '',
        categoryId: article.category.id,
        status: article.status,
      });
    }
  }, [articleData, form]);

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: articlesService.createArticle,
    onSuccess: () => {
      toast.success('Article created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      navigate('/admin/articles');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create article');
    },
  });

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: (data: ArticleFormData) => articlesService.updateArticle(id!, data),
    onSuccess: () => {
      toast.success('Article updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-article', id] });
      navigate('/admin/articles');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update article');
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = isLoadingArticle || createMutation.isPending || updateMutation.isPending;
  const categories = categoriesData?.data.categories || [];

  if (isEditing && isLoadingArticle) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/articles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Update your article' : 'Create a new article'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>The main content of your article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title..."
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of the article..."
                    rows={3}
                    {...form.register('excerpt')}
                  />
                  {form.formState.errors.excerpt && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.excerpt.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here..."
                    rows={15}
                    {...form.register('content')}
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>Control how your article is published</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.watch('status')}
                    onValueChange={(value: 'draft' | 'published') => form.setValue('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.status && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.status.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={form.watch('categoryId')}
                    onValueChange={(value) => form.setValue('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image URL (Optional)</Label>
                  <Input
                    id="featuredImage"
                    placeholder="https://example.com/image.jpg"
                    {...form.register('featuredImage')}
                  />
                  {form.formState.errors.featuredImage && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.featuredImage.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
                  </Button>
                  
                  {isEditing && form.watch('status') === 'published' && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const article = articleData?.data.article;
                        if (article) {
                          window.open(`/articles/${article.slug}`, '_blank');
                        }
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Article
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};