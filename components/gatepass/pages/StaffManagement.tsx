'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  UserPlus, 
  Search, 
  Filter, 
  UserMinus, 
  Clock, 
  Mail, 
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChefHat,
  BadgeCheck,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/gatepass/ConfirmModal';

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('RECEPTION');
  const [isInviting, setIsInviting] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffData, inviteData] = await Promise.all([
        apiService.getStaffMembers(),
        apiService.getPendingInvitations()
      ]);
      setStaff(staffData);
      setInvitations(inviteData);
    } catch (err) {
      console.error('Failed to fetch staff data', err);
      toast.error('Failed to load staff management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setIsInviting(true);
    try {
      await apiService.inviteStaff(inviteEmail, inviteRole);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Deactivate Staff Member',
      message: `Are you sure you want to deactivate ${name}? They will no longer be able to access the management portal.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await apiService.deactivateStaff(id);
          toast.success(`${name} deactivated successfully`);
          fetchData();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to deactivate user');
        }
      }
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <ShieldCheck className="w-4 h-4 text-rose-500" />;
      case 'KITCHEN': return <ChefHat className="w-4 h-4 text-emerald-500" />;
      case 'RECEPTION': return <BadgeCheck className="w-4 h-4 text-blue-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredStaff = staff.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 font-jost pb-10">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#292f36] tracking-tighter">Staff Management</h1>
          <p className="text-gray-500 font-medium mt-1">Coordinate your team and manage property access</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#292f36] text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-sm"
          >
            <UserPlus className="w-5 h-5" />
            Invite Staff
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Staff', value: staff.length, icon: Shield, color: 'bg-blue-50 text-blue-600' },
          { label: 'Kitchen Team', value: staff.filter(s => s.role === 'KITCHEN').length, icon: ChefHat, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Reception', value: staff.filter(s => s.role === 'RECEPTION').length, icon: BadgeCheck, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Pending Invitations', value: invitations.length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-[#292f36] leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Staff Table */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
              <h2 className="font-black text-[#292f36] flex items-center gap-2">
                Active Personnel
                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{filteredStaff.length}</span>
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#292f36]/5 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div className="w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text">Team Member</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#292f36] mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                          <Users className="w-12 h-12 opacity-20" />
                          <p className="text-sm font-medium">No staff members found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-[#292f36] text-sm">
                              {s.fullName.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-[#292f36] leading-tight truncate">{s.fullName}</p>
                              <p className="text-[10px] text-gray-400 font-medium truncate">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg w-fit">
                            {getRoleIcon(s.role)}
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">{s.role}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {s.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          {s.isActive && s.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeactivate(s.id, s.fullName)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Deactivate Staff"
                            >
                              <UserMinus className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Invitations Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-[#292f36] mb-6 flex items-center gap-2">
              Pending Invites
              <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-full">{invitations.length}</span>
            </h2>
            
            <div className="space-y-4">
              {invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                  <p className="text-[11px] font-medium text-gray-400">No pending invitations</p>
                </div>
              ) : (
                invitations.map((invite) => (
                  <div key={invite.id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm">
                           <Clock className="w-3.5 h-3.5 text-amber-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#292f36]">{invite.role}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#292f36] truncate">{invite.email}</p>
                    <p className="text-[9px] text-gray-400 mt-1 font-medium italic">
                      Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
              <div className="p-4 rounded-2xl bg-[#292f36] text-white">
                 <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Security Tip</span>
                 </div>
                 <p className="text-[11px] opacity-80 leading-relaxed font-medium">
                   Invitations automatically expire after 24 hours. Ensure staff complete registration within this window.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-[#292f36]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#292f36]">Invite Staff</h3>
                    <p className="text-xs text-gray-400 font-medium">Add professional team members</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="staff@unicavilla.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#292f36]/5 outline-none text-sm font-bold placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Assigned Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'RECEPTION', label: 'Reception', icon: BadgeCheck },
                      { id: 'KITCHEN', label: 'Kitchen', icon: ChefHat },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setInviteRole(role.id)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          inviteRole === role.id 
                          ? 'border-[#292f36] bg-[#292f36] text-white' 
                          : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <role.icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-gray-100 text-[#292f36] font-bold text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting || !inviteEmail}
                    className="flex-[2] py-4 rounded-2xl bg-[#292f36] text-white font-black text-sm shadow-xl shadow-black/10 hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isInviting ? 'Sending...' : 'Send Invitation'}
                    {!isInviting && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        type={confirmConfig.type}
      />
    </div>
  );
}
