import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data, barDataKey1, barDataKey2, XAxisKey }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                {/* <CartesianGrid strokeDasharray="1"  /> */}
                <XAxis dataKey={XAxisKey} className='text-xs' />
                <YAxis className='text-xs' />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-background border rounded-lg p-2 shadow-md">
                                    <p className="font-medium">{label}</p>
                                    {payload.map((item) => (
                                        <p key={item.name} className="text-xs">
                                            {item.name}: {item.value}
                                        </p>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    }} />

                <Bar dataKey={barDataKey1.dataKey} fill="#64748b" name={barDataKey1.name} />
                <Bar dataKey={barDataKey2.dataKey} fill="#475569" name={barDataKey2.name} />
            </BarChart>
        </ResponsiveContainer>


    )
}

export default BarChartComponent
