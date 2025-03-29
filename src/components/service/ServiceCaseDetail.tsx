
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Clock, AlertCircle, CheckCircle, MoreHorizontal, Send } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import ServiceCaseAIHelper from "./ServiceCaseAIHelper";
import { ServiceCase, ServiceCaseComment } from '@/models/serviceCase';

interface ServiceCaseDetailProps {
  serviceCase: ServiceCase;
  onUpdate: () => void;
  onClose: () => void;
}

const ServiceCaseDetail: React.FC<ServiceCaseDetailProps> = ({ serviceCase, onUpdate, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [comments, setComments] = useState<ServiceCaseComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(serviceCase.status);
  const [updatedPriority, setUpdatedPriority] = useState(serviceCase.priority);
  const [updatedCategory, setUpdatedCategory] = useState(serviceCase.category);
  
  const { toast } = useToast();

  // Fetch comments when component mounts
  React.useEffect(() => {
    fetchComments();
  }, [serviceCase.id]);

  const fetchComments = async () => {
    try {
      // Since we don't have a service_case_comments table, we'll use a mock implementation
      // In a real-world scenario, this would be replaced with actual DB calls
      
      // Mock implementation for demo purposes
      const mockComments: ServiceCaseComment[] = [
        {
          id: '1',
          content: 'I\'ve started looking into this issue.',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          is_internal: true,
          author: {
            id: '123',
            name: 'Support Agent',
            avatar: '/placeholder-user.jpg'
          }
        },
        {
          id: '2',
          content: 'Customer has reported this is happening consistently after the latest update.',
          created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          is_internal: false,
          author: {
            id: '456',
            name: 'John Doe',
            avatar: '/placeholder-user.jpg'
          }
        }
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // For demo purposes, we'll just add the comment to the local state
      // In a real app, this would store the comment in the database
      
      const newCommentObj: ServiceCaseComment = {
        id: Date.now().toString(),
        content: newComment,
        is_internal: isInternal,
        created_at: new Date().toISOString(),
        author: {
          id: userData.user.id,
          name: userData.user.user_metadata?.full_name || 'User',
          avatar: userData.user.user_metadata?.avatar_url
        }
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCase = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would update the case in the database
      // For demo purposes, we'll just toast a success message
      
      setIsEditing(false);
      onUpdate();
      
      toast({
        title: "Case updated",
        description: "The service case has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating case:', error);
      toast({
        title: "Error",
        description: "Failed to update case",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
      case 'in progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{serviceCase.subject}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {!isEditing ? (
                    <>
                      {getStatusBadge(serviceCase.status)}
                      {getPriorityBadge(serviceCase.priority)}
                      <Badge variant="outline">{serviceCase.category}</Badge>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="status">Status</Label>
                        <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
                          <SelectTrigger id="status" className="w-[140px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={updatedPriority} onValueChange={setUpdatedPriority}>
                          <SelectTrigger id="priority" className="w-[140px]">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="category">Category</Label>
                        <Select value={updatedCategory} onValueChange={setUpdatedCategory}>
                          <SelectTrigger id="category" className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical Support">Technical Support</SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Feature Request">Feature Request</SelectItem>
                            <SelectItem value="Account">Account</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleUpdateCase} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <div className="p-3 rounded-md border whitespace-pre-wrap">
                    {serviceCase.description}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>{serviceCase.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{serviceCase.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{serviceCase.customer.email}</p>
                      {serviceCase.customer.company && (
                        <p className="text-sm text-muted-foreground">{serviceCase.customer.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h3>
                  {serviceCase.assignee ? (
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={serviceCase.assignee.avatar || "/placeholder-user.jpg"} />
                        <AvatarFallback>{serviceCase.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{serviceCase.assignee.name}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Unassigned</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{formatDistanceToNow(new Date(serviceCase.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{formatDistanceToNow(new Date(serviceCase.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ServiceCaseAIHelper 
        serviceCaseId={serviceCase.id}
        caseSubject={serviceCase.subject}
        caseDescription={serviceCase.description}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Comments & Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="internal">Internal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ScrollArea className="h-[300px] pr-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No comments yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className={`p-3 rounded-lg border ${comment.is_internal ? 'bg-muted/50' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.author.avatar || "/placeholder-user.jpg"} />
                              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            {comment.is_internal && (
                              <Badge variant="outline" className="text-xs">Internal</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">
                          {comment.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="public">
              <ScrollArea className="h-[300px] pr-4">
                {comments.filter(c => !c.is_internal).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No public comments yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments
                      .filter(comment => !comment.is_internal)
                      .map((comment) => (
                        <div key={comment.id} className="p-3 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={comment.author.avatar || "/placeholder-user.jpg"} />
                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{comment.author.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="whitespace-pre-wrap text-sm">
                            {comment.content}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="internal">
              <ScrollArea className="h-[300px] pr-4">
                {comments.filter(c => c.is_internal).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No internal comments yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments
                      .filter(comment => comment.is_internal)
                      .map((comment) => (
                        <div key={comment.id} className="p-3 rounded-lg border bg-muted/50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={comment.author.avatar || "/placeholder-user.jpg"} />
                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <Badge variant="outline" className="text-xs">Internal</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="whitespace-pre-wrap text-sm">
                            {comment.content}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full space-y-3">
            <Textarea 
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="internal-comment"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded text-primary"
                />
                <Label htmlFor="internal-comment" className="text-sm">Internal comment</Label>
              </div>
              <Button onClick={handleAddComment} disabled={!newComment.trim() || isLoading}>
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceCaseDetail;
