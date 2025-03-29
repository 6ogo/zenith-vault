
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle } from "lucide-react";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesPipeline from "@/components/dashboard/SalesPipeline";
import RecentLeads from "@/components/dashboard/RecentLeads";
import CustomerSatisfaction from "@/components/dashboard/CustomerSatisfaction";
import MarketingCampaigns from "@/components/dashboard/MarketingCampaigns";
import StatCard from "@/components/dashboard/StatCard";
import DataModeToggle from "@/components/dashboard/DataModeToggle";
import { useDataMode } from "@/contexts/DataModeContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { isRealData, setIsRealData } = useDataMode();
  
  const userWelcomeName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userWelcomeName}</h1>
        <p className="text-muted-foreground">
          Here's what's happening across your business today.
        </p>
      </div>

      <DataModeToggle isRealData={isRealData} onToggle={setIsRealData} />

      <Alert className="bg-secondary/20 border-secondary">
        <Check className="h-4 w-4 text-secondary" />
        <AlertTitle>Welcome to Zenith Vault!</AlertTitle>
        <AlertDescription>
          Your business dashboard has been set up successfully. You can start exploring the various modules.
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Leads" 
          value="152" 
          trend={{
            value: 12.5,
            isPositive: true
          }}
          className="bg-card"
          icon={<div className="h-4 w-4">👤</div>}
        />
        <StatCard 
          title="Total Sales" 
          value="$24,320" 
          trend={{
            value: 8.2,
            isPositive: true
          }}
          className="bg-card"
          icon={<div className="h-4 w-4">💵</div>}
        />
        <StatCard 
          title="Customer Satisfaction" 
          value="94.2%" 
          trend={{
            value: 1.2,
            isPositive: true
          }}
          className="bg-card"
          icon={<div className="h-4 w-4">❤️</div>}
        />
        <StatCard 
          title="Active Campaigns" 
          value="6" 
          trend={{
            value: 2,
            isPositive: true
          }}
          className="bg-card"
          icon={<div className="h-4 w-4">📧</div>}
        />
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Monthly sales performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>
                Current deals by stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesPipeline />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
              <CardDescription>
                Recent customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSatisfaction />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                New potential customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentLeads />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
              <CardDescription>
                Active campaign performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketingCampaigns />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
