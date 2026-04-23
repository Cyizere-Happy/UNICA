'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, TrendingUp, MessageSquare, AlertCircle, ClipboardList, Package, Utensils, CheckSquare, Bell } from "lucide-react";
import Lottie from "lottie-react";
import DashboardAnimation from "@/lib/gatepass/assets/Promo Code.json";
import { apiService, UserProfile } from "@/lib/gatepass/apiService";
import type { DashboardStats, Visit } from "@/lib/gatepass/types";
import { cn, formatPrice } from "@/lib/utils";

const Card = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div className={`rounded-2xl shadow-sm p-5 ${className}`} onClick={onClick}>{children}</div>
);

// Moved helper outside to avoid re-creation
const filterRecentVisits = (visits: Visit[]) => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  return (visits || []).filter(v => {
    const visitDate = new Date(v.createdAt);
    return visitDate >= twoDaysAgo;
  });
};

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any>({ orders: [], services: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Carousel state for both sections
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [summaryIndex, setSummaryIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const profileData = await apiService.getProfile();
        setUserProfile(profileData);

        const promises: Promise<any>[] = [];
        
        // Define which roles need which data
        const needsStats = ['ADMIN', 'RECEPTION', 'KITCHEN'].includes(profileData.role);
        const needsVisits = ['ADMIN', 'RECEPTION'].includes(profileData.role);
        const needsHighlights = profileData.role === 'ADMIN';

        if (needsStats) promises.push(apiService.getDashboardStats());
        if (needsVisits) promises.push(apiService.getVisits({ limit: 20 }));
        if (needsHighlights) {
          promises.push(apiService.getAnalyticsHighlights());
          promises.push(apiService.getPendingStockTasks());
        }

        const results = await Promise.all(promises);
        
        let resultIndex = 0;
        let statsData = needsStats ? results[resultIndex++] : null;
        let visitsData = needsVisits ? results[resultIndex++] : null;
        let highlightsData = needsHighlights ? results[resultIndex++] : null;
        let tasksData = needsHighlights ? results[resultIndex++] : null;

        if (statsData) {
          if (highlightsData) {
            // Merge financial highlights into stats
            statsData = { 
              ...statsData, 
              totalRevenue: highlightsData.totalRevenue,
              stockExpenses: highlightsData.stockExpenses,
              netProfit: highlightsData.netProfit,
              totalSpentFood: highlightsData.totalSpentFood,
              totalSpentAssets: highlightsData.totalSpentAssets,
              lowStockFoodCount: highlightsData.lowStockFoodCount,
              lowStockAssetsCount: highlightsData.lowStockAssetsCount
            };
          }
          setStats(statsData);
        }
        if (tasksData) setPendingTasks(tasksData);
        if (visitsData) setRecentVisits(visitsData.visits);

      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-rotate Upcoming Visits every 8 seconds
  useEffect(() => {
    if (recentVisits.length <= 4) return;
    const interval = setInterval(() => {
      setUpcomingIndex((prev) => (prev + 4) % recentVisits.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [recentVisits.length]);

  const finalSummaryItems = stats?.summaryItems && stats.summaryItems.length > 0 
    ? stats.summaryItems 
    : [
        { color: "bg-gray-400", title: "No Visits Today", count: "0 Parents" }
      ];

  // Auto-rotate Today's Summary every 8 seconds
  useEffect(() => {
    if (finalSummaryItems.length <= 4) return;
    const interval = setInterval(() => {
      setSummaryIndex((prev) => (prev + 4) % (stats?.summaryItems?.length || 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [finalSummaryItems.length]);

  // Helper to get current 4 items
  const getCurrentItems = (items: any[], startIndex: number) => {
    if (!items || items.length === 0) return [];
    const result = [];
    const count = Math.min(4, items.length);
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % items.length;
      const item = items[index];
      if (item) result.push(item);
    }
    return result;
  };

  const user = userProfile;
  const filteredRecentVisits = filterRecentVisits(recentVisits);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-jost pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <div className="lg:col-span-3 space-y-6">

        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#292f36] tracking-tight">Hi, {user?.fullName || 'Manager'}</h1>
            <p className="text-[11px] text-[#4d5053] font-medium">Let's manage your hospitality operations today!</p>
          </div>
          {/* <button className="p-2 rounded-full bg-indigo-100 text-[#153d5d] hover:bg-indigo-200 transition">Bell</button> */}
        </div>

        <Card className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-[#afcde5] to-[#faf0f0] text-gray-900 p-6 sm:p-8">
          <div className="sm:w-3/5 mb-6 sm:mb-0 relative z-10 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Today's Guests</h3>
            <p className="mb-4 text-gray-700 text-sm sm:text-base">Track your scheduled check-ins and visitor activity.</p>
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#292f36] text-white hover:bg-black transition-all transform active:scale-95 font-semibold text-sm shadow-md">
              View Schedule
            </button>
          </div>
          <div className="sm:w-2/5 w-full h-48 sm:h-64 flex justify-center sm:justify-end items-center">
            <div className="w-full max-w-[200px] sm:max-w-xs">
              <Lottie animationData={DashboardAnimation} loop />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.role === 'KITCHEN' ? (
            <>
              <Card 
                className="bg-white border border-gray-100 cursor-pointer hover:border-accent/30 transition-all border-l-4 border-l-amber-500"
                onClick={() => window.location.href = '/management/admin/kitchen-orders'}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Pending Orders</p>
                <h3 className="text-2xl font-black text-[#292f36]">{stats?.pendingOrders ?? 0}</h3>
              </Card>
              <Card className="bg-white border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Preferred Dish</p>
                <h3 className="text-xl font-black text-[#292f36] truncate" title={stats?.topDish}>{stats?.topDish ?? '—'}</h3>
              </Card>
              <Card className="bg-white border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">New Arrivals</p>
                <h3 className="text-2xl font-black text-[#292f36]">{stats?.totalVisitsToday ?? 0}</h3>
              </Card>
              <Card className="bg-white border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4d668f] mb-1">Guests In-House</p>
                <h3 className="text-2xl font-black text-[#4d668f]">{stats?.activeVisitors ?? 0}</h3>
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-white border border-gray-100 border-l-4 border-l-accent">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Arrivals Today</p>
                <h3 className="text-2xl font-black text-[#292f36]">{stats?.totalVisitsToday ?? 0}</h3>
              </Card>
              <Card className="bg-white border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4d668f] mb-1">Guests In-House</p>
                <h3 className="text-2xl font-black text-[#4d668f]">{stats?.activeVisitors ?? 0}</h3>
              </Card>
              <Card 
                className="bg-white border border-gray-100 cursor-pointer hover:border-accent/30 transition-all"
                onClick={() => window.location.href = '/management/admin/kitchen-orders'}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Pending Orders</p>
                <h3 className="text-2xl font-black text-amber-500">
                  {stats?.pendingOrders ?? 0}
                </h3>
              </Card>
              <Card className="bg-white border border-gray-100 border-l-4 border-l-[#292f36]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Available Rooms</p>
                <h3 className="text-2xl font-black text-[#292f36]">
                  {stats?.availableRooms ?? '—'}
                </h3>
              </Card>
            </>
          )}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="space-y-6 mt-6">
            {/* Business Health Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-base font-black text-[#292f36]">Business Health</h3>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                  (stats?.netProfit || 0) > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {(stats?.netProfit || 0) > 0 ? "Profitable" : "Loss Detected"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="bg-white border-2 border-gray-50 flex flex-col justify-between p-4 min-h-[140px]">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Total Revenue</p>
                    <h3 className={cn(
                      "font-black text-[#292f36]",
                      (stats?.totalRevenue?.toString() || "").length > 9 ? "text-xs" :
                      (stats?.totalRevenue?.toString() || "").length > 7 ? "text-sm" : "text-xl"
                    )}>
                      {stats?.totalRevenue?.toLocaleString()} <span className="text-[10px] opacity-50 ml-1">RWF</span>
                    </h3>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                      <span>Target: 10M RWF</span>
                      <span className="text-accent">{Math.round(((stats?.totalRevenue || 0) / 10000000) * 100)}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${Math.min(100, ((stats?.totalRevenue || 0) / 10000000) * 100)}%` }} />
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-2 border-gray-50 flex flex-col justify-between p-4 min-h-[140px]">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-0.5">Total Expenses</p>
                    <h3 className={cn(
                      "font-black text-rose-600",
                      (stats?.stockExpenses?.toString() || "").length > 7 ? "text-base" : "text-xl"
                    )}>
                      -{stats?.stockExpenses?.toLocaleString()} <span className="text-[10px] opacity-50 ml-1">RWF</span>
                    </h3>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Food: {stats?.totalSpentFood?.toLocaleString()}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Assets: {stats?.totalSpentAssets?.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-2 border-gray-50 flex flex-col justify-between p-4 min-h-[140px]">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-0.5">Yield Management</p>
                    <div className="space-y-2 mt-2">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400">ADR (Avg Daily Rate)</span>
                          <span className="text-xs font-black text-[#292f36]">{formatPrice(stats?.adr || 0)}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400">RevPAR</span>
                          <span className="text-xs font-black text-accent">{formatPrice(stats?.revPar || 0)}</span>
                       </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-[9px] text-gray-500 font-bold italic">
                       Performance per available unit.
                    </p>
                  </div>
                </Card>

                <Card className={cn(
                  "border-2 flex flex-col justify-between p-4 min-h-[140px] transition-all",
                  (stats?.netProfit || 0) > 0 
                    ? "bg-emerald-50/30 border-emerald-100 shadow-sm" 
                    : "bg-rose-50/30 border-rose-100 shadow-sm"
                )}>
                  <div>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest mb-0.5",
                      (stats?.netProfit || 0) > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>Current Net Profit</p>
                    <h3 className={cn(
                      "font-black",
                      (stats?.netProfit || 0) > 0 ? "text-emerald-600" : "text-rose-600",
                      (stats?.netProfit?.toString() || "").length > 7 ? "text-base" : "text-xl"
                    )}>
                      {(stats?.netProfit || 0).toLocaleString()} <span className="text-[10px] opacity-50 ml-1">RWF</span>
                    </h3>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/50">
                    <p className="text-[9px] text-gray-500 font-bold italic">
                      {(stats?.netProfit || 0) > 0 
                        ? "Operating above costs." 
                        : "Expenses are high."}
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Notifications & Alerts Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-[#292f36]">Notifications & Alerts</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Real-time Updates
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white border-2 border-gray-50 rounded-[32px] p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#292f36]">Inventory Alerts</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Action Required</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {stats?.lowStockFoodCount > 0 && (
                      <div className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-rose-500 shadow-sm">
                            <Utensils size={14} />
                          </div>
                          <span className="text-sm font-bold text-[#292f36]">{stats.lowStockFoodCount} Kitchen items are low</span>
                        </div>
                        <button 
                          onClick={() => router.push('/management/admin/notifications')}
                          className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                        >
                          Refill
                        </button>
                      </div>
                    )}
                    {stats?.lowStockAssetsCount > 0 && (
                      <div className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-rose-500 shadow-sm">
                            <Package size={14} />
                          </div>
                          <span className="text-sm font-bold text-[#292f36]">{stats.lowStockAssetsCount} Asset items are low</span>
                        </div>
                        <button 
                          onClick={() => router.push('/management/admin/notifications')}
                          className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                        >
                          Refill
                        </button>
                      </div>
                    )}
                    {stats?.lowStockFoodCount === 0 && stats?.lowStockAssetsCount === 0 && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-3">
                          <CheckSquare size={20} />
                        </div>
                        <p className="text-sm font-bold text-emerald-600">All stock levels are healthy</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending Fulfillment Tasks */}
                <div className="bg-white border-2 border-gray-50 rounded-[32px] p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#292f36]">Pending Fulfillment</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update Stock Usage</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(pendingTasks.orders.length > 0 || pendingTasks.services.length > 0) ? (
                      <>
                        {pendingTasks.orders.length > 0 && (
                          <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-[#292f36]">{pendingTasks.orders.length} Kitchen tasks pending</span>
                            </div>
                            <button 
                              onClick={() => router.push('/management/admin/notifications')}
                              className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                            >
                              Update
                            </button>
                          </div>
                        )}
                        {pendingTasks.services.length > 0 && (
                          <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-[#292f36]">{pendingTasks.services.length} Cleaning tasks pending</span>
                            </div>
                            <button 
                              onClick={() => router.push('/management/admin/notifications')}
                              className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                            >
                              Update
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                          <ClipboardList size={20} />
                        </div>
                        <p className="text-sm font-bold text-gray-400">No pending stock updates</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Card className="bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Guest Arrivals</h3>
          <div className="space-y-3">
            {filteredRecentVisits.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent guest arrivals</p>
            ) : (
              filteredRecentVisits.slice(0, 5).map((visit) => (
                <div key={visit?.id || Math.random()} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                  <div>
                    <p className="font-medium text-gray-900">{visit?.guestName || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{visit?.roomName}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-[#4d668f11] text-[#4d668f]`}>
                      {visit?.status}
                    </span>
                    <span className="text-sm text-gray-400">{visit?.visitTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <Card className="flex flex-col items-center text-center bg-white">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Admin')}&background=292f36&color=fff&size=128`}
            alt="Admin"
            className="w-16 h-16 rounded-full mb-2"
          />
          <h3 className="font-semibold text-gray-900">{user?.fullName || 'Manager'}</h3>
          <p className="text-gray-500 text-sm">{user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : 'Staff'}</p>
        </Card>

        {/* UPCOMING VISITS - Only 4 at a time, rotates */}
        <Card className="bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming</h3>
          <p className="text-sm text-gray-500 mb-4">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <div className="space-y-4">
            {getCurrentItems(recentVisits, upcomingIndex).map((visit, i) => (
              <div
                key={visit?.id || i}
                className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-1 h-14 rounded-full ${visit?.status === "PENDING" ? "bg-[#dcbebe]" :
                  visit?.status === "CONFIRMED" ? "bg-blue-400" :
                    visit?.status === "CHECKED_IN" ? "bg-green-500" :
                      "bg-[#292f36]"
                  }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{visit?.guestName || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{visit?.purpose || "Guest Access"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* TODAY'S SUMMARY - Only 4 at a time, rotates */}
        <Card className="bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="space-y-4">
            {getCurrentItems(finalSummaryItems, summaryIndex).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-1 h-14 rounded-full ${item.color}`} />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
  );
}
