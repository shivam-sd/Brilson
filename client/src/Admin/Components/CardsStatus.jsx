import {
 PieChart,
 Pie,
 Cell,
 ResponsiveContainer
} from "recharts";

const CardsStatus = ({ activeCards, inactiveCards }) => {

  const data = [
    {
      name:"Active",
      value:activeCards
    },
    {
      name:"Inactive",
      value:inactiveCards
    }
  ];

  return (
    <div className="bg-[#111827] p-6 rounded-2xl">

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
          >

            <Cell fill="#10b981"/>

            <Cell fill="#f59e0b"/>

          </Pie>

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default CardsStatus;