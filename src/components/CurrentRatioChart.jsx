import { ResponsiveContainer,BarChart,Bar,XAxis,YAxis,Tooltip,Legend,CartesianGrid } from 'recharts';

const CurrentRatioChart = ({data}) => {
    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="报告期" tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })} />
                    <YAxis />
                    <Tooltip formatter={(value) => value} labelFormatter={(label) => new Date(label).toLocaleDateString('zh-CN')} />
                    <Legend />
                    <Bar dataKey="流动比率" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CurrentRatioChart;

