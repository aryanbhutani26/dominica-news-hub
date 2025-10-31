// Common API response structure
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

// Pagination structure
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  totalArticles?: number;
  totalImages?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt?: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  articleCount?: number;
  createdAt: string;
}

// Article types
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category: Category;
  author: User;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Image types
export interface Image {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploader: User;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
}

// Form data types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface ArticleFormData {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  status: 'draft' | 'published';
}

export interface CategoryFormData {
  name: string;
  description?: string;
  displayOrder?: number;
}

// API response types
export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

export interface CategoriesResponse {
  categories: Category[];
  count: number;
}

export interface ImagesResponse {
  images: Image[];
  pagination: Pagination;
}

export interface AuthResponse {
  user: User;
  token: string;
}