
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Code, PenTool, Eye } from "lucide-react";

type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

const templates: Template[] = [
  {
    id: "template-1",
    name: "Business Pro",
    category: "Corporate",
    description: "Professional template for business websites with a clean, modern design.",
    image: "bg-gradient-to-br from-blue-500 to-purple-600",
  },
  {
    id: "template-2",
    name: "E-commerce Basic",
    category: "E-commerce",
    description: "Simple and effective online store template with product showcase.",
    image: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    id: "template-3",
    name: "Service Provider",
    category: "Services",
    description: "Highlight your services with this professionally designed template.",
    image: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    id: "template-4",
    name: "Portfolio Minimal",
    category: "Portfolio",
    description: "Clean, minimalist design to showcase your work and projects.",
    image: "bg-gradient-to-br from-gray-700 to-gray-900",
  },
];

const Website = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground">
            Build and manage your online presence with our website builder.
          </p>
        </div>
        <Button size="sm" className="font-medium">
          <Plus className="h-4 w-4 mr-1" /> New Project
        </Button>
      </div>
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-4">
          <Card className="dashboard-card p-6">
            <div className="text-center p-8">
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating a new website project or choosing from our templates.
              </p>
              <div className="flex justify-center gap-2">
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> New Project
                </Button>
                <Button variant="outline">
                  Browse Templates
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className={`h-40 ${template.image} flex items-center justify-center`}>
                  <div className="font-bold text-white text-xl">{template.name}</div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="domains" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Domain management features will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Website settings will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <PenTool className="h-5 w-5 mr-2 text-purple-500" />
              Visual Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create beautiful websites with our intuitive drag-and-drop builder. No coding required.
            </p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-1" /> Launch Builder
            </Button>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Code className="h-5 w-5 mr-2 text-blue-500" />
              Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              For advanced users. Access the code directly and make custom modifications.
            </p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-1" /> Open Editor
            </Button>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-500" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View your website as visitors will see it before publishing changes.
            </p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-1" /> Open Preview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Website;
