
import React from "react";
import { 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Mail, 
  CircleDollarSign, 
  MessageSquare 
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesPipeline from "@/components/dashboard/SalesPipeline";
import RecentLeads from "@/components/dashboard/RecentLeads";
import CustomerSatisfaction from "@/components/dashboard/CustomerSatisfaction";
import MarketingCampaigns from "@/components/dashboard/MarketingCampaigns";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$245,780"
          icon={<CircleDollarSign className="h-5 w-5" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Active Leads"
          value="387"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Support Tickets"
          value="43"
          icon={<MessageSquare className="h-5 w-5" />}
          trend={{ value: 4.1, isPositive: false }}
        />
        <StatCard
          title="Campaign ROI"
          value="167%"
          icon={<BarChart3 className="h-5 w-5" />}
          trend={{ value: 23.4, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <SalesPipeline />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <RecentLeads />
        </div>
        <div>
          <MarketingCampaigns />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <CustomerSatisfaction />
        </div>
        <div className="lg:col-span-2">
          {/* We'll add more components here in future updates */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
