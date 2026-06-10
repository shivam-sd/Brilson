import {
 ResponsiveContainer,
 AreaChart,
 Area,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend
} from "recharts";

const OverviewChart = ({ chartData }) => {

 return (
  <div className="bg-[#111827] rounded-3xl border border-[#1f2937] p-6">

   <div className="mb-6">
    <h2 className="text-white text-xl font-semibold">
      Revenue Overview
    </h2>

    <p className="text-gray-400 text-sm">
      Monthly Revenue & Orders Analytics
    </p>
   </div>

   <ResponsiveContainer
    width="100%"
    height={380}
   >

    <AreaChart data={chartData}>

      <defs>

        <linearGradient
         id="revenue"
         x1="0"
         y1="0"
         x2="0"
         y2="1"
        >
          <stop
           offset="5%"
           stopColor="#8b5cf6"
           stopOpacity={0.8}
          />

          <stop
           offset="95%"
           stopColor="#8b5cf6"
           stopOpacity={0}
          />
        </linearGradient>

        <linearGradient
         id="orders"
         x1="0"
         y1="0"
         x2="0"
         y2="1"
        >
          <stop
           offset="5%"
           stopColor="#06b6d4"
           stopOpacity={0.8}
          />

          <stop
           offset="95%"
           stopColor="#06b6d4"
           stopOpacity={0}
          />
        </linearGradient>


        <linearGradient
         id="customers"
         x1="0"
         y1="0"
         x2="0"
         y2="1"
        >
          <stop
           offset="5%"
           stopColor="#FFFF00"
           stopOpacity={0.8}
          />

          <stop
           offset="95%"
           stopColor="#FFFF00"
           stopOpacity={0}
          />
        </linearGradient>

      </defs>

      <CartesianGrid
       strokeDasharray="3 3"
       stroke="#1f2937"
      />

      <XAxis
       dataKey="month"
       stroke="#9ca3af"
      />

      <YAxis
       stroke="#9ca3af"
      />

      <Tooltip
       contentStyle={{
         background:"#111827",
         border:"1px solid #374151",
         borderRadius:"12px"
       }}
      />

      <Legend />

      <Area
       type="monotone"
       dataKey="revenue"
       stroke="#8b5cf6"
       fill="url(#revenue)"
       strokeWidth={3}
      />



      <Area
       type="monotone"
       dataKey="orders"
       stroke="#06b6d4"
       fill="url(#orders)"
       strokeWidth={3}
      />


      <Area
       type="monotone"
       dataKey="customers"
       stroke="#FFFF00"
       fill="url(#customers)"
       strokeWidth={3}
      />

    </AreaChart>

   </ResponsiveContainer>

  </div>
 );
};

export default OverviewChart;