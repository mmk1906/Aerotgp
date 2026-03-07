import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserBlogs, createBlog, updateBlog, deleteBlog, Blog } from '../services/databaseService';
import { CloudinaryImageUploader } from '../components/CloudinaryImageUploader';

export function MyBlogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Aviation',
    content: '',
    excerpt: '',
    tags: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Aviation', 'Space', 'UAVs', 'Aerodynamics', 'Technology', 'Research', 'Other'];

  useEffect(() => {
    if (user) {
      loadBlogs();
    }
  }, [user]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const userBlogs = await getUserBlogs(user!.id);
      setBlogs(userBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Aviation',
      content: '',
      excerpt: '',
      tags: '',
      imageUrl: '',
    });
    setShowCreateDialog(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      excerpt: blog.excerpt || '',
      tags: blog.tags?.join(', ') || '',
      imageUrl: blog.imageUrl || '',
    });
    setShowCreateDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a blog');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const blogData = {
        title: formData.title.trim(),
        category: formData.category,
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        imageUrl: formData.imageUrl,
        authorId: user.id,
        authorName: user.displayName || user.email || 'Anonymous',
        status: editingBlog?.status || ('pending' as const),
        likes: editingBlog?.likes || 0,
        views: editingBlog?.views || 0,
      };

      if (editingBlog) {
        // Update existing blog
        await updateBlog(editingBlog.id!, blogData);
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        await createBlog(blogData);
        toast.success('Blog submitted successfully! It will be reviewed by an admin.');
      }

      setShowCreateDialog(false);
      loadBlogs();
      setFormData({
        title: '',
        category: 'Aviation',
        content: '',
        excerpt: '',
        tags: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error submitting blog:', error);
      toast.error('Failed to submit blog. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await deleteBlog(blogId);
      toast.success('Blog deleted successfully');
      loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      published: 'bg-green-600',
      pending: 'bg-yellow-600',
      rejected: 'bg-red-600',
      draft: 'bg-gray-600',
    };

    return (
      <Badge className={`${variants[status] || 'bg-gray-600'} capitalize`}>
        {status}
      </Badge>
    );
  };

  const pendingBlogs = blogs.filter(b => b.status === 'pending');
  const publishedBlogs = blogs.filter(b => b.status === 'published');
  const rejectedBlogs = blogs.filter(b => b.status === 'rejected');
  const draftBlogs = blogs.filter(b => b.status === 'draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            My Blogs
          </h1>
          <p className="text-gray-400 mt-1">Manage your blog posts</p>
        </div>
        <Button
          onClick={handleCreateBlog}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Blog
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Blogs</p>
                <p className="text-2xl font-bold">{blogs.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Published</p>
                <p className="text-2xl font-bold">{publishedBlogs.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pending</p>
                <p className="text-2xl font-bold">{pendingBlogs.length}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Views</p>
                <p className="text-2xl font-bold">
                  {blogs.reduce((sum, b) => sum + (b.views || 0), 0)}
                </p>
              </div>
              <Eye className="w-12 h-12 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blogs Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-900/50">
          <TabsTrigger value="all">All ({blogs.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedBlogs.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBlogs.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftBlogs.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedBlogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BlogsList blogs={blogs} onEdit={handleEditBlog} onDelete={handleDeleteBlog} onView={(id) => navigate(`/blogs/${id}`)} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="published">
          <BlogsList blogs={publishedBlogs} onEdit={handleEditBlog} onDelete={handleDeleteBlog} onView={(id) => navigate(`/blogs/${id}`)} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="pending">
          <BlogsList blogs={pendingBlogs} onEdit={handleEditBlog} onDelete={handleDeleteBlog} onView={(id) => navigate(`/blogs/${id}`)} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="draft">
          <BlogsList blogs={draftBlogs} onEdit={handleEditBlog} onDelete={handleDeleteBlog} onView={(id) => navigate(`/blogs/${id}`)} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="rejected">
          <BlogsList blogs={rejectedBlogs} onEdit={handleEditBlog} onDelete={handleDeleteBlog} onView={(id) => navigate(`/blogs/${id}`)} getStatusBadge={getStatusBadge} />
        </TabsContent>
      </Tabs>

      {/* Create/Edit Blog Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Blog Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title"
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <Label>Cover Image</Label>
              <CloudinaryImageUploader
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                buttonText="Upload Cover Image"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Cover preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Short Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description (2-3 lines)"
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Blog Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                rows={12}
                required
                className="bg-slate-800 border-slate-700"
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: You can use HTML tags for formatting
              </p>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., aerospace, technology, innovation"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? 'Submitting...' : editingBlog ? 'Update Blog' : 'Submit Blog'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// BlogsList Component
function BlogsList({ 
  blogs, 
  onEdit, 
  onDelete, 
  onView,
  getStatusBadge 
}: { 
  blogs: Blog[]; 
  onEdit: (blog: Blog) => void; 
  onDelete: (id: string) => void; 
  onView: (id: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  if (blogs.length === 0) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No blogs found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {blogs.map((blog) => (
        <Card key={blog.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* Thumbnail */}
              {blog.imageUrl && (
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                      <Badge variant="outline">{blog.category}</Badge>
                      {getStatusBadge(blog.status)}
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {blog.excerpt && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views || 0} views</span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-1">
                      {blog.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(blog.id!)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(blog)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(blog.id!)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
