
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type LeadStatus = "new" | "contacted" | "qualified" | "lost";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  value: number;
  status: LeadStatus;
  date: string;
  initials: string;
};

const statusStyles: Record<LeadStatus, { color: string; label: string }> = {
  new: { color: "bg-blue-100 text-blue-800", label: "New" },
  contacted: { color: "bg-yellow-100 text-yellow-800", label: "Contacted" },
  qualified: { color: "bg-green-100 text-green-800", label: "Qualified" },
  lost: { color: "bg-red-100 text-red-800", label: "Lost" },
};

const recentLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    company: "TechCorp Inc.",
    value: 15000,
    status: "new",
    date: "2 hours ago",
    initials: "SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "mchen@innovatech.co",
    company: "InnovaTech",
    value: 28000,
    status: "contacted",
    date: "Yesterday",
    initials: "MC",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "emma@buildx.com",
    company: "BuildX Construction",
    value: 42000,
    status: "qualified",
    date: "2 days ago",
    initials: "ER",
  },
  {
    id: "4",
    name: "David Lee",
    email: "david@finance360.com",
    company: "Finance360",
    value: 18500,
    status: "new",
    date: "3 days ago",
    initials: "DL",
  },
  {
    id: "5",
    name: "Lisa Wong",
    email: "lisa@quantum.io",
    company: "Quantum Solutions",
    value: 31000,
    status: "lost",
    date: "1 week ago",
    initials: "LW",
  },
];

const RecentLeads = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-2 font-medium text-left">Lead</th>
                  <th className="pb-2 font-medium text-left">Company</th>
                  <th className="pb-2 font-medium text-right">Value</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="py-2">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-salescraft-100 text-salescraft-700">
                            {lead.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-sm">{lead.company}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.date}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="text-sm font-medium">
                        ${lead.value.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant="secondary"
                        className={statusStyles[lead.status].color}
                      >
                        {statusStyles[lead.status].label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLeads;
