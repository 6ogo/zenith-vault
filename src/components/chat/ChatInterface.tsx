
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Info, RefreshCcw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryChatbot } from "@/services/ai";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    type: string;
    similarity: number;
  }[];
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface = ({ className }: ChatInterfaceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'assistant',
    content: "Hello! I'm Zenith Assistant. How can I help you today?",
    timestamp: new Date()
  }]);
  const [conversations, setConversations] = useState<Array<{id: string, title: string}>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('id, title')
        .eq('user_id', supabase.auth.getUser().then(res => res.data.user?.id))
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setConversations(data);
        
        // If conversations exist and no conversation is selected, select the most recent one
        if (data.length > 0 && !currentConversationId) {
          setCurrentConversationId(data[0].id);
          fetchMessages(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }));
        
        setMessages(formattedMessages);
      } else {
        // If no messages in the conversation, set default welcome message
        setMessages([{
          id: '0',
          role: 'assistant',
          content: "Hello! I'm Zenith Assistant. How can I help you today?",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const createNewConversation = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use the chatbot",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.user.id,
          title: 'New Conversation'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentConversationId(data.id);
        setMessages([{
          id: '0',
          role: 'assistant',
          content: "Hello! I'm Zenith Assistant. How can I help you today?",
          timestamp: new Date()
        }]);
        
        // Update conversations list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Failed to create new conversation",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    try {
      // Check if user is authenticated
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use the chatbot",
          variant: "destructive"
        });
        return;
      }
      
      // Create or get conversation ID
      let conversationId = currentConversationId;
      if (!conversationId) {
        try {
          const { data, error } = await supabase
            .from('chat_conversations')
            .insert({
              user_id: userData.user.id,
              title: 'New Conversation'
            })
            .select()
            .single();
          
          if (error) throw error;
          
          if (data) {
            conversationId = data.id;
            setCurrentConversationId(data.id);
            
            // Update conversations list
            fetchConversations();
          }
        } catch (error) {
          console.error('Error creating conversation:', error);
          toast({
            title: "Failed to create conversation",
            description: "Please try again later",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Create user message locally
      const userMessageId = crypto.randomUUID();
      const userMessage = {
        id: userMessageId,
        role: 'user' as const,
        content: input,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        // Prepare message history for context (last 5 messages)
        const messageHistory = messages
          .slice(-5)
          .map(msg => ({ role: msg.role, content: msg.content }));
        
        // Call API
        const response = await queryChatbot({
          question: input,
          conversationId: conversationId!,
          messageHistory
        });
        
        // Create assistant message
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          sources: response.sources
        };

        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        
        // Update conversation title if it's 'New Conversation'
        const currentConversation = conversations.find(c => c.id === conversationId);
        if (currentConversation && currentConversation.title === 'New Conversation') {
          // Use the first user message as the conversation title (truncated)
          const newTitle = input.length > 30 ? input.substring(0, 30) + '...' : input;
          
          const { error } = await supabase
            .from('chat_conversations')
            .update({ title: newTitle })
            .eq('id', conversationId);
          
          if (error) {
            console.error('Error updating conversation title:', error);
          } else {
            // Update local conversations list
            fetchConversations();
          }
        }
      } catch (error) {
        console.error('Error querying chatbot:', error);
        toast({
          title: "Failed to get response",
          description: "Please try again later",
          variant: "destructive"
        });

        // Add error message
        setMessages(prevMessages => [
          ...prevMessages, 
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
            timestamp: new Date()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication required",
        description: "Please sign in to use the chatbot",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`flex flex-col h-[calc(100vh-2rem)] overflow-hidden ${className}`}>
      <CardHeader className="bg-background border-b shadow-sm flex flex-row items-center gap-4 p-4">
        <div className="flex-1">
          <CardTitle className="text-xl">Zenith Assistant</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={createNewConversation}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
      </CardHeader>
      <div className="grid grid-cols-5 h-full">
        <div className="col-span-1 border-r overflow-auto p-2 hidden md:block">
          <div className="space-y-2">
            {conversations.map(conversation => (
              <Button
                key={conversation.id}
                variant={conversation.id === currentConversationId ? "secondary" : "ghost"} 
                className="w-full justify-start text-left overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => {
                  setCurrentConversationId(conversation.id);
                  fetchMessages(conversation.id);
                }}
              >
                {conversation.title}
              </Button>
            ))}
            {conversations.length === 0 && (
              <div className="text-muted-foreground text-sm p-2">
                No conversations yet
              </div>
            )}
          </div>
        </div>
        <div className="col-span-5 md:col-span-4 flex flex-col h-full">
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-muted mr-12'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border opacity-80 text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <Info className="h-3 w-3" />
                        <span>Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source.title.length > 25 
                              ? source.title.substring(0, 25) + '...' 
                              : source.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted mr-12">
                  <div className="flex items-center space-x-2">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 resize-none"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
