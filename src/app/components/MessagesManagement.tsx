import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { MessageSquare, Eye, Trash2, Mail, Phone, User, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAllContactMessages, 
  updateContactMessage, 
  deleteDocument,
  ContactMessage 
} from '../services/databaseService';

export function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const fetchedMessages = await getAllContactMessages();
      // Sort by date, newest first
      const sortedMessages = fetchedMessages.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await updateContactMessage(messageId, { status: 'read' });
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, status: 'read' as const } : m
      ));
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteDocument('contactMessages', messageId);
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const newMessages = messages.filter(m => m.status === 'new');
  const readMessages = messages.filter(m => m.status === 'read');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">New Messages</p>
                <p className="text-2xl font-bold">{newMessages.length}</p>
              </div>
              <Badge className="bg-green-600 text-lg px-4 py-2">{newMessages.length}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Read Messages</p>
                <p className="text-2xl font-bold">{readMessages.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Contact Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No messages yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id} className={message.status === 'new' ? 'bg-blue-500/5' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-semibold flex items-center">
                          {message.name}
                          {message.status === 'new' && (
                            <Badge className="ml-2 bg-green-600 text-xs">New</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{message.email}</div>
                        {message.phone && (
                          <div className="text-xs text-gray-500">{message.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{message.subject}</p>
                        <p className="text-sm text-gray-400 truncate">{message.message}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {new Date(message.date).toLocaleDateString()}
                      <br />
                      <span className="text-xs">
                        {new Date(message.date).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={message.status === 'new' ? 'default' : 'secondary'}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {message.status === 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(message.id!)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(message.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          {selectedMessage && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center justify-between">
                  Message Details
                  <Badge variant={selectedMessage.status === 'new' ? 'default' : 'secondary'}>
                    {selectedMessage.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Received on {new Date(selectedMessage.date).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Sender Info */}
                <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-blue-400 mb-3">Sender Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium">{selectedMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-sm">{selectedMessage.email}</p>
                      </div>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium">{selectedMessage.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-sm">
                          {new Date(selectedMessage.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Subject</h3>
                  <p className="text-lg">{selectedMessage.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Message</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-slate-700">
                  {selectedMessage.status === 'new' && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleMarkAsRead(selectedMessage.id!);
                        setSelectedMessage(null);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMessage.id!)}
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
    </div>
  );
}
