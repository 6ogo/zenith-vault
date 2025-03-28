
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CampaignStatus = "active" | "scheduled" | "completed" | "draft";

type Campaign = {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  sent: number;
  opened: number;
  clicks: number;
  startDate: string;
  endDate: string;
};

const statusStyles: Record<CampaignStatus, { color: string; label: string }> = {
  active: { color: "bg-green-100 text-green-800", label: "Active" },
  scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
  completed: { color: "bg-gray-100 text-gray-800", label: "Completed" },
  draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
};

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale Promotion",
    type: "Email",
    status: "active",
    sent: 2450,
    opened: 1856,
    clicks: 723,
    startDate: "06/15/2023",
    endDate: "06/30/2023",
  },
  {
    id: "2",
    name: "New Product Launch",
    type: "Email + Social",
    status: "scheduled",
    sent: 0,
    opened: 0,
    clicks: 0,
    startDate: "07/05/2023",
    endDate: "07/15/2023",
  },
  {
    id: "3",
    name: "Customer Feedback Survey",
    type: "Email",
    status: "completed",
    sent: 1875,
    opened: 1240,
    clicks: 528,
    startDate: "05/20/2023",
    endDate: "06/01/2023",
  },
  {
    id: "4",
    name: "Holiday Special Offer",
    type: "Email + Social",
    status: "draft",
    sent: 0,
    opened: 0,
    clicks: 0,
    startDate: "11/15/2023",
    endDate: "12/25/2023",
  },
];

const MarketingCampaigns = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Marketing Campaigns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-2 font-medium text-left">Campaign</th>
                  <th className="pb-2 font-medium text-left">Type</th>
                  <th className="pb-2 font-medium text-left">Date</th>
                  <th className="pb-2 font-medium text-center">Performance</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="py-2">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-sm">{campaign.name}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-sm">{campaign.type}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-sm">
                        {campaign.startDate}
                        <span className="mx-1">-</span>
                        {campaign.endDate}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {campaign.status === "active" || campaign.status === "completed" ? (
                        <div className="text-xs text-muted-foreground">
                          {campaign.clicks} clicks
                          <span className="mx-1">|</span>
                          {((campaign.opened / campaign.sent) * 100).toFixed(1)}% open rate
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant="secondary"
                        className={statusStyles[campaign.status].color}
                      >
                        {statusStyles[campaign.status].label}
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

export default MarketingCampaigns;
