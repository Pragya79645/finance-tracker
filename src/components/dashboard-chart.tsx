import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for the chart
const data = [
  { name: "Jan", amount: 400 },
  { name: "Feb", amount: 600 },
  { name: "Mar", amount: 800 },
  { name: "Apr", amount: 1000 },
  { name: "May", amount: 1200 },
  { name: "Jun", amount: 1500 },
  { name: "Jul", amount: 1800 },
  { name: "Aug", amount: 2100 },
]

export function DashboardChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, "Amount"]} labelFormatter={(label) => `Month: ${label}`} />
          <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
