import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const DebtRatioChart = ({ data, companyName }) => {
  return (
    <section className="mb-8">
      <h2>{companyName} 资产负债率</h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
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
            <YAxis unit="%" tick={{ fill: "#FFFFFF" }}/>
            <Tooltip
              formatter={(value) => `${value}%`}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("zh-CN")
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="资产负债率"
              stroke="#ff7300"
              name="资产负债率"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default DebtRatioChart;
