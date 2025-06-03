import { useEffect, useState } from 'react';
import AssetsLiabilitiesChart from './components/AssetsLiabilitiesChart';
import CurrentRatioChart from './components/CurrentRatioChart';
import DebtRatioChart from './components/DebtRatioChart';
import { loadData } from './services/dataService';
import { formatNumber } from './utils/formatNumber';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData().then(cleanedData => {
      setData(cleanedData);
      setLoading(false);
    }).catch(error => {
      console.error('数据加载出错:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center text-2xl mt-10">加载中...</div>;
  }

  // 构造图表需要的比率数据
  const debtRatioData = data.map(row => ({
    报告期: row['报告期'].toISOString().split('T')[0],
    资产负债率: ((row['负债合计'] / row['资产合计']) * 100).toFixed(2),
  }));

  const currentRatioData = data.map(row => ({
    报告期: row['报告期'].toISOString().split('T')[0],
    流动比率: (row['流动资产合计'] / row['流动负债合计']).toFixed(2),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-6xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-center">财务趋势分析</h1>
      <AssetsLiabilitiesChart data={data} formatNumber={formatNumber} />
      <DebtRatioChart data={debtRatioData} />
      <CurrentRatioChart data={currentRatioData} />
    </div>
  );
}

export default App;
