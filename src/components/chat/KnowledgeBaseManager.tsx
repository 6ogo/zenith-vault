
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Database, Trash2, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ingestKnowledgeBase } from "@/services/ai";

interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  type: 'faq' | 'documentation';
  created_at: string;
}

const KnowledgeBaseManager = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  
  // Form states
  const [entryType, setEntryType] = useState<'faq' | 'documentation'>('faq');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bulkData, setBulkData] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('id, title, content, type, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setEntries(data as KnowledgeEntry[]);
      }
    } catch (error) {
      console.error('Error fetching knowledge base entries:', error);
      toast({
        title: "Failed to load knowledge base entries",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use the knowledge-ingestion function to add a single entry
      const result = await ingestKnowledgeBase([{ title, content }], entryType);
      
      if (result.success) {
        toast({
          title: "Entry added successfully",
          description: `The ${entryType} entry was added to the knowledge base`,
          variant: "default"
        });
        
        // Reset form
        setTitle('');
        setContent('');
        
        // Refresh entries
        fetchEntries();
      } else {
        throw new Error('Failed to add entry');
      }
    } catch (error) {
      console.error('Error adding knowledge base entry:', error);
      toast({
        title: "Failed to add entry",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Entry deleted successfully",
        description: "The entry was removed from the knowledge base",
        variant: "default"
      });
      
      // Refresh entries
      fetchEntries();
    } catch (error) {
      console.error('Error deleting knowledge base entry:', error);
      toast({
        title: "Failed to delete entry",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkData.trim()) {
      toast({
        title: "No data provided",
        description: "Please enter data to import",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Parse the bulk data as JSON
      let parsedData;
      try {
        parsedData = JSON.parse(bulkData);
      } catch (e) {
        toast({
          title: "Invalid JSON format",
          description: "Please ensure your data is in valid JSON format",
          variant: "destructive"
        });
        return;
      }
      
      // Validate data
      if (!Array.isArray(parsedData)) {
        toast({
          title: "Invalid data format",
          description: "Data must be an array of objects",
          variant: "destructive"
        });
        return;
      }
      
      // Check for required fields based on entry type
      for (const entry of parsedData) {
        if (entryType === 'faq' && (!entry.question || !entry.answer)) {
          toast({
            title: "Invalid FAQ data",
            description: "Each FAQ entry must have 'question' and 'answer' fields",
            variant: "destructive"
          });
          return;
        }
        
        if (entryType === 'documentation' && (!entry.title || !entry.content)) {
          toast({
            title: "Invalid documentation data",
            description: "Each documentation entry must have 'title' and 'content' fields",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Transform data to the correct format if needed
      const formattedData = parsedData.map((entry: any) => ({
        title: entryType === 'faq' ? entry.question : entry.title,
        content: entryType === 'faq' ? entry.answer : entry.content
      }));
      
      // Use the knowledge-ingestion function to add entries
      const result = await ingestKnowledgeBase(formattedData, entryType);
      
      toast({
        title: "Bulk import completed",
        description: `Successfully processed ${result.processed} out of ${result.total} entries`,
        variant: "default"
      });
      
      // Reset form
      setBulkData('');
      
      // Refresh entries
      fetchEntries();
    } catch (error) {
      console.error('Error bulk importing knowledge base entries:', error);
      toast({
        title: "Failed to import data",
        description: "Please check your data format and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base Manager</CardTitle>
        <CardDescription>
          Manage the knowledge base used by the Zenith Assistant chatbot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="view">View Entries</TabsTrigger>
            <TabsTrigger value="add">Add Entry</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Knowledge Base Entries</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchEntries}
                disabled={isLoading}
              >
                <Database className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            {entries.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No entries found in the knowledge base
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Title</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.title}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate">{entry.content}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={entry.type === 'faq' ? 'default' : 'secondary'}>
                            {entry.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="entry-type">Entry Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="type-faq"
                      name="entry-type"
                      className="mr-2"
                      checked={entryType === 'faq'}
                      onChange={() => setEntryType('faq')}
                    />
                    <Label htmlFor="type-faq">FAQ</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="type-documentation"
                      name="entry-type"
                      className="mr-2"
                      checked={entryType === 'documentation'}
                      onChange={() => setEntryType('documentation')}
                    />
                    <Label htmlFor="type-documentation">Documentation</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">
                  {entryType === 'faq' ? 'Question' : 'Title'}
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={entryType === 'faq' ? 'Enter question...' : 'Enter title...'}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">
                  {entryType === 'faq' ? 'Answer' : 'Content'}
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={entryType === 'faq' ? 'Enter answer...' : 'Enter content...'}
                  rows={5}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bulk-type">Entry Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bulk-type-faq"
                      name="bulk-type"
                      className="mr-2"
                      checked={entryType === 'faq'}
                      onChange={() => setEntryType('faq')}
                    />
                    <Label htmlFor="bulk-type-faq">FAQ</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bulk-type-documentation"
                      name="bulk-type"
                      className="mr-2"
                      checked={entryType === 'documentation'}
                      onChange={() => setEntryType('documentation')}
                    />
                    <Label htmlFor="bulk-type-documentation">Documentation</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bulk-data">JSON Data</Label>
                <Textarea
                  id="bulk-data"
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  placeholder={entryType === 'faq' 
                    ? '[{"question": "What is Zenith Vault?", "answer": "Zenith Vault is..."}]' 
                    : '[{"title": "Getting Started", "content": "To get started with Zenith Vault..."}]'
                  }
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Data Format:</p>
                <pre className="mt-1 p-2 bg-muted rounded">
                  {entryType === 'faq' 
                    ? '[\n  {\n    "question": "Question text",\n    "answer": "Answer text"\n  },\n  ...\n]' 
                    : '[\n  {\n    "title": "Section title",\n    "content": "Section content"\n  },\n  ...\n]'
                  }
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t p-4">
        {activeTab === 'add' && (
          <Button 
            onClick={handleAddEntry} 
            disabled={isLoading || !title.trim() || !content.trim()}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        )}
        
        {activeTab === 'bulk' && (
          <Button 
            onClick={handleBulkImport} 
            disabled={isLoading || !bulkData.trim()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default KnowledgeBaseManager;
