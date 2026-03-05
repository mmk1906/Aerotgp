import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle, XCircle, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Blog } from '../data/blogData';
import { toast } from 'sonner';

export function BlogManagementTab() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
  };

  const handleApprove = (blogId: string) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        return { ...blog, status: 'approved' as const };
      }
      return blog;
    });
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    toast.success('Blog approved successfully');
  };

  const handleReject = (blogId: string) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        return { ...blog, status: 'rejected' as const };
      }
      return blog;
    });
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    toast.success('Blog rejected');
  };

  const handleDelete = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
      setBlogs(updatedBlogs);
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      toast.success('Blog deleted successfully');
    }
  };

  const pendingBlogs = blogs.filter(b => b.status === 'pending');
  const approvedBlogs = blogs.filter(b => b.status === 'approved');
  const rejectedBlogs = blogs.filter(b => b.status === 'rejected');

  return (
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
              Approved: {approvedBlogs.length}
            </Badge>
            <Badge className="bg-red-600">
              Rejected: {rejectedBlogs.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No blogs submitted yet
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Blogs */}
            {pendingBlogs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">Pending Approval</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{blog.category}</Badge>
                        </TableCell>
                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{blog.likes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/blogs/${blog.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleApprove(blog.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleReject(blog.id)}
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

            {/* Approved Blogs */}
            {approvedBlogs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">Approved Blogs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{blog.category}</Badge>
                        </TableCell>
                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{blog.likes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/blogs/${blog.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(blog.id)}
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
                <h3 className="text-lg font-semibold mb-3 text-red-400">Rejected Blogs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{blog.category}</Badge>
                        </TableCell>
                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/blogs/${blog.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleApprove(blog.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(blog.id)}
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
  );
}
