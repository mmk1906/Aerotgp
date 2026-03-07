import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  User,
  Tag,
  Edit,
  Trash2,
  Eye,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { getBlog, updateBlog, deleteBlog, getPublishedBlogs, Blog } from '../services/databaseService';

export function BlogView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBlog();
      loadRelatedBlogs();
    }
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const fetchedBlog = await getBlog(id!);
      
      if (!fetchedBlog) {
        toast.error('Blog not found');
        navigate('/blogs');
        return;
      }

      // Check if user can view this blog
      if (fetchedBlog.status !== 'published' && user?.role !== 'admin' && fetchedBlog.authorId !== user?.id) {
        toast.error('This blog is not yet published');
        navigate('/blogs');
        return;
      }

      setBlog(fetchedBlog);

      // Increment view count
      await updateBlog(id!, { 
        views: (fetchedBlog.views || 0) + 1 
      });
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog');
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedBlogs = async () => {
    try {
      const allBlogs = await getPublishedBlogs();
      // Get 3 related blogs (same category, excluding current blog)
      const related = allBlogs
        .filter(b => b.id !== id)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (error) {
      console.error('Error loading related blogs:', error);
    }
  };

  const handleDelete = async () => {
    if (!blog || !user) return;

    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(blog.id!);
        toast.success('Blog deleted successfully');
        navigate('/blogs');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Blog link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 text-lg mt-4">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Blog not found</p>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === blog.authorId || user.role === 'admin');

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/blogs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border-gray-700">
            {/* Cover Image */}
            {blog.imageUrl && (
              <div className="relative h-96 overflow-hidden rounded-t-lg">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-blue-600/90 backdrop-blur-sm">
                    {blog.category}
                  </Badge>
                  {blog.status !== 'published' && (
                    <Badge className="bg-yellow-600/90 backdrop-blur-sm capitalize">
                      {blog.status}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <CardContent className="p-8">
              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6 pb-6 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{blog.views || 0} views</span>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-6 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                  <p className="text-lg text-gray-300 italic">{blog.excerpt}</p>
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-invert prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
                style={{
                  color: '#d1d5db',
                }}
              />

              {/* Action Buttons */}
              {canEdit && (
                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  <Button
                    onClick={() => navigate(`/portal/my-blogs`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Blog
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Blog
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-6">Related Blogs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Card
                    key={relatedBlog.id}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border-gray-700 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/blogs/${relatedBlog.id}`)}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedBlog.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{relatedBlog.authorName}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Custom Styles for Prose */}
      <style>{`
        .prose h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #60a5fa;
        }
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #93c5fd;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .prose ul, .prose ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #93c5fd;
        }
        .prose img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .prose blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
