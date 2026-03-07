import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  PenSquare, 
  Search,
  Calendar,
  User,
  Tag,
  Eye,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getPublishedBlogs, getAllBlogs, Blog } from '../services/databaseService';

export function Blogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Aviation', 'Space', 'UAVs', 'Aerodynamics', 'Technology', 'Research', 'Other'];

  useEffect(() => {
    loadBlogs();
  }, [user]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      // Admins can see all blogs, regular users only see published ones
      const fetchedBlogs = user?.role === 'admin' 
        ? await getAllBlogs() 
        : await getPublishedBlogs();
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const tags = blog.tags || [];
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get latest 3 blogs
  const latestBlogs = [...filteredBlogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get featured blog (most viewed)
  const featuredBlog = filteredBlogs.length > 0
    ? filteredBlogs.reduce((prev, current) => 
        (current.views || 0) > (prev.views || 0) ? current : prev
      )
    : null;

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const text = stripHtml(content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AeroTGP Blogs
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore insights, research, and innovations in aeronautical engineering
          </p>
        </motion.div>

        {/* Featured Blog */}
        {featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-semibold text-blue-400">Featured Blog</h2>
            </div>
            <Card 
              className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-lg border-blue-500/50 overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/blogs/${featuredBlog.id}`)}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full overflow-hidden">
                  <img
                    src={featuredBlog.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm">
                    {featuredBlog.category}
                  </Badge>
                </div>
                <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                    {featuredBlog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredBlog.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{featuredBlog.views || 0} views</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {getExcerpt(featuredBlog.content, 200)}
                  </p>
                  <Button 
                    className="w-fit bg-blue-600 hover:bg-blue-700"
                  >
                    Read More →
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search blogs, authors, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>

          {user && (
            <Button
              onClick={() => navigate('/portal/my-blogs')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full md:w-auto"
            >
              <PenSquare className="w-4 h-4 mr-2" />
              Write Blog
            </Button>
          )}
        </motion.div>

        {/* Latest Blogs Section */}
        {latestBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6">Latest Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard blog={blog} navigate={navigate} getExcerpt={getExcerpt} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Blogs Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-blue-400 mb-6">
            All Blogs {filteredBlogs.length > 0 && `(${filteredBlogs.length})`}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading blogs...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} navigate={navigate} getExcerpt={getExcerpt} />
                </motion.div>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No blogs found matching your criteria.</p>
                {user && (
                  <Button
                    onClick={() => navigate('/portal/my-blogs')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    Write the First Blog
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Blog Card Component
function BlogCard({ 
  blog, 
  navigate, 
  getExcerpt 
}: { 
  blog: Blog; 
  navigate: any; 
  getExcerpt: (content: string, maxLength?: number) => string;
}) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border-gray-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={() => navigate(`/blogs/${blog.id}`)}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-blue-600/90 backdrop-blur-sm">
            {blog.category}
          </Badge>
        </div>
        {blog.status !== 'published' && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-600/90 backdrop-blur-sm capitalize">
              {blog.status}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {blog.title}
        </h3>

        {/* Author and Date */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="truncate">{blog.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {getExcerpt(blog.content, 120)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{blog.views || 0} views</span>
          </div>
          <span className="text-blue-400 text-sm group-hover:text-blue-300">
            Read More →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
