import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const LineStatsChart = ({ data, XAxisKey, lineDataKey1, lineDataKey2 }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" color='dark-grey'/> */}
        <XAxis dataKey={XAxisKey} />
        <YAxis />
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

        <Line type="monotone" dataKey={lineDataKey1} stroke="grey" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey={lineDataKey2} stroke="green" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineStatsChart
