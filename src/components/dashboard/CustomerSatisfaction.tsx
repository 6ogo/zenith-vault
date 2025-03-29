
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataMode } from "@/contexts/DataModeContext";

const CustomerSatisfaction = () => {
  const { isRealData } = useDataMode();
  
  // Demo data
  const satisfactionData = {
    rating: 87,
    responses: 412,
    breakdown: [
      { label: "Very Satisfied", percentage: 58, count: 239 },
      { label: "Satisfied", percentage: 29, count: 120 },
      { label: "Neutral", percentage: 8, count: 33 },
      { label: "Dissatisfied", percentage: 3, count: 12 },
      { label: "Very Dissatisfied", percentage: 2, count: 8 },
    ],
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Customer Satisfaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center mb-6">
          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-32 w-32 transform -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
                strokeDasharray={`${satisfactionData.rating}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{satisfactionData.rating}%</span>
              <span className="text-xs text-muted-foreground">
                {satisfactionData.responses} responses
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {satisfactionData.breakdown.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">{item.label}</span>
                <span className="text-sm font-medium">{item.percentage}% ({item.count})</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    i === 0
                      ? "bg-green-500"
                      : i === 1
                      ? "bg-green-400"
                      : i === 2
                      ? "bg-yellow-400"
                      : i === 3
                      ? "bg-orange-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSatisfaction;
