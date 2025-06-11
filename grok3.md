我将帮你修改代码以加入利润表数据，并计算总资产报酬率（ROA）和净资产收益率（ROE）。假设有一个利润表文件（如 "SZ002588_史丹利_利润表.csv"），包含“净利润”等字段。ROA 通常为净利润/资产合计，ROE 为净利润/股东权益合计。

以下是更新后的 `dataService.js` 代码，加载并合并资产负债表和利润表数据，计算 ROA 和 ROE，并更新 `App.jsx` 增加 ROA 和 ROE 图表：

### 修改后的 `dataService.js`

```javascript
import Papa from "papaparse";

const loadFileData = (filename) => {
  return fetch(filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      return response.text();
    })
    .catch((error) => {
      console.error("Error loading file:", error);
      throw error;
    });
};

export const loadData = () => {
  // 同时加载资产负债表和利润表
  return Promise.all([
    loadFileData("SZ002588_史丹利_资产负债表.csv"),
    loadFileData("SZ002588_史丹利_利润表.csv"),
  ]).then(([balanceSheetCsv, incomeStatementCsv]) => {
    return new Promise((resolve, reject) => {
      // 解析资产负债表
      Papa.parse(balanceSheetCsv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transformHeader: (header) => header.trim().replace(/^"|"$/g, ""),
        transform: (value, header) => {
          let cleaned = value.trim().replace(/^"|"$/g, "");
          if (
            [
              "货币资金",
              "交易性金融资产",
              "应收票据及应收账款",
              "流动资产合计",
              "非流动资产合计",
              "资产合计",
              "流动负债合计",
              "非流动负债合计",
              "负债合计",
              "股东权益合计",
            ].includes(header)
          ) {
            return parseFloat(cleaned) || 0;
          }
          return cleaned;
        },
        complete: (balanceResults) => {
          // 解析利润表
          Papa.parse(incomeStatementCsv, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            transformHeader: (header) => header.trim().replace(/^"|"$/g, ""),
            transform: (value, header) => {
              let cleaned = value.trim().replace(/^"|"$/g, "");
              if (header === "净利润") {
                return parseFloat(cleaned) || 0;
              }
              return cleaned;
            },
            complete: (incomeResults) => {
              // 合并数据
              const balanceData = balanceResults.data.map((row) => ({
                报告期: new Date(row["报告期"]),
                货币资金: parseFloat(row["货币资金"]) || 0,
                交易性金融资产: parseFloat(row["交易性金融资产"]) || 0,
                应收票据及应收账款: parseFloat(row["应收票据及应收账款"]) || 0,
                流动资产合计: parseFloat(row["流动资产合计"]) || 0,
                非流动资产合计: parseFloat(row["非流动资产合计"]) || 0,
                资产合计: parseFloat(row["资产合计"]) || 0,
                流动负债合计: parseFloat(row["流动负债合计"]) || 0,
                非流动负债合计: parseFloat(row["非流动负债合计"]) || 0,
                负债合计: parseFloat(row["负债合计"]) || 0,
                股东权益合计: parseFloat(row["股东权益合计"]) || 0,
              }));

              const incomeData = incomeResults.data.map((row) => ({
                报告期: new Date(row["报告期"]),
                净利润: parseFloat(row["净利润"]) || 0,
              }));

              // 按报告期合并资产负债表和利润表数据
              const mergedData = balanceData
                .map((balanceRow) => {
                  const incomeRow = incomeData.find(
                    (income) =>
                      income["报告期"].toISOString() ===
                      balanceRow["报告期"].toISOString()
                  );
                  if (incomeRow) {
                    return {
                      ...balanceRow,
                      净利润: incomeRow["净利润"],
                      ROA: balanceRow["资产合计"]
                        ? ((incomeRow["净利润"] / balanceRow["资产合计"]) * 100).toFixed(2)
                        : 0,
                      ROE: balanceRow["股东权益合计"]
                        ? ((incomeRow["净利润"] / balanceRow["股东权益合计"]) * 100).toFixed(2)
                        : 0,
                    };
                  }
                  return null;
                })
                .filter((row) => row !== null)
                .sort((a, b) => a["报告期"] - b["报告期"]);

              resolve(mergedData);
            },
            error: (err) => {
              console.error("Error parsing income statement:", err);
              reject(err);
            },
          });
        },
        error: (err) => {
          console.error("Error parsing balance sheet:", err);
          reject(err);
        },
      });
    });
  });
};
```

