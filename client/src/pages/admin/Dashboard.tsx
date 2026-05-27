import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCircle, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Eye, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  GraduationCap,
  BookOpen,
  Coffee,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const COLORS = ["#6366f1", "#34d399", "#f59e0b", "#ef4444", "#8b5cf6", "#ec489a"];

interface DashboardStats {
  students: number;
  teachers: number;
  employees: number;
  earnings: number;
  genderChart: { name: string; value: number }[];
  attendanceChart: { day: string; present: number; absent: number }[];
  notices: any[];
  recentActivities?: any[];
  departmentStats?: { name: string; count: number }[];
  monthlyRevenue?: { month: string; revenue: number }[];
  attendanceRate?: number;
  studentGrowth?: number;
  teacherGrowth?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "year">("week");
  const [showAllNotices, setShowAllNotices] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceRate = () => {
    if (!stats?.attendanceChart) return 0;
    const totalPresent = stats.attendanceChart.reduce((sum, day) => sum + day.present, 0);
    const totalAbsent = stats.attendanceChart.reduce((sum, day) => sum + day.absent, 0);
    return totalPresent + totalAbsent === 0 ? 0 : (totalPresent / (totalPresent + totalAbsent)) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      label: "Total Students",
      value: stats?.students ?? 0,
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: stats?.studentGrowth ?? 12,
      trendUp: true
    },
    {
      label: "Total Teachers",
      value: stats?.teachers ?? 0,
      icon: Users,
      color: "from-indigo-500 to-sky-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: stats?.teacherGrowth ?? 8,
      trendUp: true
    },
    {
      label: "Total Employees",
      value: stats?.employees ?? 0,
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: 5,
      trendUp: true
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.earnings ?? 0),
      icon: DollarSign,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: 15,
      trendUp: true
    }
  ];

  const recentActivities = [
    { id: 1, action: "New student enrollment", time: "2 hours ago", user: "John Doe", type: "student" },
    { id: 2, action: "Faculty meeting scheduled", time: "5 hours ago", user: "Admin", type: "meeting" },
    { id: 3, action: "Exam results published", time: "1 day ago", user: "Academic Dept", type: "exam" },
    { id: 4, action: "New course added", time: "2 days ago", user: "Curriculum Team", type: "course" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome Back, Admin 👋</h1>
              <p className="text-slate-500 mt-1">Here's what's happening with your institution today</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(), "MMMM dd, yyyy")}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <AnimatePresence>
              {statCards.map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                        <div className="flex items-center gap-1">
                          {card.trendUp ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-xs font-medium ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                            {card.trend}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{card.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gender Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-primary" />
                  Student Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 rounded-lg" />
                ) : (
                  <div>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={stats?.genderChart || []}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                          {(stats?.genderChart || []).map((entry: any, idx: number) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Total Students: {stats?.students || 0}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Attendance Overview
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-xs text-slate-600">Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-slate-600">Absent</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 rounded-lg" />
                ) : (
                  <div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={stats?.attendanceChart || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" fill="#6366f1" name="Present" />
                        <Bar dataKey="absent" fill="#34d399" name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-slate-600">Weekly Attendance Rate</span>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {getAttendanceRate().toFixed(1)}% Present
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200 h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Top Departments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-48 rounded-lg" />
                ) : (
                  <div className="space-y-3">
                    {stats?.departmentStats?.slice(0, 5).map((dept, idx) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-600">{idx + 1}.</span>
                          <span className="text-sm text-slate-700">{dept.name}</span>
                        </div>
                        <Badge variant="secondary">{dept.count} students</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-slate-200 h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0"
                    >
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {activity.type === 'student' && <GraduationCap className="w-4 h-4 text-primary" />}
                        {activity.type === 'meeting' && <Users className="w-4 h-4 text-emerald-500" />}
                        {activity.type === 'exam' && <Award className="w-4 h-4 text-amber-500" />}
                        {activity.type === 'course' && <BookOpen className="w-4 h-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{activity.action}</p>
                        <p className="text-xs text-slate-500 mt-1">by {activity.user}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-slate-200 h-full bg-gradient-to-br from-primary/5 to-sky-500/5">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-2 bg-white hover:bg-slate-50 text-slate-700">
                    <Users className="w-4 h-4" />
                    Add New Student
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-white hover:bg-slate-50 text-slate-700">
                    <Briefcase className="w-4 h-4" />
                    Add New Teacher
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-white hover:bg-slate-50 text-slate-700">
                    <Calendar className="w-4 h-4" />
                    Create Event
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-white hover:bg-slate-50 text-slate-700">
                    <Bell className="w-4 h-4" />
                    Post Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Notices Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notice Board
                </CardTitle>
                {stats?.notices && stats.notices.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAllNotices(!showAllNotices)}
                  >
                    {showAllNotices ? "Show Less" : "View All"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(showAllNotices ? stats?.notices : stats?.notices?.slice(0, 3))?.map((notice: any, idx: number) => (
                    <motion.div
                      key={notice._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {notice.image ? (
                          <img 
                            src={notice.image} 
                            alt={notice.title} 
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/48x48";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-sky-500/20 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-800">{notice.title}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {notice.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Eye className="w-3 h-3" />
                          {notice.views || 0}
                        </div>
                        <Button size="sm" variant="ghost" className="h-8">
                          Read More
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {(!stats?.notices || stats.notices.length === 0) && (
                    <div className="text-center py-8 text-slate-400">
                      No notices available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}