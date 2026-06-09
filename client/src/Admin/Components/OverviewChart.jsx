import {
 AreaChart,
 Area,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts";

const data = [
  {
    month:"Jan",
    orders:100,
    customers:50,
    revenue:300
  },
  {
    month:"Feb",
    orders:200,
    customers:80,
    revenue:450
  },
  {
    month:"Mar",
    orders:300,
    customers:120,
    revenue:600
  }
];

const OverviewChart = () => {

  return (
    <div className="bg-[#111827] p-6 rounded-2xl">

      <h2 className="text-white mb-5">
        Overview
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <AreaChart data={data}>

          <XAxis dataKey="month"/>

          <YAxis/>

          <Tooltip/>

          <Area
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            fill="#3b82f6"
          />

          <Area
            type="monotone"
            dataKey="customers"
            stroke="#10b981"
            fill="#10b981"
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#a855f7"
            fill="#a855f7"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default OverviewChart;