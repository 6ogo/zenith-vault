import React, { useState } from "react";
import KnowledgeBaseManager from "@/components/chat/KnowledgeBaseManager";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Database, MessageCircle, Loader } from "lucide-react";
import { populateKnowledgeBase } from "@/utils/populateKnowledgeBase";
import { useToast } from "@/hooks/use-toast";

const ChatbotAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Function to populate sample data
  const handlePopulateSampleData = async () => {
    if (!confirm("This will add 10 sample FAQ entries to your knowledge base. Continue?")) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await populateKnowledgeBase();
      
      toast({
        title: "Sample data imported",
        description: `Successfully added ${result.processed} FAQ entries to the knowledge base`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error populating knowledge base:', error);
      
      toast({
        title: "Failed to import sample data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chatbot Administration</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Zenith Assistant chatbot and knowledge base
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handlePopulateSampleData}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          Import Sample Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            About Zenith Assistant
          </CardTitle>
          <CardDescription>
            The Zenith Assistant chatbot uses AI to help users find information and get support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Zenith Assistant is powered by a vector database that stores your FAQs and documentation,
            allowing it to provide context-aware answers to user questions. When a user asks a question,
            the assistant:
          </p>
          <ol className="list-decimal list-inside mt-4 space-y-2">
            <li>Converts the question into a vector embedding</li>
            <li>Searches for the most relevant information in the knowledge base</li>
            <li>Passes the question and context to the GROQ AI model</li>
            <li>Returns the generated response with source citations</li>
          </ol>
          <p className="mt-4">
            To improve the assistant's knowledge, add entries to the knowledge base below or
            use the bulk import feature to add multiple entries at once.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="knowledge-base">
        <TabsList>
          <TabsTrigger value="knowledge-base">
            <Database className="mr-2 h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="chat-interface">
            <MessageCircle className="mr-2 h-4 w-4" />
            Test Interface
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge-base" className="mt-4">
          <KnowledgeBaseManager />
        </TabsContent>
        
        <TabsContent value="chat-interface" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Chatbot</CardTitle>
                <CardDescription>
                  Test your chatbot interface and evaluate its responses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <ChatInterface />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Testing Guidelines</CardTitle>
                <CardDescription>
                  Tips for effectively testing your chatbot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">What to Test:</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Ask questions covered in your FAQs</li>
                    <li>Ask variations of the same questions</li>
                    <li>Ask follow-up questions to test context awareness</li>
                    <li>Test edge cases and questions not in your knowledge base</li>
                    <li>Check if sources are correctly cited</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Evaluating Responses:</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Accuracy: Is the information correct?</li>
                    <li>Relevance: Does it answer the actual question?</li>
                    <li>Completeness: Does it provide a comprehensive answer?</li>
                    <li>Tone: Is the response professional and helpful?</li>
                    <li>Citations: Are sources correctly identified?</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Improving Results:</h3>
                  <p>
                    If the chatbot isn't performing well on certain questions,
                    consider adding more targeted entries to the knowledge base or
                    rephrasing existing entries to better match how users ask questions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotAdmin;
