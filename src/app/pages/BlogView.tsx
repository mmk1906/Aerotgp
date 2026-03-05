import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Calendar,
  User,
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router';
import { Blog } from '../data/blogData';
import { toast } from 'sonner';

export function BlogView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs && id) {
      const blogs: Blog[] = JSON.parse(storedBlogs);
      const foundBlog = blogs.find(b => b.id === id);
      
      if (foundBlog) {
        // Check if user can view this blog
        if (foundBlog.status !== 'approved' && user?.role !== 'admin' && foundBlog.authorId !== user?.id) {
          toast.error('Blog not found or not yet approved');
          navigate('/blogs');
          return;
        }
        setBlog(foundBlog);

        // Check if user has liked/bookmarked
        if (user) {
          const liked = localStorage.getItem(`liked_blogs_${user.id}`);
          const bookmarked = localStorage.getItem(`bookmarked_blogs_${user.id}`);
          if (liked) setIsLiked(JSON.parse(liked).includes(id));
          if (bookmarked) setIsBookmarked(JSON.parse(bookmarked).includes(id));
        }
      } else {
        toast.error('Blog not found');
        navigate('/blogs');
      }
    }
  }, [id, user, navigate]);

  const handleLike = () => {
    if (!user || !blog) {
      toast.error('Please login to like blogs');
      return;
    }

    const liked = localStorage.getItem(`liked_blogs_${user.id}`);
    const likedBlogs: string[] = liked ? JSON.parse(liked) : [];
    
    const updatedLiked = isLiked
      ? likedBlogs.filter(blogId => blogId !== blog.id)
      : [...likedBlogs, blog.id];
    
    localStorage.setItem(`liked_blogs_${user.id}`, JSON.stringify(updatedLiked));
    setIsLiked(!isLiked);

    // Update blog likes count
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      const blogs: Blog[] = JSON.parse(storedBlogs);
      const updatedBlogs = blogs.map(b => {
        if (b.id === blog.id) {
          return {
            ...b,
            likes: !isLiked ? b.likes + 1 : b.likes - 1,
          };
        }
        return b;
      });
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      setBlog({ ...blog, likes: !isLiked ? blog.likes + 1 : blog.likes - 1 });
    }

    toast.success(!isLiked ? 'Blog liked!' : 'Like removed');
  };

  const handleBookmark = () => {
    if (!user || !blog) {
      toast.error('Please login to bookmark blogs');
      return;
    }

    const bookmarked = localStorage.getItem(`bookmarked_blogs_${user.id}`);
    const bookmarkedBlogs: string[] = bookmarked ? JSON.parse(bookmarked) : [];
    
    const updatedBookmarked = isBookmarked
      ? bookmarkedBlogs.filter(blogId => blogId !== blog.id)
      : [...bookmarkedBlogs, blog.id];
    
    localStorage.setItem(`bookmarked_blogs_${user.id}`, JSON.stringify(updatedBookmarked));
    setIsBookmarked(!isBookmarked);
    toast.success(!isBookmarked ? 'Blog bookmarked!' : 'Bookmark removed');
  };

  const handleDelete = () => {
    if (!blog || !user) return;

    if (window.confirm('Are you sure you want to delete this blog?')) {
      const storedBlogs = localStorage.getItem('blogs');
      if (storedBlogs) {
        const blogs: Blog[] = JSON.parse(storedBlogs);
        const updatedBlogs = blogs.filter(b => b.id !== blog.id);
        localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
        toast.success('Blog deleted successfully');
        navigate('/blogs');
      }
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Loading...</p>
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
          <Button
            variant="ghost"
            onClick={() => navigate('/blogs')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>

          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border-gray-700">
            {/* Cover Image */}
            <div className="relative h-96 overflow-hidden rounded-t-lg">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-blue-600/90 backdrop-blur-sm">
                  {blog.category}
                </Badge>
                {blog.status !== 'approved' && (
                  <Badge className="bg-yellow-600/90 backdrop-blur-sm">
                    {blog.status}
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-8">
              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6 pb-6 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${
                      isLiked
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isLiked ? 'currentColor' : 'none'}
                    />
                    <span>{blog.likes}</span>
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`transition-colors ${
                      isBookmarked
                        ? 'text-blue-500'
                        : 'text-gray-400 hover:text-blue-500'
                    }`}
                  >
                    <Bookmark
                      className="w-5 h-5"
                      fill={isBookmarked ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
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
                    onClick={() => navigate(`/blogs/edit/${blog.id}`)}
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
      `}</style>
    </div>
  );
}
