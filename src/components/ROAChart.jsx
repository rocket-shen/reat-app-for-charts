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
  
  const ROAChart = ({ data, companyName }) => {
    return (
      <section>
        <h2>{companyName} 总资产报酬率 (ROA)</h2>
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
                dataKey="ROA"
                stroke="#8884d8"
                name="总资产报酬率"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  };
  
  export default ROAChart;