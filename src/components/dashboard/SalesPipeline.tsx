
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type PipelineStage = {
  id: string;
  name: string;
  deals: number;
  value: number;
  progress: number;
  color: string;
};

const pipelineStages: PipelineStage[] = [
  {
    id: "lead",
    name: "Leads",
    deals: 145,
    value: 125000,
    progress: 100,
    color: "bg-blue-500",
  },
  {
    id: "qualified",
    name: "Qualified",
    deals: 89,
    value: 98500,
    progress: 65,
    color: "bg-indigo-500",
  },
  {
    id: "proposal",
    name: "Proposal",
    deals: 47,
    value: 67800,
    progress: 42,
    color: "bg-purple-500",
  },
  {
    id: "negotiation",
    name: "Negotiation",
    deals: 32,
    value: 54200,
    progress: 28,
    color: "bg-orange-500",
  },
  {
    id: "closed",
    name: "Closed Won",
    deals: 24,
    value: 37500,
    progress: 20,
    color: "bg-green-500",
  },
];

const SalesPipeline = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Sales Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pipelineStages.map((stage) => (
            <div key={stage.id}>
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium text-sm">{stage.name}</div>
                <div className="text-sm text-muted-foreground">
                  {stage.deals} deals · ${stage.value.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={stage.progress}
                  className={`h-2 ${stage.color}`}
                />
                <span className="text-xs font-medium">{stage.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPipeline;
