"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Send,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface OfferManagementActionsProps {
  offerId: string;
  currentStatus: string;
  onStatusChange: () => void;
  onView: () => void;
  onEdit?: () => void;
}

export function OfferManagementActions({
  offerId,
  currentStatus,
  onStatusChange,
  onView,
  onEdit
}: OfferManagementActionsProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: string, reason?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      toast.success(`Offer status updated to ${status}`);
      onStatusChange();
      setIsStatusDialogOpen(false);
      setReason('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/offers/${offerId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete offer');
      }

      toast.success('Offer deleted successfully');
      onStatusChange();
      setIsDeleteDialogOpen(false);
      setReason('');
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete offer');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusActions = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return [
          { label: 'Send Offer', value: 'sent', icon: Send, color: 'text-blue-600' },
          { label: 'Delete', value: 'delete', icon: Trash2, color: 'text-red-600', destructive: true }
        ];
      case 'sent':
        return [
          { label: 'Mark as Viewed', value: 'viewed', icon: Eye, color: 'text-blue-600' }
        ];
      case 'viewed':
        return [
          { label: 'Mark as Accepted', value: 'accepted', icon: CheckCircle, color: 'text-green-600' }
        ];
      case 'accepted':
        return [
          // No further actions for accepted offers
        ];
      default:
        return [];
    }
  };

  const statusActions = getStatusActions(currentStatus);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Offer
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {statusActions.map((action) => (
            <DropdownMenuItem
              key={action.value}
              onClick={() => {
                if (action.value === 'delete') {
                  setIsDeleteDialogOpen(true);
                } else {
                  setSelectedStatus(action.value);
                  setIsStatusDialogOpen(true);
                }
              }}
              className={action.destructive ? 'text-red-600' : ''}
            >
              <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Offer Status</DialogTitle>
            <DialogDescription>
              Update the status of this offer to &quot;{selectedStatus}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for status change..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsStatusDialogOpen(false);
                setReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusChange(selectedStatus, reason)}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Delete Offer
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this offer? This action cannot be undone.
              <br />
              <br />
              <strong>Note:</strong> Only draft offers can be deleted. Other offers should be archived or cancelled instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-reason">Reason for Deletion</Label>
              <Textarea
                id="delete-reason"
                placeholder="Enter reason for deletion..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Deleting...' : 'Delete Offer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
