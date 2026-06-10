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
    {
      name: "Active Cards",
      value: activeCards
    },
    {
      name: "Inactive Cards",
      value: inactiveCards
    }
  ];

  const COLORS = ["#10b981", "#f59e0b"];

  return (
    <div className="bg-[#111827] p-6 rounded-2xl border border-[#1f2937]">

      <h2 className="text-white text-xl font-semibold mb-4">
        Cards Status
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
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

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default CardsStatus;