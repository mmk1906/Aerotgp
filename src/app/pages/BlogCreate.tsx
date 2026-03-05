import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router';
import { Blog } from '../data/blogData';
import { toast } from 'sonner';

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
      const storedBlogs = localStorage.getItem('blogs');
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
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

    const storedBlogs = localStorage.getItem('blogs');
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
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            updatedAt: new Date().toISOString(),
          };
        }
        return blog;
      });
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      toast.success('Blog updated successfully!');
    } else {
      const newBlog: Blog = {
        id: `blog${Date.now()}`,
        title: formData.title,
        author: user.name,
        authorId: user.id,
        category: formData.category,
        coverImage: formData.coverImage,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        bookmarkedBy: [],
      };

      blogs.push(newBlog);
      localStorage.setItem('blogs', JSON.stringify(blogs));
      toast.success('Blog submitted for approval!');
    }

    navigate('/blogs');
  };

  const categories: Blog['category'][] = ['Aviation', 'Space', 'UAVs', 'Aerodynamics', 'Technology', 'Research'];

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
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {isEditing ? 'Edit Blog' : 'Create New Blog'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Blog Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter an engaging title..."
                    className="mt-2 bg-gray-800/50 border-gray-700 text-white"
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

                {/* Cover Image */}
                <div>
                  <Label htmlFor="coverImage">Cover Image *</Label>
                  <div className="mt-2">
                    <input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="coverImage"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Cover Image</span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({ ...formData, coverImage: '' });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-400 mt-2">
                    Or paste an image URL:
                  </p>
                  <Input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => {
                      setFormData({ ...formData, coverImage: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="mt-2 bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content">Blog Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your blog content here... You can use HTML tags for formatting."
                    rows={15}
                    className="mt-2 bg-gray-800/50 border-gray-700 text-white font-mono text-sm"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Tip: Use HTML tags like &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; for formatting.
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., Aerospace, Innovation, Research (comma separated)"
                    className="mt-2 bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Blog' : 'Submit for Approval'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/blogs')}
                  >
                    Cancel
                  </Button>
                </div>

                {!isEditing && (
                  <p className="text-sm text-gray-400 text-center">
                    Your blog will be reviewed by admins before being published.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
