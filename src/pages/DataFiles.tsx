
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileUp, FileText, Database, Trash2, Eye, FileDown, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DataFilePreview } from "@/components/data/DataFilePreview";
import { DataFileUploader } from "@/components/data/DataFileUploader";
import { DataFileList } from "@/components/data/DataFileList";

const DataFiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Files</h1>
          <p className="text-muted-foreground mt-2">
            Upload, manage, and visualize your data files
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="browse">My Files</TabsTrigger>
          <TabsTrigger value="shared">Shared Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <DataFileUploader onFileUploaded={() => {
            toast({
              title: "File uploaded successfully",
              description: "Your file has been uploaded and is ready for visualization",
            });
            setActiveTab("browse");
          }} />
        </TabsContent>
        
        <TabsContent value="browse" className="mt-6">
          <DataFileList 
            mode="my-files" 
            onFileSelect={(file) => setSelectedFile(file)} 
          />
        </TabsContent>
        
        <TabsContent value="shared" className="mt-6">
          <DataFileList 
            mode="shared" 
            onFileSelect={(file) => setSelectedFile(file)} 
          />
        </TabsContent>
      </Tabs>

      {selectedFile && (
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedFile.name}</CardTitle>
                <CardDescription>
                  Uploaded by {selectedFile.owner_name || "Unknown"} on {new Date(selectedFile.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                <Eye className="h-4 w-4 mr-2" />
                Close Preview
              </Button>
            </CardHeader>
            <CardContent>
              <DataFilePreview file={selectedFile} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataFiles;
