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
import { formatNumber } from "../utils/formatNumber";

const AssetsLiabilitiesChart = ({ data, companyName }) => {
  return (
    <section>
      <h2>{companyName} 资产变动趋势</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
            <YAxis tickFormatter={formatNumber} 
            tick={{ fill: "#FFFFFF" }}/>
            <Tooltip
              formatter={formatNumber}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("zh-CN")
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="资产合计"
              stroke="#8884d8"
              name="资产合计"
            />
            <Line
              type="monotone"
              dataKey="流动资产合计"
              stroke="#82ca9d"
              name="流动资产合计"
            />
            <Line
              type="monotone"
              dataKey="负债合计"
              stroke="#ff7300"
              name="负债合计"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AssetsLiabilitiesChart;
