
import React, { useState, useRef } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataFileUploaderProps {
  onFileUploaded: () => void;
}

export const DataFileUploader = ({ onFileUploaded }: DataFileUploaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("csv");
  const [visibility, setVisibility] = useState("organization");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name.split('.')[0]); // Default file name without extension
      
      // Try to detect file type from extension
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv' || extension === 'json' || extension === 'xlsx') {
        setFileType(extension);
      }
      
      setError(null);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setDescription("");
    setFileType("csv");
    setVisibility("organization");
    setProgress(0);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    if (!fileName.trim()) {
      setError("Please provide a name for your file");
      return;
    }
    
    setUploading(true);
    setProgress(10);
    setError(null);
    
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Date.now()}_${fileName}.${fileExt}`;
      
      setProgress(30);
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('datafiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (storageError) throw storageError;
      
      setProgress(70);
      
      // 2. Create metadata record in database - using type assertion to bypass TypeScript checking
      const { data: metaData, error: metaError } = await supabase
        .from('data_files')
        .insert({
          name: fileName,
          description: description,
          file_path: filePath,
          file_type: fileType,
          visibility: visibility,
          owner_id: user?.id,
          size_bytes: file.size
        })
        .select()
        .single();
        
      if (metaError) throw metaError;
      
      setProgress(100);
      
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and is ready for visualization",
      });
      
      resetForm();
      onFileUploaded();
      
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setError(error.message || "Failed to upload file. Please try again.");
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Data File</CardTitle>
        <CardDescription>
          Upload data files to visualize and share with your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.json,.xlsx,.xls"
            onChange={handleFileSelect}
          />
          <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
          <p className="text-sm text-muted-foreground mb-4">Supported formats: CSV, JSON, Excel</p>
          <Button variant="outline" type="button">
            Select File
          </Button>
          {file && (
            <div className="mt-4 text-left flex items-center gap-2 bg-muted p-3 rounded">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground text-xs">({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input 
              id="fileName"
              value={fileName} 
              onChange={(e) => setFileName(e.target.value)} 
              placeholder="Enter a name for your file"
              disabled={uploading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add a description for your file"
              disabled={uploading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select value={fileType} onValueChange={setFileType} disabled={uploading}>
                <SelectTrigger id="fileType">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility} disabled={uploading}>
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (Only Me)</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">Uploading... {progress}%</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm} disabled={uploading}>
          Reset
        </Button>
        <Button onClick={handleUpload} disabled={uploading || !file}>
          <FileUp className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </CardFooter>
    </Card>
  );
};
