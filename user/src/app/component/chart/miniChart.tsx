'use client'
import { Bar, Line} from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Chart from 'chart.js/auto';
import { useItemDetail } from '@/app/hooks/item.hook';
import { useKixDaily } from '@/app/hooks/kis.hook';
import { KisDailyDummy } from '@/app/common/dummy/kis.dummy';
Chart.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend);

function MiniChart({ stockName }: { stockName: string }){

    const { data:itemsList } = useItemDetail(stockName);
    const { data:kisDaily } = useKixDaily(stockName);
    const daily = Array.isArray(kisDaily?.output2) ? kisDaily.output2 : [];

    const labels = daily&&daily.map((v:IKisDailyOutput2, i:number)=>v.stck_bsop_date );
    const data: any =
    {
        labels: labels,
        datasets: [
            {
                pointStyle: false,
                label: '',
                type:'line',
                data: daily&&daily.map((v:IKisDailyOutput2, i:number)=>v.stck_oprc ),
                borderColor : "red",
                borderWidth : 1,
            },
        ],
    };
    const oprions: any = {
        scales: {
            x: {
                display : false,
            },
            y: {
                display : false,
            },
        },
        plugins: {
            legend: {
                display:false,
              },
              datalabels :{
                display : false,
            },
            }
    }


    return (
        <Bar data={data} options={oprions} className='w-full'></Bar>
    );
}
export default MiniChart;
