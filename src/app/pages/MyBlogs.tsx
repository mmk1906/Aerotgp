import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
  id: string;
  title: string;
  category: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  tags: string[];
}

export function MyBlogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // Load user blogs from localStorage
    const allBlogs = JSON.parse(localStorage.getItem('userBlogs') || '[]');
    const userBlogs = allBlogs.filter((b: Blog) => b.authorId === user?.id);
    setBlogs(userBlogs);
  }, [user]);

  const handleDeleteBlog = (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      const allBlogs = JSON.parse(localStorage.getItem('userBlogs') || '[]');
      const updatedBlogs = allBlogs.filter((b: Blog) => b.id !== blogId);
      localStorage.setItem('userBlogs', JSON.stringify(updatedBlogs));
      setBlogs(blogs.filter((b) => b.id !== blogId));
      toast.success('Blog deleted successfully!');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const filterBlogs = (filter: string) => {
    if (filter === 'all') return blogs;
    return blogs.filter((b) => b.status === filter);
  };

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {blog.coverImage && (
            <div className="w-full md:w-48 h-48 bg-gray-800 flex-shrink-0">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-6 flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {blog.category}
                  </Badge>
                  <Badge className={getStatusColor(blog.status)}>
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {blog.content.substring(0, 150)}...
                </p>
              </div>
              {getStatusIcon(blog.status)}
            </div>

            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Link to={`/blogs/${blog.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>
              {blog.status !== 'approved' && (
                <>
                  <Link to={`/blogs/edit/${blog.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">My Blogs</h1>
          <p className="text-gray-400">
            Manage your blog posts and track their approval status
          </p>
        </div>
        <Link to="/blogs/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Blogs', value: blogs.length, color: 'text-blue-400' },
          { label: 'Approved', value: filterBlogs('approved').length, color: 'text-green-400' },
          { label: 'Pending', value: filterBlogs('pending').length, color: 'text-yellow-400' },
          { label: 'Rejected', value: filterBlogs('rejected').length, color: 'text-red-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className={`text-3xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="all">All Blogs</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {['all', 'approved', 'pending', 'rejected'].map((filter) => (
            <TabsContent key={filter} value={filter} className="mt-6">
              <div className="space-y-4">
                {filterBlogs(filter).length > 0 ? (
                  filterBlogs(filter).map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))
                ) : (
                  <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-semibold mb-2">No Blogs Found</h3>
                      <p className="text-gray-400 mb-6">
                        {filter === 'all'
                          ? "You haven't created any blogs yet. Share your knowledge with the community!"
                          : `You don't have any ${filter} blogs.`}
                      </p>
                      <Link to="/blogs/create">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Blog
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}
