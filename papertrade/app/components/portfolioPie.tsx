import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TransactionHistInterface {
    stock_symbol: string;
    action: string;
    price: number;
    quantity: number;
    total_value: number;
    created_at: string;
    balanced_quantity: number;
    profit: number | null;
    id: string;
}




const PortPie = (props: { currentHoldings: TransactionHistInterface[] |null }) => {
    const { currentHoldings } = props;

    const holdingMap: { [key: string]: TransactionHistInterface } = {};

    currentHoldings?.forEach((hold) => {
        if (!holdingMap[hold.stock_symbol]) {
            holdingMap[hold.stock_symbol] = hold;
        } else {
            holdingMap[hold.stock_symbol].balanced_quantity =
                holdingMap[hold.stock_symbol].balanced_quantity + hold.balanced_quantity;
            holdingMap[hold.stock_symbol].total_value =
                holdingMap[hold.stock_symbol].price * holdingMap[hold.stock_symbol].balanced_quantity;
        }
    });

    const holdingList: TransactionHistInterface[] = [];

    Object.keys(holdingMap).forEach((hold) => {
        holdingList.push(holdingMap[hold]);
    });


    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
        '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CDEF', '#7FB3D5', '#BE90D4', '#59ABE3', '#66CC99'
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <p className="font-bold">{data.stock_symbol}</p>
                    <p>Value: ${data.total_value.toFixed(2)}</p>
                    <p>Quantity: {data.balanced_quantity}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[100%] text-center mx-auto p-4 bg-white shadow-md rounded-lg m-5 overflow-hidden">
            <h2 className="text-xl font-bold mb-4 text-center">Portfolio Allocation</h2>

            {currentHoldings?.length == 0? 
                <div>
                    Stock Allocation Will Appear Here
                </div> :    <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={380}>
                    <PieChart>
                        <Pie
                            data={holdingList}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="60%"
                            dataKey="total_value"
                            nameKey="stock_symbol"
                        >
                            {holdingList.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        }

         
        </div>
    );
};

export default PortPie;
