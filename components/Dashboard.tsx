import React, { useMemo, useState, useEffect } from 'react';
import { OvertimeEntry, User, UserRole } from '../types';
import { mockService } from '../services/mockService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Calendar, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface DashboardProps {
  entries: OvertimeEntry[];
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, user }) => {
  const [adminStats, setAdminStats] = useState<{name: string, hours: number}[]>([]);
  
  // Calculate stats for current user
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDateStr = now.toISOString().split('T')[0];

    let monthHours = 0;
    let yearHours = 0;
    let todayHours = 0;

    entries.forEach(e => {
      const eDate = new Date(e.date);
      if (e.status === 'REJECTED') return; 

      if (eDate.getFullYear() === currentYear) {
        yearHours += e.durationHours;
        if (eDate.getMonth() === currentMonth) {
          monthHours += e.durationHours;
        }
      }
      if (e.date === currentDateStr) {
        todayHours += e.durationHours;
      }
    });

    return { monthHours, yearHours, todayHours };
  }, [entries]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const data: { name: string; hours: number }[] = [
      { name: 'Jan', hours: 0 }, { name: 'Feb', hours: 0 }, { name: 'Mar', hours: 0 },
      { name: 'Apr', hours: 0 }, { name: 'May', hours: 0 }, { name: 'Jun', hours: 0 },
      { name: 'Jul', hours: 0 }, { name: 'Aug', hours: 0 }, { name: 'Sep', hours: 0 },
      { name: 'Oct', hours: 0 }, { name: 'Nov', hours: 0 }, { name: 'Dec', hours: 0 },
    ];

    entries.forEach(e => {
      if (e.status === 'REJECTED') return;
      const date = new Date(e.date);
      if (date.getFullYear() === new Date().getFullYear()) {
        data[date.getMonth()].hours += e.durationHours;
      }
    });

    return data;
  }, [entries]);

  // Fetch Admin Stats
  useEffect(() => {
    if (user.role === UserRole.ADMIN) {
      const fetchAdminData = async () => {
        try {
          const [allEntries, allUsers] = await Promise.all([
            mockService.getAllEntries(),
            mockService.getUsers()
          ]);

          const stats = allUsers.map(u => {
            const totalHours = allEntries
              .filter(e => e.userId === u.id && new Date(e.date).getFullYear() === new Date().getFullYear())
              .reduce((acc, curr) => acc + curr.durationHours, 0);
            return { name: u.username, hours: totalHours, role: u.role };
          }).sort((a, b) => b.hours - a.hours);

          setAdminStats(stats);
        } catch (error) {
          console.error("Failed to fetch admin stats", error);
        }
      };
      fetchAdminData();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="This Month" 
          value={`${stats.monthHours} hrs`} 
          icon={Calendar} 
          className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
        />
        <StatCard 
          title="This Year" 
          value={`${stats.yearHours} hrs`} 
          icon={Clock} 
          className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
        />
        <StatCard 
          title="Today" 
          value={`${stats.todayHours} hrs`} 
          icon={CheckCircle} 
          className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User's Personal Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary"/>
              Your Monthly Activity
            </CardTitle>
            <CardDescription>Overview for {new Date().getFullYear()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={40} name="Hours">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 0 ? 'hsl(222.2 47.4% 11.2%)' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Admin Widget: Team Comparison */}
        {user.role === UserRole.ADMIN && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600"/>
                Team Overview
              </CardTitle>
              <CardDescription>Total Hours YTD by Employee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={20} name="Total Hours">
                      {adminStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === user.username ? 'hsl(222.2 47.4% 11.2%)' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: any; className: string }> = ({ title, value, icon: Icon, className }) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${className}`}>
        <Icon size={24} />
      </div>
    </CardContent>
  </Card>
);
