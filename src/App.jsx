import { useEffect, useState } from "react";
import AssetsLiabilitiesChart from "./components/AssetsLiabilitiesChart";
import CurrentRatioChart from "./components/CurrentRatioChart";
import DebtRatioChart from "./components/DebtRatioChart";
import MarginRatioChart from "./components/MarginRatioChart";
import ROAChart from "./components/ROAChart"; // 新增 ROA 图表组件
import ROEChart from "./components/ROEChart"; // 新增 ROE 图表组件
import { loadData } from "./services/dataService";
import "./App.css"; // 引入样式文件

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

  const marginData = data.map((row) => ({
    报告期: row["报告期"].toISOString().split("T")[0],
    毛利率: ((row["营业收入"] - row["营业成本"]) / row["营业收入"] * 100).toFixed(2),
  }));

  return (
    <div>
      <h1>财务趋势分析</h1>
      <AssetsLiabilitiesChart data={data} />
      <DebtRatioChart data={debtRatioData} />
      <CurrentRatioChart data={currentRatioData} />
      <ROAChart data={roaData} />
      <ROEChart data={roeData} /> 
      <MarginRatioChart data={marginData} />
    </div>
  );
}

export default App;
