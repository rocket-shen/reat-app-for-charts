import { useEffect, useState } from "react";
import AssetsLiabilitiesChart from "./components/AssetsLiabilitiesChart";
import CurrentRatioChart from "./components/CurrentRatioChart";
import DebtRatioChart from "./components/DebtRatioChart";
import MarginRatioChart from "./components/MarginRatioChart";
import ROAChart from "./components/ROAChart"; // 新增 ROA 图表组件
import ROEChart from "./components/ROEChart"; // 新增 ROE 图表组件
import FileQuery from "./components/FileQuery";
import { loadData } from "./services/dataService";
import "./App.css"; // 引入样式文件

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const handleFileLoaded = async ({ balanceSheetFile, incomeStatementFile, companyName}) => {
    setData([]);
    setCompanyName(companyName);
    setLoading(true);
    setError(null);
    
    try {
      // 使用现有的 loadData 函数加载和解析文件
      const cleanedData = await loadData(balanceSheetFile, incomeStatementFile);
      setData(cleanedData);
    } catch (error) {
      console.error("数据加载出错:", error);
      setError("数据加载失败: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!data) return null;

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

    return {
      rawData: data,
      debtRatioData,
      currentRatioData,
      roaData,
      roeData,
      marginData
    };
  };

  const chartData = prepareChartData();

  return (
    <div className="app-container">
      <h1 className="app-title">财务趋势分析系统</h1>
      
      <FileQuery
        onFileLoaded={handleFileLoaded} 
        loading={loading}
      />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading && <div className="loading-indicator">加载中...</div>}
      
      {chartData && (
        <div className="charts-container">
          <AssetsLiabilitiesChart data={chartData.rawData} companyName={companyName}/>
          <DebtRatioChart data={chartData.debtRatioData} companyName={companyName}/>
          <CurrentRatioChart data={chartData.currentRatioData} companyName={companyName}/>
          <ROAChart data={chartData.roaData} companyName={companyName}/>
          <ROEChart data={chartData.roeData} companyName={companyName}/>
          <MarginRatioChart data={chartData.marginData} companyName={companyName}/>
        </div>
      )}
    </div>
  );
}

export default App;
