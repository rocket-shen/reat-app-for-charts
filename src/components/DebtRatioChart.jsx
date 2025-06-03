import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from 'recharts';


const DebtRatioChart = ({ data }) => {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">资产负债率</h2>
            <p className="text-gray-700 mb-4">
                资产负债率（负债合计/资产合计）反映了公司财务杠杆水平。2025年第一季度资产负债率为45%，低于2017年的58.73%，表明公司近年来逐步降低了财务杠杆，财务风险有所下降。
            </p>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="报告期" tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })} />
                        <YAxis unit="%" />
                        <Tooltip formatter={(value) => `${value}%`} labelFormatter={(label) => new Date(label).toLocaleDateString('zh-CN')} />
                        <Legend />
                        <Line type="monotone" dataKey="资产负债率" stroke="#ff7300" name="资产负债率" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default DebtRatioChart;