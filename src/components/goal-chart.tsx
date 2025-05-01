import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  date: string
  amount: number
  type: string
  source?: string
  destination?: string
}

interface GoalChartProps {
  transactions: Transaction[]
}

export function GoalChart({ transactions }: GoalChartProps) {
  // Process transactions to create cumulative data for the chart
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let cumulativeAmount = 0
  const chartData = sortedTransactions.map((transaction) => {
    cumulativeAmount += transaction.amount
    return {
      date: new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: cumulativeAmount,
    }
  })

  // Add starting point if there are transactions
  if (chartData.length > 0) {
    chartData.unshift({
      date: "Start",
      amount: 0,
    })
  }

  return (
    <div className="h-[200px] w-full">
      {chartData.length > 1 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, "Total Saved"]} labelFormatter={(label) => `Date: ${label}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Not enough data to display chart
        </div>
      )}
    </div>
  )
}
