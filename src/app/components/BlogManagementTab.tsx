import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle, XCircle, Eye, Edit, Trash2, FileText, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getAllBlogs, updateBlog, deleteBlog, Blog } from '../services/databaseService';

export function BlogManagementTab() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const fetchedBlogs = await getAllBlogs();
      // Sort by creation date, newest first
      const sortedBlogs = fetchedBlogs.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId: string) => {
    try {
      await updateBlog(blogId, { status: 'published' });
      setBlogs(blogs.map(blog => 
        blog.id === blogId ? { ...blog, status: 'published' as const } : blog
      ));
      toast.success('Blog published successfully');
    } catch (error) {
      console.error('Error approving blog:', error);
      toast.error('Failed to approve blog');
    }
  };

  const handleReject = async (blogId: string) => {
    try {
      await updateBlog(blogId, { status: 'rejected' });
      setBlogs(blogs.map(blog => 
        blog.id === blogId ? { ...blog, status: 'rejected' as const } : blog
      ));
      toast.success('Blog rejected');
    } catch (error) {
      console.error('Error rejecting blog:', error);
      toast.error('Failed to reject blog');
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setSelectedBlog(null);
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const pendingBlogs = blogs.filter(b => b.status === 'pending');
  const publishedBlogs = blogs.filter(b => b.status === 'published');
  const rejectedBlogs = blogs.filter(b => b.status === 'rejected');
  const draftBlogs = blogs.filter(b => b.status === 'draft');

  return (
    <>
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Blog Management
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Total: {blogs.length}
              </Badge>
              <Badge className="bg-yellow-600">
                Pending: {pendingBlogs.length}
              </Badge>
              <Badge className="bg-green-600">
                Published: {publishedBlogs.length}
              </Badge>
              <Badge className="bg-red-600">
                Rejected: {rejectedBlogs.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No blogs submitted yet
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Blogs */}
              {pendingBlogs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                    Pending Approval ({pendingBlogs.length})
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingBlogs.map((blog) => (
                        <TableRow key={blog.id} className="bg-yellow-500/5">
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>{blog.authorName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{blog.category}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-400">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBlog(blog)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(blog.id!)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(blog.id!)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Published Blogs */}
              {publishedBlogs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-400">
                    Published ({publishedBlogs.length})
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publishedBlogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>{blog.authorName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{blog.category}</Badge>
                          </TableCell>
                          <TableCell>{blog.views || 0}</TableCell>
                          <TableCell className="text-sm text-gray-400">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBlog(blog)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/blogs/${blog.id}`)}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(blog.id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Rejected Blogs */}
              {rejectedBlogs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-400">
                    Rejected ({rejectedBlogs.length})
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedBlogs.map((blog) => (
                        <TableRow key={blog.id} className="bg-red-500/5">
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>{blog.authorName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{blog.category}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-400">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBlog(blog)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(blog.id!)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(blog.id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Preview Dialog */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBlog && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl text-white flex items-center justify-between">
                  <span>Blog Preview</span>
                  <Badge className={
                    selectedBlog.status === 'published' ? 'bg-green-600' :
                    selectedBlog.status === 'pending' ? 'bg-yellow-600' :
                    'bg-red-600'
                  }>
                    {selectedBlog.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Cover Image */}
                {selectedBlog.imageUrl && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <img 
                      src={selectedBlog.imageUrl} 
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Meta Information */}
                <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-blue-400">Blog Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Author</p>
                        <p className="font-medium">{selectedBlog.authorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(selectedBlog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <Badge variant="outline" className="mt-1">{selectedBlog.category}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Views</p>
                      <p className="font-medium">{selectedBlog.views || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Title</h3>
                  <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
                </div>

                {/* Excerpt */}
                {selectedBlog.excerpt && (
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">Excerpt</h3>
                    <p className="text-gray-300 italic">{selectedBlog.excerpt}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Content</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  {selectedBlog.status === 'pending' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleApprove(selectedBlog.id!);
                          setSelectedBlog(null);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve & Publish
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleReject(selectedBlog.id!);
                          setSelectedBlog(null);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedBlog.status === 'rejected' && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApprove(selectedBlog.id!);
                        setSelectedBlog(null);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Publish
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/blogs/${selectedBlog.id}`)}
                  >
                    View on Site
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedBlog.id!)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
