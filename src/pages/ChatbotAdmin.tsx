
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

import KnowledgeBaseManager from '@/components/chat/KnowledgeBaseManager';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatbotAdmin = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chatbot Administration</h1>
          <p className="text-muted-foreground">Manage your AI-powered assistant</p>
        </div>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Zenith Assistant</AlertTitle>
        <AlertDescription>
          The AI chatbot is available to users via the chat bubble in the bottom right corner of the application.
          Here you can manage the knowledge base that powers the assistant.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="knowledge-base">
        <TabsList className="mb-4">
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="test-interface">Test Interface</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge-base">
          <KnowledgeBaseManager />
        </TabsContent>
        
        <TabsContent value="test-interface">
          <Card>
            <CardHeader>
              <CardTitle>Test Interface</CardTitle>
              <CardDescription>
                Test the chatbot with this interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotAdmin;
