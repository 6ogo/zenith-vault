
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Very Satisfied", value: 58, color: "#22c55e" },
  { name: "Satisfied", value: 27, color: "#3b82f6" },
  { name: "Neutral", value: 10, color: "#f59e0b" },
  { name: "Unsatisfied", value: 5, color: "#ef4444" },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

const CustomerSatisfaction = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Customer Satisfaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSatisfaction;
