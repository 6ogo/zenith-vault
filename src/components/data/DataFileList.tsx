
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Eye, FileDown, AlertCircle, BarChart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataFileListProps {
  mode: 'my-files' | 'shared';
  onFileSelect: (file: any) => void;
}

export const DataFileList = ({ mode, onFileSelect }: DataFileListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Using the from method without type checking
      let query = supabase
        .from('data_files')
        .select('*, profiles:owner_id(full_name)');

      if (mode === 'my-files') {
        // Files owned by me
        query = query.eq('owner_id', user?.id);
      } else {
        // Files shared with me or my organization
        query = query
          .neq('owner_id', user?.id)
          .or(`visibility.eq.public,visibility.eq.organization`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Format the data
      const formattedData = data.map(file => ({
        ...file,
        owner_name: file.profiles?.full_name || 'Unknown'
      }));

      setFiles(formattedData);
    } catch (error: any) {
      console.error("Error loading files:", error);
      setError(error.message || "Failed to load files. Please try again.");
      toast({
        title: "Error loading files",
        description: error.message || "Failed to load files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [mode, user?.id]);

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      // 1. Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('datafiles')
        .remove([filePath]);

      if (storageError) throw storageError;

      // 2. Delete the metadata from the database
      const { error: dbError } = await supabase
        .from('data_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // 3. Update the UI
      setFiles(files.filter(file => file.id !== fileId));

      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('datafiles')
        .download(filePath);

      if (error) throw error;

      // Create a download link and trigger the download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your file is being downloaded",
      });
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredFiles = searchTerm
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : files;

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return <Badge variant="outline">Private</Badge>;
      case 'organization':
        return <Badge variant="secondary">Organization</Badge>;
      case 'public':
        return <Badge variant="default">Public</Badge>;
      default:
        return <Badge variant="outline">{visibility}</Badge>;
    }
  };

  const getFileSizeDisplay = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>{mode === 'my-files' ? 'My Files' : 'Shared Files'}</CardTitle>
            <CardDescription>
              {mode === 'my-files' 
                ? 'Manage your uploaded data files' 
                : 'Access files shared by your organization members'}
            </CardDescription>
          </div>
          <div className="w-full md:w-1/3">
            <Input 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-8">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm 
              ? "No files match your search criteria"
              : mode === 'my-files'
                ? "You haven't uploaded any files yet"
                : "No shared files available"
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.filter(file => 
                file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        {file.description && (
                          <div className="text-xs text-muted-foreground">{file.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">{file.file_type}</Badge>
                  </TableCell>
                  <TableCell>{(file.size_bytes < 1024) 
                    ? `${file.size_bytes} B` 
                    : (file.size_bytes < 1024 * 1024) 
                      ? `${(file.size_bytes / 1024).toFixed(1)} KB`
                      : `${(file.size_bytes / (1024 * 1024)).toFixed(1)} MB`}</TableCell>
                  <TableCell>
                    {file.visibility === 'private' 
                      ? <Badge variant="outline">Private</Badge>
                      : file.visibility === 'organization'
                        ? <Badge variant="secondary">Organization</Badge>
                        : <Badge variant="default">Public</Badge>}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{format(new Date(file.created_at), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-muted-foreground">By {file.owner_name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onFileSelect(file)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View & Visualize
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadFile(file.file_path, `${file.name}.${file.file_type}`)}>
                          <FileDown className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        {file.owner_id === user?.id && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteFile(file.id, file.file_path)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {files.filter(file => 
            file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
          ).length} {files.filter(file => 
            file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 1 ? 'file' : 'files'}
        </div>
        <Button variant="outline" size="sm" onClick={loadFiles}>Refresh</Button>
      </CardFooter>
    </Card>
  );
};
