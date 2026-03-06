import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router';
import { Blog } from '../data/blogData';
import { toast } from 'sonner';
import { CloudinaryImageUploader } from '../components/CloudinaryImageUploader';
import type { CloudinaryUploadResult } from '../services/cloudinaryService';

export function BlogCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Aviation' as Blog['category'],
    coverImage: '',
    content: '',
    tags: '',
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      const storedBlogs = localStorage.getItem('userBlogs');
      if (storedBlogs) {
        const blogs: Blog[] = JSON.parse(storedBlogs);
        const blog = blogs.find(b => b.id === id);
        if (blog) {
          // Check if user owns this blog or is admin
          if (blog.authorId !== user.id && user.role !== 'admin') {
            toast.error('You can only edit your own blogs');
            navigate('/blogs');
            return;
          }
          setFormData({
            title: blog.title,
            category: blog.category,
            coverImage: blog.coverImage,
            content: blog.content,
            tags: blog.tags.join(', '),
          });
          setImagePreview(blog.coverImage);
        }
      }
    }
  }, [user, id, isEditing, navigate]);

  const handleCloudinaryUpload = (result: CloudinaryUploadResult) => {
    setFormData({ ...formData, coverImage: result.secure_url });
    setImagePreview(result.secure_url);
    toast.success('Cover image uploaded to Cloudinary!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create a blog');
      return;
    }

    if (!formData.title || !formData.content || !formData.coverImage) {
      toast.error('Please fill in all required fields');
      return;
    }

    const storedBlogs = localStorage.getItem('userBlogs');
    const blogs: Blog[] = storedBlogs ? JSON.parse(storedBlogs) : [];

    if (isEditing) {
      const updatedBlogs = blogs.map(blog => {
        if (blog.id === id) {
          return {
            ...blog,
            title: formData.title,
            category: formData.category,
            coverImage: formData.coverImage,
            content: formData.content,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
          };
        }
        return blog;
      });

      localStorage.setItem('userBlogs', JSON.stringify(updatedBlogs));
      toast.success('Blog updated successfully!');
    } else {
      const newBlog: Blog = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        coverImage: formData.coverImage,
        excerpt: formData.content.substring(0, 150) + '...',
        content: formData.content,
        author: user.name || user.email,
        authorId: user.id,
        date: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(formData.content.split(' ').length / 200) + ' min',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        views: 0,
        likes: 0,
        comments: 0,
        status: 'published',
      };

      blogs.unshift(newBlog);
      localStorage.setItem('userBlogs', JSON.stringify(blogs));
      toast.success('Blog created successfully!');
    }

    navigate('/portal/my-blogs');
  };

  const categories: Blog['category'][] = [
    'Aviation',
    'Aerospace',
    'Engineering',
    'Research',
    'Technology',
    'Education',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/portal/my-blogs')}
            className="border-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Blogs
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h1>
        </div>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Blog Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 bg-gray-800/50 border-gray-700"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Blog['category'] })}
                    className="mt-2 w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., Drones, AI, Innovation"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="mt-2 bg-gray-800/50 border-gray-700"
                  />
                </div>

                {/* Cover Image */}
                <div className="md:col-span-2">
                  <Label>Cover Image *</Label>
                  <div className="mt-2">
                    <CloudinaryImageUploader
                      category="blog"
                      onUploadComplete={handleCloudinaryUpload}
                      existingImageUrl={imagePreview}
                      buttonText="Upload Blog Cover Image"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="mt-2 min-h-[300px] bg-gray-800/50 border-gray-700"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/portal/my-blogs')}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Blog' : 'Publish Blog'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
