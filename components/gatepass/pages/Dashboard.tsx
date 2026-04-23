'use client';

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import DashboardAnimation from "@/lib/gatepass/assets/Promo Code.json";
import { apiService, UserProfile } from "@/lib/gatepass/apiService";
import type { DashboardStats, Visit } from "@/lib/gatepass/types";

const Card = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div className={`rounded-2xl shadow-sm p-5 ${className}`} onClick={onClick}>{children}</div>
);

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

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

        if (needsStats) promises.push(apiService.getDashboardStats());
        if (needsVisits) promises.push(apiService.getVisits({ limit: 20 }));

        const results = await Promise.all(promises);
        
        let resultIndex = 0;
        if (needsStats) setStats(results[resultIndex++]);
        if (needsVisits) setRecentVisits(results[resultIndex++].visits);

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

  // Filter recent visits: only show if within the last 2 days
  const filterRecentVisits = (visits: Visit[]) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    return (visits || []).filter(v => {
      const visitDate = new Date(v.createdAt);
      return visitDate >= twoDaysAgo;
    });
  };

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
