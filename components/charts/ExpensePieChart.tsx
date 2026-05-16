"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: { name: string; value: number; color: string }[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-sm" style={{ border: "1px solid var(--border)" }}>
        <p className="font-medium text-white">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>₹{payload[0].value.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

export default function ExpensePieChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-64" style={{ color: "var(--text-muted)" }}>
      No expense data yet
    </div>
  );
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={110}
          paddingAngle={3} dataKey="value" stroke="none">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