### 修改说明
1. **加载利润表**：使用 `Promise.all` 同时加载资产负债表和利润表 CSV 文件。
2. **解析利润表**：为利润表添加解析逻辑，处理“净利润”字段，确保其为数值。
3. **合并数据**：按“报告期”合并资产负债表和利润表数据，确保日期对齐。
4. **计算 ROA 和 ROE**：
   - ROA = (净利润 / 资产合计) * 100（百分比，保留两位小数）。
   - ROE = (净利润 / 股东权益合计) * 100（百分比，保留两位小数）。
5. **数据清理**：过滤掉无法匹配的数据行，并按报告期排序。

### 更新 `App.jsx` 以显示 ROA 和 ROE 图表
需要添加新的图表组件来展示 ROA 和 ROE 趋势。以下是修改后的 `App.jsx`：

```jsx
import { useEffect, useState } from "react";
import AssetsLiabilitiesChart from "./components/AssetsLiabilitiesChart";
import CurrentRatioChart from "./components/CurrentRatioChart";
import DebtRatioChart from "./components/DebtRatioChart";
import ROAChart from "./components/ROAChart"; // 新增 ROA 图表组件
import ROEChart from "./components/ROEChart"; // 新增 ROE 图表组件
import { loadData } from "./services/dataService";
import { formatNumber } from "./utils/formatNumber";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData()
      .then((cleanedData) => {
        setData(cleanedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("数据加载出错:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-2xl mt-10">加载中...</div>;
  }

  // 构造图表需要的比率数据
  const debtRatioData = data.map((row) => ({
    报告期: row["报告期"].toISOString().split("T")[0],
    资产负债率: ((row["负债合计"] / row["资产合计"]) * 100).toFixed(2),
  }));

  const currentRatioData = data.map((row) => ({
    报告期: row["报告期"].toISOString().split("T")[0],
    流动比率: (row["流动资产合计"] / row["流动负债合计"]).toFixed(2),
  }));

  const roaData = data.map((row) => ({
    报告期: row["报告期"].toISOString().split("T")[0],
    ROA: parseFloat(row["ROA"]),
  }));

  const roeData = data.map((row) => ({
    报告期: row["报告期"].toISOString().split("T")[0],
    ROE: parseFloat(row["ROE"]),
  }));

  return (
    <div>
      <h1>财务趋势分析</h1>
      <AssetsLiabilitiesChart data={data} formatNumber={formatNumber} />
      <DebtRatioChart data={debtRatioData} />
      <CurrentRatioChart data={currentRatioData} />
      <ROAChart data={roaData} />
      <ROEChart data={roeData} />
    </div>
  );
}

export default App;
```

### 新增 `ROAChart.jsx`

```jsx
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

const ROAChart = ({ data }) => {
  return (
    <section className="mb-8">
      <h2>总资产报酬率 (ROA)</h2>
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
            />
            <YAxis unit="%" />
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
```

### 新增 `ROEChart.jsx`

```jsx
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
    <section className="mb-8">
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
            />
            <YAxis unit="%" />
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
```

### 说明
1. **数据处理**：`dataService.js` 现在加载并合并两个 CSV 文件，确保“报告期”一致，计算 ROA 和 ROE。
2. **图表展示**：新增 `ROAChart.jsx` 和 `ROEChart.jsx`，使用折线图展示 ROA 和 ROE 趋势，格式与现有图表一致。
3. **App.jsx 更新**：添加 ROA 和 ROE 数据处理逻辑，并渲染新图表组件。
4. **假设**：利润表 CSV 文件需包含“报告期”和“净利润”字段，格式与资产负债表类似。

### 前提条件
- 确保 `SZ002588_史丹利_利润表.csv` 存在且包含“报告期”和“净利润”字段。
- 利润表的“报告期”格式应与资产负债表一致，以便合并。

### 下一步
- 验证 CSV 文件路径和字段名是否正确。
- 如果需要其他利润表字段（如营业收入），可类似地添加到 `dataService.js` 的解析逻辑中。
- 如果需要调整图表样式（如颜色、单位），可修改 `ROAChart.jsx` 和 `ROEChart.jsx`。

如有其他需求（如添加更多指标或调整图表），请告诉我！