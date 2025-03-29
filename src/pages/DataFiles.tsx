
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileUp, FileText, Database, Trash2, Eye, FileDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/contexts/DataModeContext";

const DataFiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { isRealData } = useDataMode();

  // Demo files
  const demoFiles = [
    { id: 1, name: "Sales_Q2_2023.csv", type: "CSV", size: "245 KB", owner: "You", shared: false, created: "2023-06-30" },
    { id: 2, name: "Customer_Survey_Results.xlsx", type: "Excel", size: "1.2 MB", owner: "You", shared: true, created: "2023-07-15" },
    { id: 3, name: "Marketing_Campaign_Data.csv", type: "CSV", size: "890 KB", owner: "Jane Smith", shared: true, created: "2023-08-02" },
    { id: 4, name: "Website_Traffic_Analysis.xlsx", type: "Excel", size: "3.4 MB", owner: "You", shared: false, created: "2023-08-10" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRealData) {
      toast({
        title: "Real mode active",
        description: "File upload would be processed in real mode. Switch to demo mode to see a demo.",
      });
      return;
    }

    toast({
      title: "File uploaded successfully",
      description: "Your file has been uploaded and is ready for visualization",
    });
    setActiveTab("browse");
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
          <Card>
            <CardHeader>
              <CardTitle>Upload Data File</CardTitle>
              <CardDescription>
                Upload CSV or Excel files to analyze and visualize your data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted p-6 rounded-lg text-center">
                <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-2">Drag & Drop your files here</h3>
                <p className="text-sm text-muted-foreground mb-4">Or click to browse your files</p>
                <input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} />
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: .CSV, .XLSX, .XLS (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="mt-6">
          {isRealData ? (
            <div className="text-center p-8">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No files uploaded yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first data file to get started with analysis and visualization.
              </p>
              <Button onClick={() => setActiveTab("upload")}>
                Upload File
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Files</CardTitle>
                <CardDescription>
                  Your uploaded data files for analysis and visualization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="pb-2 font-medium text-left">Name</th>
                        <th className="pb-2 font-medium text-left">Type</th>
                        <th className="pb-2 font-medium text-left">Size</th>
                        <th className="pb-2 font-medium text-left">Date Uploaded</th>
                        <th className="pb-2 font-medium text-left">Shared</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {demoFiles.filter(f => f.owner === "You").map((file) => (
                        <tr key={file.id} className="py-2">
                          <td className="py-3 pr-4">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm font-medium">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm">{file.type}</td>
                          <td className="py-3 pr-4 text-sm">{file.size}</td>
                          <td className="py-3 pr-4 text-sm">{file.created}</td>
                          <td className="py-3 pr-4 text-sm">
                            {file.shared ? "Yes" : "No"}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(file)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          {isRealData ? (
            <div className="text-center p-8">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No shared files available</h3>
              <p className="text-muted-foreground mb-4">
                Files shared with you will appear here.
              </p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Shared Files</CardTitle>
                <CardDescription>
                  Files shared with you by your team members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="pb-2 font-medium text-left">Name</th>
                        <th className="pb-2 font-medium text-left">Type</th>
                        <th className="pb-2 font-medium text-left">Size</th>
                        <th className="pb-2 font-medium text-left">Owner</th>
                        <th className="pb-2 font-medium text-left">Date Shared</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {demoFiles.filter(f => f.owner !== "You" && f.shared).map((file) => (
                        <tr key={file.id} className="py-2">
                          <td className="py-3 pr-4">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm font-medium">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm">{file.type}</td>
                          <td className="py-3 pr-4 text-sm">{file.size}</td>
                          <td className="py-3 pr-4 text-sm">{file.owner}</td>
                          <td className="py-3 pr-4 text-sm">{file.created}</td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(file)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedFile && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedFile.name}</CardTitle>
              <CardDescription>
                {selectedFile.type} file • {selectedFile.size} • Uploaded on {selectedFile.created}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
              <Eye className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <p className="text-muted-foreground">Preview functionality is in development.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataFiles;
