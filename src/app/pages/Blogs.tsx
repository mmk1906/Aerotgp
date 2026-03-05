import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  PenSquare, 
  Search, 
  Filter, 
  Heart, 
  Bookmark, 
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Blog, mockBlogs } from '../data/blogData';
import { toast } from 'sonner';

export function Blogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedBlogs, setLikedBlogs] = useState<string[]>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>([]);

  const categories = ['all', 'Aviation', 'Space', 'UAVs', 'Aerodynamics', 'Technology', 'Research'];

  useEffect(() => {
    // Load blogs from localStorage or use mock data
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      setBlogs(mockBlogs);
      localStorage.setItem('blogs', JSON.stringify(mockBlogs));
    }

    // Load user's liked and bookmarked blogs
    if (user) {
      const liked = localStorage.getItem(`liked_blogs_${user.id}`);
      const bookmarked = localStorage.getItem(`bookmarked_blogs_${user.id}`);
      if (liked) setLikedBlogs(JSON.parse(liked));
      if (bookmarked) setBookmarkedBlogs(JSON.parse(bookmarked));
    }
  }, [user]);

  const filteredBlogs = blogs.filter(blog => {
    // Only show approved blogs to regular users
    if (user?.role !== 'admin' && blog.status !== 'approved') {
      return false;
    }
    
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLike = (blogId: string) => {
    if (!user) {
      toast.error('Please login to like blogs');
      return;
    }

    const updatedLiked = likedBlogs.includes(blogId)
      ? likedBlogs.filter(id => id !== blogId)
      : [...likedBlogs, blogId];
    
    setLikedBlogs(updatedLiked);
    localStorage.setItem(`liked_blogs_${user.id}`, JSON.stringify(updatedLiked));

    // Update blog likes count
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        return {
          ...blog,
          likes: updatedLiked.includes(blogId) ? blog.likes + 1 : blog.likes - 1,
          likedBy: updatedLiked.includes(blogId) 
            ? [...blog.likedBy, user.id]
            : blog.likedBy.filter(id => id !== user.id)
        };
      }
      return blog;
    });

    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    toast.success(updatedLiked.includes(blogId) ? 'Blog liked!' : 'Like removed');
  };

  const handleBookmark = (blogId: string) => {
    if (!user) {
      toast.error('Please login to bookmark blogs');
      return;
    }

    const updatedBookmarked = bookmarkedBlogs.includes(blogId)
      ? bookmarkedBlogs.filter(id => id !== blogId)
      : [...bookmarkedBlogs, blogId];
    
    setBookmarkedBlogs(updatedBookmarked);
    localStorage.setItem(`bookmarked_blogs_${user.id}`, JSON.stringify(updatedBookmarked));
    toast.success(updatedBookmarked.includes(blogId) ? 'Blog bookmarked!' : 'Bookmark removed');
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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
                placeholder="Search blogs, tags..."
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
              onClick={() => navigate('/blogs/create')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full md:w-auto"
            >
              <PenSquare className="w-4 h-4 mr-2" />
              Write Blog
            </Button>
          )}
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border-gray-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden h-full flex flex-col">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-600/90 backdrop-blur-sm">
                      {blog.category}
                    </Badge>
                  </div>
                  {blog.status !== 'approved' && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-600/90 backdrop-blur-sm">
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
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {stripHtml(blog.content).substring(0, 150)}...
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLike(blog.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likedBlogs.includes(blog.id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={likedBlogs.includes(blog.id) ? 'currentColor' : 'none'}
                        />
                        <span className="text-sm">{blog.likes}</span>
                      </button>
                      <button
                        onClick={() => handleBookmark(blog.id)}
                        className={`transition-colors ${
                          bookmarkedBlogs.includes(blog.id)
                            ? 'text-blue-500'
                            : 'text-gray-400 hover:text-blue-500'
                        }`}
                      >
                        <Bookmark
                          className="w-5 h-5"
                          fill={bookmarkedBlogs.includes(blog.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                    <Button
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No blogs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
