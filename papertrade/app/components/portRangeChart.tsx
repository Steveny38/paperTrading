'use client'

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw } from "lucide-react";

interface PerformanceDataInterface {
    id: string;
    total_value: number;
    buying_power: number;
    created_at: string;
}


const PortRangeChart = (props: { total_value: number; buying_power: number }) => {
    const { total_value, buying_power } = props;
    const [performanceData, setPerformanceData] = useState<PerformanceDataInterface[]|[]>([]);
  

    async function updateGetData() {
     
            const res = await fetch("/api/pushBalHist", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ buying_power, total_value })
            });
            const data = await res.json();

            if(data.success){

                getData()
            } else {
                console.log("Failed to update data:", data);
            }
    }

    async function getData() {
     
     
            const res = await fetch("/api/balhistory");
            const data = await res.json();

            if(data.success){

                setPerformanceData(data.balHist);
            } else {
                console.log("Failed to update data:");
            }

            setPerformanceData(data.balHist);
     
    }

    useEffect(() => {
        getData();
    }, [total_value, buying_power]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">
                        Total Value: ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                        Date: {new Date(payload[0].payload.created_at).toLocaleDateString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[100%] bg-white rounded-lg shadow-lg">
            <div className="flex h-[10%] items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Portfolio Performance</h2>
                <button 
                    onClick={updateGetData} 
                   
                    className={`
                        flex items-center gap-2 px-4 py-2 text-sm 
                        rounded-md border border-gray-200 
                        hover:bg-gray-50 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed
                        bg-white text-gray-700
                    `}
                >
                    <RefreshCw className={`h-4 w-4 `} />
                    Update Data
                </button>
            </div>
            <div className="h-[90%] p-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="created_at"
                            tickFormatter={(str) => new Date(str).toLocaleDateString()}
                            stroke="#888888"
                        />
                        <YAxis 
                            dataKey="total_value"
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            stroke="#888888"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="total_value"
                            stroke="#8884d8"
                            fill="url(#colorValue)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortRangeChart;