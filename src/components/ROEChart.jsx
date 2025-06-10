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
  
  const ROEChart = ({ data }) => {
    return (
      <section>
        <h2>净资产收益率 (ROE)</h2>
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
                dataKey="ROE"
                stroke="#82ca9d"
                name="净资产收益率"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  };
  
  export default ROEChart;