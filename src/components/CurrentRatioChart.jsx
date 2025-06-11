import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const CurrentRatioChart = ({ data, companyName }) => {
  return (
    <section>
      <h2>{companyName} 流动比率趋势</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="报告期"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "short",
                })
              }
              tick={{ fill: "#FFFFFF" }}
            />
            <YAxis tick={{ fill: "#FFFFFF" }}/>
            <Tooltip
              formatter={(value) => value}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("zh-CN")
              }
            />
            <Legend />
            <Bar dataKey="流动比率" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CurrentRatioChart;
