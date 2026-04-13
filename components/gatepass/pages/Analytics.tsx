'use client';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Bed, Star, Zap, Search, RefreshCw, 
  ChevronRight, Filter, SortAsc, Play, Rocket 
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import api from '@/lib/gatepass/api';
import { useSidebar } from '@/context/SidebarContext';

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-gray-100 bg-white p-4 lg:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </div>
);

const DISTRIBUTION = [
  { name: 'Room Bookings', value: 65, color: '#4d668f' },
  { name: 'Food & Beverage', value: 25, color: '#292f36' },
  { name: 'Spa & Wellness', value: 7, color: '#d1d5db' },
  { name: 'Transport / Tours', value: 3, color: '#f3f4f6' },
];

export default function Analytics() {
  const { collapsed } = useSidebar();
  const [revenueData, setRevenueData] = useState<{ day: string; revenue: number }[]>([]);
  const [highlights, setHighlights] = useState<{ title: string; value: string; change: string; icon: string }[]>([]);
  const [upcomingCheckouts, setUpcomingCheckouts] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<{ name: string; value: number; color: string }[]>([
    { name: 'Room Bookings', value: 0, color: '#4d668f' },
    { name: 'Food & Beverage', value: 0, color: '#292f36' },
    { name: 'Spa & Wellness', value: 0, color: '#d1d5db' },
    { name: 'Transport / Tours', value: 0, color: '#f3f4f6' },
  ]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const loadData = async () => {
    try {
      const [trendsData, highlightsData, staysData] = await Promise.all([
        api.get('/analytics/trends').then(r => r.data),
        api.get('/analytics/highlights').then(r => r.data),
        api.get('/stays/active').then(r => r.data),
      ]);

      // Map trends to chart format
      const chartData = (trendsData || []).map((t: any, i: number) => ({
        day: String(i + 1),
        revenue: t.revenue,
      }));
      setRevenueData(chartData);

      // Map highlights to KPI cards
      setHighlights([
        { title: 'Occupancy Rate', value: `${highlightsData.occupancyRate}%`, change: 'Live', icon: 'Bed' },
        { title: 'ADR', value: `$${highlightsData.adr}`, change: 'Live', icon: 'TrendingUp' },
        { title: 'RevPAR', value: `$${highlightsData.revPar}`, change: 'Live', icon: 'Zap' },
        { title: 'F&B Revenue', value: `$${highlightsData.fbRevenue}`, change: 'Live', icon: 'Star' },
      ]);

      // Map stays to upcoming checkouts
      setUpcomingCheckouts((staysData || []).slice(0, 3));

      // Map distribution and total revenue
      if (highlightsData.distribution) {
        setDistribution(highlightsData.distribution);
      }
      if (highlightsData.totalRevenue) {
        setTotalRevenue(highlightsData.totalRevenue);
      }
    } catch (err) {
      console.error('Failed to load analytics data', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 w-full font-sans bg-transparent min-h-screen transition-all duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#292f36] tracking-tight transition-all">Highlights</h1>
        <button onClick={loadData} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-500 hover:bg-white hover:shadow-sm transition-all">
          <RefreshCw className="w-3 h-3" />
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 transition-all duration-500
        ${!collapsed ? 'gap-3' : 'gap-4'}
      `}>
        {highlights.map((item, idx) => {
          const Icon = { TrendingUp, Bed, Star, Zap }[item.icon] || TrendingUp;
          return (
            <Card key={idx} className={`relative overflow-hidden group transition-all duration-500
              ${!collapsed ? 'p-2.5' : 'p-3.5'}
            `}>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#4d668f]/10 group-hover:text-[#4d668f] transition-all
                  ${!collapsed ? 'w-6 h-6' : 'w-7 h-7'}
                `}>
                  <Icon className={`${!collapsed ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-black uppercase tracking-widest text-gray-400 transition-all
                    ${!collapsed ? 'text-[6.5px]' : 'text-[8px]'}
                  `}>{item.title}</p>
                </div>
                <span className={`font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded transition-all
                  ${!collapsed ? 'text-[6.5px]' : 'text-[8px]'}
                `}>{item.change}</span>
              </div>
              <div className="flex items-end justify-between">
                <h3 className={`font-black text-[#292f36] transition-all
                  ${!collapsed ? 'text-base md:text-lg' : 'text-lg md:text-xl'}
                `}>{item.value}</h3>
                {/* Decorative Mini Chart Placeholder */}
                <div className={`flex gap-1 items-end transition-all
                  ${!collapsed ? 'h-4' : 'h-5'}
                `}>
                  {[40, 70, 50, 90].map((h, i) => (
                    <div key={i} className="w-0.5 bg-amber-400 rounded-full" style={{ height: `${h}%`, opacity: 0.3 + (i * 0.2) }} />
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Progress Overview */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 transition-all">
            <div>
              <h3 className="text-base font-black text-[#292f36]">30-Day Revenue Trend</h3>
              <p className="text-[10px] text-gray-400 font-medium">Combined Room & F&B Revenue ($).</p>
            </div>
            <div className="flex gap-2">
              <select className="bg-gray-50 border-none rounded-lg px-2 py-1 text-[9px] font-bold outline-none">
                <option>All Services</option>
              </select>
              <select className="bg-gray-50 border-none rounded-lg px-2 py-1 text-[9px] font-bold outline-none">
                <option>October</option>
              </select>
            </div>
          </div>
          
          <div className="h-[220px] w-full transition-all">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4d668f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4d668f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                  dy={8}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                  labelStyle={{ fontWeight: 800, color: '#292f36', fontSize: 10 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4d668f" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Activity Split */}
        <Card>
          <div className="flex items-center justify-between mb-4 transition-all">
            <h3 className="text-base font-black text-[#292f36]">Revenue Distribution</h3>
            <div className="flex gap-1">
               <button className="p-1 hover:bg-gray-50 rounded text-gray-400"><Search className="w-3.5 h-3.5" /></button>
               <button className="p-1 hover:bg-gray-50 rounded text-gray-400"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          
          <div className="h-[160px] relative transition-all">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Total</p>
              <p className="text-xl font-black text-[#292f36]">{totalRevenue}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-y-2.5">
            {distribution.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="text-[9px] font-bold text-gray-500 whitespace-nowrap">{item.name}: <span className="text-[#292f36]">{item.value}%</span></p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Check-outs */}
        <Card className="lg:col-span-2 overflow-hidden px-0 pb-0">
          <div className="px-6 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#292f36]" />
              <h3 className="text-lg font-black text-[#292f36]">Upcoming Check-outs</h3>
            </div>
            <div className="flex gap-2">
               <button className="p-2 border border-gray-100 rounded-xl text-gray-400"><Search className="w-4 h-4" /></button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500"><SortAsc className="w-3.5 h-3.5" /> Sort</button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500"><Filter className="w-3.5 h-3.5" /> Filter</button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Guest / Room</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Check-out Date</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {upcomingCheckouts.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm font-medium">No active stays to display.</td></tr>
              ) : upcomingCheckouts.map((stay, i) => (
                <tr key={stay.id || i}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs font-bold text-[#292f36]">{stay.guest?.name || 'Guest'} ({stay.room?.name || 'Room'})</p>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-gray-400">
                    {stay.expectedCheckOutAt ? new Date(stay.expectedCheckOutAt).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="px-6 py-4"><span className="text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Active</span></td>
                  <td className="px-6 py-4 text-[10px] font-black text-emerald-500">Standard</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Quick Review / Actions */}
        <Card className="flex flex-col">
          <h3 className="text-lg font-black text-[#292f36] leading-tight mb-1">Quick Actions</h3>
          <p className="text-xs text-gray-400 font-medium mb-6">Manage common tasks instantly.</p>
          
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="Search for a guest or room..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-[11px] font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {[TrendingUp, Rocket, RefreshCw, Zap, Play].map((Icon, idx) => (
              <button key={idx} className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#4d668f] hover:text-white transition-all shrink-0">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-3">
             <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl text-xs font-black text-[#292f36] hover:bg-gray-100 transition-all">
                Practice Mode
             </button>
             <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#292f36] text-white rounded-2xl text-xs font-black shadow-lg shadow-black/10 hover:bg-black transition-all">
                Export Reports
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
