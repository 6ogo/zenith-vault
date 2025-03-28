
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
];

const SalesChart = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e8be5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0e8be5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0e8be5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
