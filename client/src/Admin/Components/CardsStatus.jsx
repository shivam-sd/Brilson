import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const CardsStatus = ({ activeCards, inactiveCards }) => {
  const data = [
    { name: "Active Cards", value: activeCards },
    { name: "Inactive Cards", value: inactiveCards }
  ];

  const COLORS = ["#10b981", "#f59e0b"];

  return (
    <div className="bg-[#111827] p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-[#1f2937] w-full min-w-0">
      <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
        Cards Status
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#fff"
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CardsStatus;