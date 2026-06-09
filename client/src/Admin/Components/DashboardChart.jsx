import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  {
    month: "Jan",
    revenue: 4500,
    orders: 120,
    customers: 80,
  },
  {
    month: "Feb",
    revenue: 6200,
    orders: 160,
    customers: 95,
  },
  {
    month: "Mar",
    revenue: 7800,
    orders: 210,
    customers: 130,
  },
  {
    month: "Apr",
    revenue: 9200,
    orders: 250,
    customers: 170,
  },
];

const DashboardChart = () => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stackId="1"
            stroke="#2563eb"
            fill="#2563eb"
          />

          <Area
            type="monotone"
            dataKey="orders"
            stackId="2"
            stroke="#16a34a"
            fill="#16a34a"
          />

          <Area
            type="monotone"
            dataKey="customers"
            stackId="3"
            stroke="#f97316"
            fill="#f97316"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


export default DashboardChart;