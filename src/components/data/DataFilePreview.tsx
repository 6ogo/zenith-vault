
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart as BarChartIcon, PieChart, LineChart, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart as RPieChart,
  Pie,
  Cell,
  LineChart as RLineChart,
  Line
} from 'recharts';

interface DataFilePreviewProps {
  file: any;
}

export const DataFilePreview = ({ file }: DataFilePreviewProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("table");
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartConfig, setChartConfig] = useState({
    xAxis: '',
    yAxis: '',
    chartType: 'bar'
  });

  // Sample colors for charts
  const COLORS = ['#003366', '#0066B3', '#338ED1', '#66B5E8', '#99D6F8', '#CCE7F9'];

  useEffect(() => {
    loadFileData();
  }, [file]);

  const loadFileData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get file URL from storage
      const { data: urlData, error: urlError } = await supabase.storage
        .from('datafiles')
        .createSignedUrl(file.file_path, 60); // 60 seconds expiry
      
      if (urlError) throw urlError;
      
      if (!urlData?.signedUrl) {
        throw new Error("Failed to generate file URL");
      }

      // Fetch and parse the file based on its type
      const response = await fetch(urlData.signedUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      let parsedData: any[] = [];
      
      if (file.file_type === 'csv') {
        const text = await response.text();
        parsedData = parseCSV(text);
      } else if (file.file_type === 'json') {
        parsedData = await response.json();
      } else {
        throw new Error(`Unsupported file type: ${file.file_type}`);
      }

      // Ensure data is an array
      if (!Array.isArray(parsedData)) {
        // If it's an object with nested data, try to find the array
        const nestedArray = findNestedArray(parsedData);
        if (nestedArray) {
          parsedData = nestedArray;
        } else {
          parsedData = [parsedData]; // Wrap in array as last resort
        }
      }

      // Extract columns from first item
      if (parsedData.length > 0) {
        const cols = Object.keys(parsedData[0]);
        setColumns(cols);
        
        // Set initial chart configuration
        if (cols.length >= 2) {
          const numericCols = cols.filter(col => 
            !isNaN(Number(parsedData[0][col])) && typeof parsedData[0][col] !== 'boolean'
          );
          
          const nonNumericCols = cols.filter(col => 
            isNaN(Number(parsedData[0][col])) || typeof parsedData[0][col] === 'boolean'
          );
          
          setChartConfig({
            xAxis: nonNumericCols.length > 0 ? nonNumericCols[0] : cols[0],
            yAxis: numericCols.length > 0 ? numericCols[0] : cols[1],
            chartType: 'bar'
          });
        }
      }

      setData(parsedData);
    } catch (error: any) {
      console.error("Error loading file data:", error);
      setError(error.message || "Failed to load file data");
      toast({
        title: "Error previewing file",
        description: error.message || "Failed to load file data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to find a nested array in a complex JSON object
  const findNestedArray = (obj: any): any[] | null => {
    for (const key in obj) {
      if (Array.isArray(obj[key]) && obj[key].length > 0) {
        return obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = findNestedArray(obj[key]);
        if (result) return result;
      }
    }
    return null;
  };

  // Parse CSV text to array of objects
  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        // Try to convert to number if possible
        const value = values[index] || '';
        const numValue = Number(value);
        row[header] = !isNaN(numValue) ? numValue : value;
      });
      
      return row;
    });
  };

  const renderTable = () => {
    if (data.length === 0) return <div>No data available</div>;
    
    // Limit to first 100 rows for performance
    const displayData = data.slice(0, 100);
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, i) => (
              <TableRow key={i}>
                {columns.map(column => (
                  <TableCell key={column}>{String(row[column] !== undefined ? row[column] : '')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length > 100 && (
          <div className="text-center text-xs text-muted-foreground mt-4">
            Showing first 100 rows of {data.length} total rows
          </div>
        )}
      </div>
    );
  };

  const renderChartControls = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="grid gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium">Chart Type</label>
          <div className="flex gap-2">
            <Button 
              variant={chartConfig.chartType === 'bar' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartConfig({...chartConfig, chartType: 'bar'})}
            >
              <BarChartIcon className="w-4 h-4 mr-2" />
              Bar
            </Button>
            <Button 
              variant={chartConfig.chartType === 'line' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartConfig({...chartConfig, chartType: 'line'})}
            >
              <LineChart className="w-4 h-4 mr-2" />
              Line
            </Button>
            <Button 
              variant={chartConfig.chartType === 'pie' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartConfig({...chartConfig, chartType: 'pie'})}
            >
              <PieChart className="w-4 h-4 mr-2" />
              Pie
            </Button>
          </div>
        </div>
        
        <div className="grid gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium">X-Axis / Category</label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={chartConfig.xAxis}
            onChange={(e) => setChartConfig({...chartConfig, xAxis: e.target.value})}
          >
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
        
        <div className="grid gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium">Y-Axis / Value</label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={chartConfig.yAxis}
            onChange={(e) => setChartConfig({...chartConfig, yAxis: e.target.value})}
          >
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (data.length === 0) return <div>No data available for visualization</div>;
    
    // Limit to first 50 data points for performance
    const chartData = data.slice(0, 50);
    
    if (chartConfig.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={chartConfig.yAxis} fill="#003366" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartConfig.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={chartConfig.yAxis} stroke="#003366" />
          </RLineChart>
        </ResponsiveContainer>
      );
    } else if (chartConfig.chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#003366"
              dataKey={chartConfig.yAxis}
              nameKey={chartConfig.xAxis}
              label={(entry) => entry[chartConfig.xAxis]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RPieChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };

  if (loading) {
    return <div className="text-center py-8">Loading file content...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading file</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="chart">Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-6">
          {renderTable()}
        </TabsContent>
        
        <TabsContent value="chart" className="mt-6">
          {renderChartControls()}
          {renderChart()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
