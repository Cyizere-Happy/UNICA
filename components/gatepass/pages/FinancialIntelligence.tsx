'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Calendar, ArrowUpRight, 
  ArrowDownRight, Filter, RefreshCcw, DollarSign,
  TrendingUp, TrendingDown, Wallet, ShoppingBag
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FinancialIntelligence() {
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStatement();
  }, []);

  const fetchStatement = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFinancialStatement(dateRange.start, dateRange.end);
      setStatement(data);
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
      <div className={cn("p-4 rounded-2xl w-fit mb-4", color)}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-[#292f36] mt-1">{formatPrice(value)}</h3>
      {trend && (
        <div className={cn(
          "mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
          trend > 0 ? "text-emerald-500" : "text-rose-500"
        )}>
          {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}% vs last period
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-jost pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#292f36] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <FileText size={28} />
            </div>
            Financial Intelligence
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Comprehensive P&L analysis and operational expense tracking.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="px-3 py-1.5 text-xs font-bold text-[#292f36] outline-none border-none bg-transparent"
            />
            <span className="text-gray-300">/</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="px-3 py-1.5 text-xs font-bold text-[#292f36] outline-none border-none bg-transparent"
            />
            <button 
              onClick={fetchStatement}
              className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Calculating Financials...</p>
        </div>
      ) : (
        <>
          {/* Summary Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Gross Income" 
              value={statement?.income.total} 
              icon={Wallet} 
              color="bg-emerald-50 text-emerald-600"
            />
            <StatCard 
              title="Operational Expenses" 
              value={statement?.expenses.total} 
              icon={ShoppingBag} 
              color="bg-rose-50 text-rose-600"
            />
            <StatCard 
              title="Net Profit" 
              value={statement?.netProfit} 
              icon={DollarSign} 
              color="bg-accent/10 text-accent"
            />
            <StatCard 
              title="Profit Margin" 
              value={`${statement?.margin}%`} 
              icon={TrendingUp} 
              color="bg-amber-50 text-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Income Breakdown */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-[#292f36] mb-6 flex items-center gap-2">
                   <ArrowUpRight size={20} className="text-emerald-500" />
                   Income Sources
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <span>Room Bookings</span>
                      <span className="text-[#292f36]">{formatPrice(statement?.income.rooms)}</span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4d668f]" 
                        style={{ width: `${(statement?.income.rooms / statement?.income.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <span>Food & Beverage</span>
                      <span className="text-[#292f36]">{formatPrice(statement?.income.food)}</span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent" 
                        style={{ width: `${(statement?.income.food / statement?.income.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-[#292f36] mb-6 flex items-center gap-2">
                   <ArrowDownRight size={20} className="text-rose-500" />
                   Expense Categories
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <span>Inventory (Food)</span>
                      <span className="text-[#292f36]">{formatPrice(statement?.expenses.foodStock)}</span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-400" 
                        style={{ width: `${(statement?.expenses.foodStock / statement?.expenses.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <span>Assets & Equipment</span>
                      <span className="text-[#292f36]">{formatPrice(statement?.expenses.assets)}</span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400" 
                        style={{ width: `${(statement?.expenses.assets / statement?.expenses.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Logs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden h-full">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                   <div>
                     <h3 className="text-lg font-black text-[#292f36]">Operational Ledger</h3>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking every RWF entry & removal</p>
                   </div>
                   <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                      <Filter size={18} />
                   </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item / Detail</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {statement?.itemizedExpenses.map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50/30 transition-all">
                          <td className="px-8 py-4">
                            <span className="text-[11px] font-bold text-gray-500">
                              {new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <div>
                              <p className="text-xs font-black text-[#292f36]">{log.item}</p>
                              <p className="text-[9px] text-gray-400 font-medium">{log.reason || 'Routine entry'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                             <span className={cn(
                               "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                               log.category === 'Food' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                             )}>
                               {log.category}
                             </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                             <span className="text-xs font-black text-rose-600">-{formatPrice(log.amount)}</span>
                          </td>
                        </tr>
                      ))}
                      {statement?.itemizedExpenses.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-12 text-center text-gray-400">
                             <p className="text-[11px] font-black uppercase tracking-widest">No expense logs in this period</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
