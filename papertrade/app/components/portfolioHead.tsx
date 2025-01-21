import { DollarSign, Briefcase,} from 'lucide-react';


const PortfolioHead = ({buyingPower, totalValue} : {buyingPower: number, totalValue: number}) => {


    return ( 
        <div className="flex flex-wrap justify-between h-[100%] ">

          <div className='w-[50%] pr-2 h-[100%]'>
          <div className="bg-white w-[100%]  p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Total Value</h3>
              <DollarSign className="text-blue-600 w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{totalValue}</div>
            <div className={`${totalValue - 100000 < 0? "text-red-500" : "text-green-500" } text-sm mt-2`}> {((totalValue - 100000)/100000 ) * 100 }% </div>
          </div>

          </div>


        <div className='w-[50%] pl-2 h-[100%]' >
          <div className="bg-white p-6 rounded-lg w-[100%] h-[100%] shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Buying Power</h3>
              <Briefcase className="text-blue-600 w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{buyingPower}</div>
            <div className="text-gray-500 text-sm mt-2">Available to trade</div>
          </div>

        </div>


      </div>
     );
}
 
export default PortfolioHead;