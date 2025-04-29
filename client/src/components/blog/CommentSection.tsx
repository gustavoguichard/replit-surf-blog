import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { insertCommentSchema } from "@shared/schema";
import { CommentWithAuthor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface CommentSectionProps {
  postId: number;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  
  const { data: comments, isLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: [`/api/posts/${postId}/comments`],
  });
  
  const formSchema = insertCommentSchema.extend({
    content: z.string().min(1, "Comment cannot be empty"),
    userName: z.string().min(2, "Name is required").optional(),
    userEmail: z.string().email("Invalid email address").optional(),
  }).omit({ authorId: true });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      postId: postId,
      userName: "",
      userEmail: "",
    },
  });
  
  const replyForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      postId: postId,
      parentId: undefined,
      userName: "",
      userEmail: "",
    },
  });
  
  const commentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", "/api/comments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      form.reset();
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to post comment: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const replyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", "/api/comments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      replyForm.reset();
      setActiveReplyId(null);
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to post reply: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const likeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      return await apiRequest("POST", `/api/comments/${commentId}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to like comment: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    commentMutation.mutate(data);
  };
  
  const onReplySubmit = (data: z.infer<typeof formSchema>) => {
    if (activeReplyId) {
      const replyData = {
        ...data,
        parentId: activeReplyId,
      };
      replyMutation.mutate(replyData);
    }
  };
  
  const handleReplyClick = (commentId: number) => {
    setActiveReplyId(activeReplyId === commentId ? null : commentId);
    replyForm.reset({
      content: "",
      postId: postId,
      parentId: commentId,
      userName: "",
      userEmail: "",
    });
  };
  
  const handleLikeClick = (commentId: number) => {
    likeMutation.mutate(commentId);
  };

  const renderComment = (comment: CommentWithAuthor) => (
    <div key={comment.id} className="border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-start">
        <img 
          src={comment.author?.avatar || comment.userAvatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"} 
          alt={comment.author?.name || comment.userName || "Anonymous"} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-[#333333]">
              {comment.author?.name || comment.userName || "Anonymous"}
              {comment.author && (
                <span className="bg-[#48c9b0] bg-opacity-10 text-[#48c9b0] text-xs px-2 py-0.5 rounded ml-2">
                  Author
                </span>
              )}
            </h4>
            <span className="text-gray-500 text-sm font-accent">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 mt-2">{comment.content}</p>
          <div className="mt-3 flex items-center space-x-4">
            <button 
              className="text-gray-500 text-sm font-accent hover:text-[#1a5276] transition duration-150"
              onClick={() => handleLikeClick(comment.id)}
            >
              <ThumbsUp className="h-4 w-4 mr-1 inline" /> {comment.likes}
            </button>
            <button 
              className="text-gray-500 text-sm font-accent hover:text-[#1a5276] transition duration-150"
              onClick={() => handleReplyClick(comment.id)}
            >
              <Reply className="h-4 w-4 mr-1 inline" /> Reply
            </button>
          </div>
          
          {/* Reply form */}
          {activeReplyId === comment.id && (
            <div className="mt-4 bg-[#f5f5f5] p-4 rounded-lg">
              <h5 className="font-heading font-medium text-sm mb-3">Reply to {comment.author?.name || comment.userName}</h5>
              <Form {...replyForm}>
                <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-4">
                  <FormField
                    control={replyForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your reply..." 
                            className="w-full resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={replyForm.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={replyForm.control}
                      name="userEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Email (not published)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      disabled={replyMutation.isPending}
                      className="bg-[#1a5276] hover:bg-opacity-90"
                    >
                      {replyMutation.isPending ? "Posting..." : "Post Reply"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveReplyId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
      
      {/* Nested Comments (Replies) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-6 space-y-6">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start">
              <img 
                src={reply.author?.avatar || reply.userAvatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"} 
                alt={reply.author?.name || reply.userName || "Anonymous"} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-[#333333]">
                    {reply.author?.name || reply.userName || "Anonymous"}
                    {reply.author && (
                      <span className="bg-[#48c9b0] bg-opacity-10 text-[#48c9b0] text-xs px-2 py-0.5 rounded ml-2">
                        Author
                      </span>
                    )}
                  </h4>
                  <span className="text-gray-500 text-sm font-accent">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{reply.content}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <button 
                    className="text-gray-500 text-sm font-accent hover:text-[#1a5276] transition duration-150"
                    onClick={() => handleLikeClick(reply.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1 inline" /> {reply.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="my-12">
      <h3 className="font-heading font-bold text-2xl text-[#333333] mb-6">
        Comments ({comments?.length || 0})
      </h3>
      
      {/* Comment Form */}
      <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
        <h4 className="font-heading font-bold text-lg text-[#333333] mb-4">Leave a Comment</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="What are your thoughts?" 
                      rows={4}
                      className="w-full resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email (not published)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={commentMutation.isPending}
              className="bg-[#1a5276] hover:bg-opacity-90"
            >
              {commentMutation.isPending ? "Submitting..." : "Submit Comment"}
            </Button>
          </form>
        </Form>
      </div>
      
      {/* Comments */}
      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-200 pb-8">
              <div className="flex items-start">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <div className="mt-3 flex items-center space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {comments && comments.length > 0 ? (
            comments.map(renderComment)
          ) : (
            <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
