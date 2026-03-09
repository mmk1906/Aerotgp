import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  Loader2,
  UserPlus,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import {
  getAllJoinRequests,
  getPendingJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  ClubJoinRequest
} from '../../services/clubService';

export function JoinRequestsManagement() {
  const { user } = useAuth();
  
  const [allRequests, setAllRequests] = useState<ClubJoinRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ClubJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // View dialog
  const [selectedRequest, setSelectedRequest] = useState<ClubJoinRequest | null>(null);
  
  // Reject dialog
  const [rejectingRequest, setRejectingRequest] = useState<ClubJoinRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [all, pending] = await Promise.all([
        getAllJoinRequests(),
        getPendingJoinRequests()
      ]);
      setAllRequests(all);
      setPendingRequests(pending);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load join requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ClubJoinRequest) => {
    if (!confirm(`Approve ${request.userName} to join ${request.clubName}?`)) {
      return;
    }

    try {
      setProcessing(request.id!);
      await approveJoinRequest(request.id!, user!.id);
      toast.success(`${request.userName} has been approved and added to ${request.clubName}!`);
      await loadRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error.message || 'Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleOpenRejectDialog = (request: ClubJoinRequest) => {
    setRejectingRequest(request);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!rejectingRequest || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(rejectingRequest.id!);
      await rejectJoinRequest(rejectingRequest.id!, user!.id, rejectionReason);
      toast.success(`Request from ${rejectingRequest.userName} has been rejected`);
      setRejectingRequest(null);
      setRejectionReason('');
      await loadRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const RequestCard = ({ request }: { request: ClubJoinRequest }) => (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* User Info */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-1">{request.userName}</h4>
            <p className="text-sm text-gray-400">{request.userEmail}</p>
            {request.userPhone && (
              <p className="text-sm text-gray-400">{request.userPhone}</p>
            )}
          </div>

          {/* Club & Academic Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Club</p>
              <p className="text-sm font-semibold">{request.clubName}</p>
            </div>
            {request.userDepartment && (
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-semibold">{request.userDepartment}</p>
              </div>
            )}
            {request.userYear && (
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="text-sm font-semibold">{request.userYear}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Submitted</p>
              <p className="text-sm font-semibold">
                {new Date(request.submittedAt.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-slate-900/50 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-1">Reason for Joining</p>
            <p className="text-sm text-gray-300">{request.reason}</p>
          </div>

          {/* Status Badge */}
          <Badge
            variant={
              request.status === 'approved'
                ? 'default'
                : request.status === 'rejected'
                ? 'destructive'
                : 'secondary'
            }
          >
            {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
            {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
            {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {request.status.toUpperCase()}
          </Badge>

          {/* Reviewed Info */}
          {request.reviewedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Reviewed on {new Date(request.reviewedAt.seconds * 1000).toLocaleString()}
            </p>
          )}

          {/* Rejection Reason */}
          {request.status === 'rejected' && request.rejectionReason && (
            <div className="bg-red-900/20 border border-red-700/50 p-3 rounded-lg mt-3">
              <p className="text-xs text-red-500 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-400">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {request.status === 'pending' && (
          <div className="flex flex-col gap-2 ml-4">
            <Button
              size="sm"
              onClick={() => handleApprove(request)}
              disabled={processing === request.id}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing === request.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleOpenRejectDialog(request)}
              disabled={processing === request.id}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedRequest(request)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-blue-500">{allRequests.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-500">{pendingRequests.length}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-500">
                  {allRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-slate-900/50 border-slate-700">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Requests ({allRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Requests */}
        <TabsContent value="pending">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Requests */}
        <TabsContent value="all">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                All Join Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-semibold">{selectedRequest.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold">{selectedRequest.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Club</p>
                  <p className="font-semibold">{selectedRequest.clubName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge
                    variant={
                      selectedRequest.status === 'approved'
                        ? 'default'
                        : selectedRequest.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {selectedRequest.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Reason for Joining</p>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-sm">{selectedRequest.reason}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectingRequest} onOpenChange={() => setRejectingRequest(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Reject Join Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this application
            </DialogDescription>
          </DialogHeader>
          {rejectingRequest && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-sm mb-1">
                  <span className="font-semibold">{rejectingRequest.userName}</span> wants to join{' '}
                  <span className="font-semibold">{rejectingRequest.clubName}</span>
                </p>
              </div>

              <div>
                <Label>Rejection Reason</Label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this request is being rejected..."
                  rows={4}
                  className="bg-slate-800 border-slate-700 mt-2"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setRejectingRequest(null)}
                  disabled={processing === rejectingRequest.id}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={processing === rejectingRequest.id || !rejectionReason.trim()}
                >
                  {processing === rejectingRequest.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}