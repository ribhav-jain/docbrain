import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import {
  Activity,
  Users,
  Database,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  FileText,
  MessageSquare,
  Clock,
  Lightbulb,
  HardDrive,
  Flame,
  Award
} from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { documents, messages } = useStore();

  // Dynamic stats calculation
  const totalDocs = documents.length;
  const totalSizeMB = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size.split(' ')[0]);
    return acc + (doc.size.includes('KB') ? size / 1024 : size);
  }, 0);

  const userMessages = messages.filter(m => m.role === 'user');
  const totalQueries = userMessages.length;
  const assistantMessages = messages.filter(m => m.role === 'assistant').length;

  // Mock data for charts - in a real app, this would aggregate from message history
  const usageData = [
    { name: 'Mon', queries: Math.max(10, totalQueries * 2), responses: Math.max(8, assistantMessages * 2) },
    { name: 'Tue', queries: Math.max(20, totalQueries * 3), responses: Math.max(18, assistantMessages * 3) },
    { name: 'Wed', queries: Math.max(15, totalQueries * 5), responses: Math.max(13, assistantMessages * 5) },
    { name: 'Thu', queries: Math.max(30, totalQueries * 4), responses: Math.max(28, assistantMessages * 4) },
    { name: 'Fri', queries: Math.max(25, totalQueries * 6), responses: Math.max(23, assistantMessages * 6) },
    { name: 'Sat', queries: Math.max(5, totalQueries), responses: Math.max(3, assistantMessages) },
    { name: 'Sun', queries: totalQueries, responses: assistantMessages },
  ];

  // Performance metrics data
  const performanceData = [
    { time: '12:00', latency: 1.2, accuracy: 94 },
    { time: '14:00', latency: 1.1, accuracy: 95 },
    { time: '16:00', latency: 16, accuracy: 85 },
    { time: '18:00', latency: 0.9, accuracy: 96 },
    { time: '20:00', latency: 14, accuracy: 92 },
    { time: '22:00', latency: 1.0, accuracy: 97 },
  ];

  // Calculate real distribution
  const pdfCount = documents.filter(d => d.type === 'PDF').length;
  const docxCount = documents.filter(d => d.type === 'DOCX').length;
  const txtCount = documents.filter(d => d.type === 'TXT').length;
  const otherCount = totalDocs - pdfCount - docxCount - txtCount;

  const storageData = [
    { name: 'PDFs', value: totalDocs > 0 ? Math.round((pdfCount / totalDocs) * 100) : 0, color: '#3b82f6' },
    { name: 'DOCX', value: totalDocs > 0 ? Math.round((docxCount / totalDocs) * 100) : 0, color: '#8b5cf6' },
    { name: 'TXT', value: totalDocs > 0 ? Math.round((txtCount / totalDocs) * 100) : 0, color: '#ec4899' },
    { name: 'Other', value: totalDocs > 0 ? Math.round((otherCount / totalDocs) * 100) : 0, color: '#64748b' },
  ].filter(d => d.value > 0);

  const stats = [
    {
      title: "Total Queries",
      value: totalQueries.toString(),
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      desc: "vs last month",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      title: "Chat Sessions",
      value: Math.ceil(totalQueries / 5).toString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      desc: "Active sessions",
      color: "from-purple-500/20 to-purple-500/5"
    },
    {
      title: "Documents Indexed",
      value: totalDocs.toString(),
      change: "+4",
      trend: "up",
      icon: FileText,
      desc: "In knowledge base",
      color: "from-emerald-500/20 to-emerald-500/5"
    },
    {
      title: "Storage Used",
      value: totalSizeMB.toFixed(2) + " MB",
      change: "85%",
      trend: "neutral",
      icon: HardDrive,
      desc: "Quota usage",
      color: "from-orange-500/20 to-orange-500/5"
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: "-0.3s",
      trend: "up",
      icon: Zap,
      desc: "Avg latency",
      color: "from-yellow-500/20 to-yellow-500/5"
    },
    {
      title: "Knowledge Score",
      value: "94%",
      change: "+2.1%",
      trend: "up",
      icon: Award,
      desc: "Quality index",
      color: "from-pink-500/20 to-pink-500/5"
    }
  ];

  return (
    <div className="h-full flex flex-col p-6 md:p-10 gap-8 overflow-y-auto">
      <div className="flex items-end justify-between animate-in-fade-up">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into knowledge base performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium hover:bg-accent transition-colors">Last 7 Days</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">Export Report</button>
        </div>
      </div>

      {/* Key Stats Grid - Enhanced with more cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`glass-card rounded-2xl p-5 relative overflow-hidden group animate-in-fade-up border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            style={{ animationDelay: `${i * 75}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <stat.icon className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={cn(
                    "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                    stat.trend === 'up' ? "bg-emerald-500/15 text-emerald-600" : "bg-yellow-500/15 text-yellow-600"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Query Volume */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-sm animate-in-fade-up [animation-delay:400ms] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Interaction Metrics</h3>
              <p className="text-sm text-muted-foreground">Daily queries and responses</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  tickMargin={10}
                />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorQueries)"
                  name="Queries"
                />
                <Area
                  type="monotone"
                  dataKey="responses"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResponses)"
                  name="Responses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Distribution Chart */}
        <div className="glass-card rounded-2xl p-6 shadow-sm animate-in-fade-up [animation-delay:500ms] border border-white/10">
          <div className="mb-6">
            <h3 className="font-bold text-lg">Document Types</h3>
            <p className="text-sm text-muted-foreground">Distribution by format</p>
          </div>
          <div className="h-[300px] w-full relative">
            {storageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={5}
                    stroke="none"
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-xl)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available
              </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold tracking-tighter text-foreground">{documents.length}</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Docs</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {storageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics Chart */}
      <div className="glass-card rounded-2xl p-6 shadow-sm animate-in-fade-up [animation-delay:600ms] border border-white/10">
        <div className="mb-6">
          <h3 className="font-bold text-lg">System Performance</h3>
          <p className="text-sm text-muted-foreground">Response time and accuracy trends</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-xl)'
                }}
              />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Latency (s)"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Accuracy (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
