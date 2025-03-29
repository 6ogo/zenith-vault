
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, User, Mail, Phone, Calendar, ArrowRight, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CustomerSatisfaction from "@/components/dashboard/CustomerSatisfaction";

const demoCustomers = [
  {
    id: "cust-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    status: "active",
    lifetime_value: "$12,450",
    joined: "Sep 15, 2022",
    last_contact: "2 days ago",
    avatar: "",
    segment: "Enterprise",
    interactions: [
      { type: "email", date: "May 5, 2023", content: "Follow-up about new product features", status: "replied" },
      { type: "call", date: "Apr 22, 2023", content: "Quarterly review call", status: "completed" },
      { type: "support", date: "Mar 12, 2023", content: "Technical issue with dashboard", status: "resolved" },
      { type: "purchase", date: "Feb 28, 2023", content: "Premium plan upgrade - $4,999", status: "completed" },
      { type: "email", date: "Jan 15, 2023", content: "January newsletter", status: "opened" }
    ]
  },
  {
    id: "cust-002",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    company: "InnoTech Solutions",
    status: "active",
    lifetime_value: "$8,320",
    joined: "Jan 23, 2023",
    last_contact: "1 week ago",
    avatar: "",
    segment: "SMB",
    interactions: [
      { type: "email", date: "May 10, 2023", content: "Product feature update", status: "sent" },
      { type: "purchase", date: "Apr 05, 2023", content: "Basic plan renewal - $1,999", status: "completed" },
      { type: "support", date: "Mar 28, 2023", content: "API integration question", status: "resolved" }
    ]
  },
  {
    id: "cust-003",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 (555) 234-5678",
    company: "Global Merchants",
    status: "inactive",
    lifetime_value: "$5,750",
    joined: "Apr 10, 2021",
    last_contact: "2 months ago",
    avatar: "",
    segment: "Enterprise",
    interactions: [
      { type: "email", date: "Mar 22, 2023", content: "Reactivation campaign", status: "no-reply" },
      { type: "call", date: "Feb 15, 2023", content: "Renewal discussion", status: "not-interested" },
      { type: "purchase", date: "Dec 10, 2022", content: "Premium plan - $3,499", status: "completed" }
    ]
  },
  {
    id: "cust-004",
    name: "David Smith",
    email: "david.smith@example.com",
    phone: "+1 (555) 876-5432",
    company: "Smith & Associates",
    status: "active",
    lifetime_value: "$15,200",
    joined: "Jul 04, 2022",
    last_contact: "3 days ago",
    avatar: "",
    segment: "SMB",
    interactions: [
      { type: "email", date: "May 12, 2023", content: "Feedback request", status: "replied" },
      { type: "support", date: "May 01, 2023", content: "User access issue", status: "resolved" },
      { type: "purchase", date: "Apr 15, 2023", content: "Enterprise plan upgrade - $7,999", status: "completed" },
      { type: "call", date: "Mar 22, 2023", content: "Product roadmap discussion", status: "completed" }
    ]
  }
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof demoCustomers[0] | null>(null);
  
  const filteredCustomers = demoCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage your customer database and history.
          </p>
        </div>
        <Button size="sm" className="font-medium">
          <Plus className="h-4 w-4 mr-1" /> Add Customer
        </Button>
      </div>
      
      <div className="flex items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {selectedCustomer ? (
            <CustomerDetail 
              customer={selectedCustomer} 
              onBack={() => setSelectedCustomer(null)} 
            />
          ) : (
            <>
              {filteredCustomers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Last Contact</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{customer.name}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">{customer.email}</td>
                              <td className="px-4 py-3 text-sm">{customer.company}</td>
                              <td className="px-4 py-3">
                                <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                                  {customer.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{customer.lifetime_value}</td>
                              <td className="px-4 py-3 text-sm">{customer.last_contact}</td>
                              <td className="px-4 py-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedCustomer(customer)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <CustomerSatisfaction />
                </div>
              ) : (
                <div className="dashboard-card p-6">
                  <div className="text-center p-8">
                    <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try a different search term or add a new customer.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" /> Add Customer
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {selectedCustomer ? (
            <CustomerDetail 
              customer={selectedCustomer} 
              onBack={() => setSelectedCustomer(null)} 
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Last Contact</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.filter(c => c.status === 'active').map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{customer.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{customer.email}</td>
                          <td className="px-4 py-3 text-sm">{customer.company}</td>
                          <td className="px-4 py-3 text-sm">{customer.lifetime_value}</td>
                          <td className="px-4 py-3 text-sm">{customer.last_contact}</td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          {selectedCustomer ? (
            <CustomerDetail 
              customer={selectedCustomer} 
              onBack={() => setSelectedCustomer(null)} 
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Last Contact</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.filter(c => c.status === 'inactive').map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{customer.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{customer.email}</td>
                          <td className="px-4 py-3 text-sm">{customer.company}</td>
                          <td className="px-4 py-3 text-sm">{customer.lifetime_value}</td>
                          <td className="px-4 py-3 text-sm">{customer.last_contact}</td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Customer reporting features will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CustomerDetailProps {
  customer: typeof demoCustomers[0];
  onBack: () => void;
}

const CustomerDetail = ({ customer, onBack }: CustomerDetailProps) => {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
        Back to customers
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <Badge className="mt-2">{customer.segment}</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.company}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined {customer.joined}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-4">Customer Value</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Lifetime value</span>
                    <span className="font-medium">{customer.lifetime_value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Engagement score</span>
                    <span className="font-medium">7.8/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Retention probability</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Interaction History</CardTitle>
            <CardDescription>Recent communication and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.interactions.map((interaction, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div className="font-medium">{interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}</div>
                    <Badge variant={
                      interaction.status === "replied" || interaction.status === "completed" || interaction.status === "resolved" 
                        ? "default" 
                        : interaction.status === "opened" 
                          ? "outline" 
                          : "secondary"
                    }>
                      {interaction.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{interaction.date}</div>
                  <div className="mt-2">{interaction.content}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
            <CardDescription>Insights and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Activity Trend</h3>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-end space-x-1 h-24">
                  {[30, 45, 25, 60, 75, 45, 80, 95, 60, 85, 70, 55].map((value, i) => (
                    <div 
                      key={i} 
                      className="bg-primary/80 rounded-sm flex-1"
                      style={{ height: `${value}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Product Usage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Dashboard</span>
                      <span className="font-medium">86%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Analytics</span>
                      <span className="font-medium">54%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Reporting</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Customer Health</h3>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">82%</div>
                    </div>
                    <svg viewBox="0 0 100 100" className="transform rotate-90 h-full w-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset="45.216"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="font-medium">Good</Badge>
                    <p className="text-sm text-muted-foreground mt-2">Updated 3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customers;
