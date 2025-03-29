
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ingestKnowledgeBase } from "@/services/ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { populateIntegrationDocs } from '@/utils/documentationExtractor';

interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  type: string;
  created_at: string;
  organization_id?: string;
}

const KnowledgeBaseManager = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'faq' | 'documentation'>('faq');
  const { toast } = useToast();
  const { user } = useAuth();
  const organizationId = user?.user_metadata?.organization_id;

  useEffect(() => {
    fetchKnowledgeEntries();
  }, []);

  const fetchKnowledgeEntries = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('knowledge_base')
        .select('*');
      
      if (organizationId) {
        // Filter entries that either have no organization_id (global) or match the current organization
        query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Add a type cast to satisfy TypeScript
      setEntries(data as KnowledgeEntry[]);
    } catch (error) {
      console.error('Error fetching knowledge base entries:', error);
      toast({
        title: "Failed to load knowledge base",
        description: "Could not retrieve knowledge base entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await ingestKnowledgeBase(
        [{ title: newTitle, content: newContent }],
        newType,
        organizationId
      );
      
      if (result.success) {
        toast({
          title: "Entry added",
          description: "Knowledge base entry has been added successfully",
        });
        
        // Clear the form
        setNewTitle('');
        setNewContent('');
        
        // Refresh the list
        fetchKnowledgeEntries();
      } else {
        throw new Error("Failed to add entry");
      }
    } catch (error) {
      console.error('Error adding knowledge base entry:', error);
      toast({
        title: "Failed to add entry",
        description: "There was an error adding the entry to the knowledge base",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIntegrationDocs = async () => {
    setIsLoading(true);
    try {
      const result = await populateIntegrationDocs();
      
      if (result.success) {
        toast({
          title: "Integration docs added",
          description: `Added ${result.processed} out of ${result.total} integration documentation entries`,
        });
        
        // Refresh the list
        fetchKnowledgeEntries();
      } else {
        throw new Error("Failed to add integration documentation");
      }
    } catch (error) {
      console.error('Error adding integration documentation:', error);
      toast({
        title: "Failed to add integration docs",
        description: "There was an error adding the integration documentation to the knowledge base",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Entry deleted",
        description: "Knowledge base entry has been removed",
      });
      
      // Refresh the list
      fetchKnowledgeEntries();
    } catch (error) {
      console.error('Error deleting knowledge base entry:', error);
      toast({
        title: "Failed to delete entry",
        description: "There was an error removing the entry from the knowledge base",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Knowledge Entry</CardTitle>
          <CardDescription>
            Add information to your knowledge base to help the AI assistant answer questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={newType} onValueChange={(value) => setNewType(value as 'faq' | 'documentation')}>
              <SelectTrigger>
                <SelectValue placeholder="Select entry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={handleAddIntegrationDocs}
            disabled={isLoading}
            variant="outline"
          >
            <FileCode className="h-4 w-4 mr-2" />
            Add Integration Docs
          </Button>
          <Button 
            onClick={handleAddEntry}
            disabled={isLoading || !newTitle.trim() || !newContent.trim()}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Entries</CardTitle>
          <CardDescription>
            Manage your AI assistant's knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No entries yet. Add your first knowledge base entry above.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseManager;
