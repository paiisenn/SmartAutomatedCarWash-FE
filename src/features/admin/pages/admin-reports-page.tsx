import { useState } from 'react'
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Award,
  Lightbulb,
  UserPlus,
  ChevronRight
} from 'lucide-react'
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'

// Mock top 5 revenue days
const revenueTopDays = [
  { date: '14/10/2023', revenue: '25.000.000đ', washes: 62, avg: '403.000đ', growth: '+12.5%' },
  { date: '07/10/2023', revenue: '24.200.000đ', washes: 58, avg: '417.000đ', growth: '+8.2%' },
  { date: '15/10/2023', revenue: '23.500.000đ', washes: 60, avg: '391.000đ', growth: '+5.1%' },
  { date: '08/10/2023', revenue: '22.100.000đ', washes: 55, avg: '401.000đ', growth: '+4.3%' },
  { date: '19/10/2023', revenue: '20.200.000đ', washes: 50, avg: '404.000đ', growth: '+2.1%' }
]

// Mock top 5 loyal/highest spend customers
const topCustomers = [
  { name: 'Trần Minh', email: 'minhtran@outlook.com', avatar: 'TM', tier: 'platinum' as const, washes: 42, points: '8,120', spend: '12.500.000đ' },
  { name: 'Alex Nguyen', email: 'alex.n@example.com', avatar: 'AN', tier: 'gold' as const, washes: 18, points: '2,450', spend: '6.200.000đ' },
  { name: 'Nguyễn Văn Nam', email: 'namnv@gmail.com', avatar: 'NN', tier: 'gold' as const, washes: 16, points: '2,100', spend: '5.800.000đ' },
  { name: 'Phạm Minh Tuấn', email: 'tuanpm@yahoo.com', avatar: 'PT', tier: 'silver' as const, washes: 12, points: '1,450', spend: '4.100.000đ' },
  { name: 'Lê Hồng', email: 'hongle.car@gmail.com', avatar: 'LH', tier: 'member' as const, washes: 2, points: '150', spend: '800.000đ' }
]

// Mock Daily Customer Growth Data (Simulated bar chart heights)
const customerGrowthBars = [
  { day: '01/10', count: 12, height: '40%' },
  { day: '05/10', count: 18, height: '60%' },
  { day: '10/10', count: 15, height: '50%' },
  { day: '15/10', count: 24, height: '80%' },
  { day: '20/10', count: 22, height: '75%' },
  { day: '25/10', count: 30, height: '95%' },
  { day: '30/10', count: 28, height: '90%' }
]

export function AdminReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState<'revenue' | 'customer'>('revenue')
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('day')

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="reports" />
      <AdminTopbar showSearch={false} actions={null} />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {activeReportTab === 'revenue' ? 'Báo cáo doanh thu' : 'Báo cáo khách hàng'}
              </h1>
              <p className="text-sm text-slate-500">
                {activeReportTab === 'revenue' 
                  ? 'Phân tích chi tiết hiệu suất kinh doanh và doanh thu AutoWash Pro'
                  : 'Phân tích nhân khẩu học, mức độ hoạt động và phân khúc khách hàng'
                }
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Picker Button */}
              <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3 py-2 cursor-pointer hover:bg-surface-container-low transition-colors">
                <Calendar className="size-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-700">01/10/2023 - 31/10/2023</span>
              </div>

              {/* Granularity Toggle */}
              <div className="flex rounded-lg border border-outline-variant bg-surface-container-low p-1">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGranularity(mode)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-semibold transition-all',
                      granularity === mode
                        ? 'bg-surface text-primary shadow-sm'
                        : 'text-secondary hover:text-on-surface'
                    )}
                  >
                    {mode === 'day' ? 'Ngày' : mode === 'week' ? 'Tuần' : 'Tháng'}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <Button variant="default" className="gap-2 bg-info text-white hover:opacity-90">
                <Download size={16} />
                Xuất CSV
              </Button>
            </div>
          </div>

          {/* Report Switching Tabs */}
          <div className="flex gap-4 border-b border-outline-variant">
            <button
              onClick={() => setActiveReportTab('revenue')}
              className={cn(
                'pb-3 text-sm font-semibold transition-all border-b-2',
                activeReportTab === 'revenue'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              )}
            >
              Báo cáo doanh thu
            </button>
            <button
              onClick={() => setActiveReportTab('customer')}
              className={cn(
                'pb-3 text-sm font-semibold transition-all border-b-2',
                activeReportTab === 'customer'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              )}
            >
              Báo cáo khách hàng
            </button>
          </div>

          {/* TAB 1: REVENUE REPORT */}
          {activeReportTab === 'revenue' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Metric Summary Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Tổng doanh thu</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">452.000.000đ</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 12.5% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                </Card>

                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">TB/ngày</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-info/10 text-info">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">15.060.000đ</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 4.2% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-info/5 rounded-full blur-2xl group-hover:bg-info/10 transition-colors"></div>
                </Card>

                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Lượt rửa</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-warning/10 text-warning">
                      <Car size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">1,248</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-danger mt-1">
                      <TrendingDown size={12} /> 2.1% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors"></div>
                </Card>

                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Doanh thu/lượt</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">362.000đ</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 14% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                </Card>
              </div>

              {/* Charts Bento Section */}
              <div className="grid grid-cols-12 gap-6">
                {/* Main Bar Chart */}
                <Card className="col-span-12 lg:col-span-8 p-6 shadow-sm flex flex-col justify-between bg-surface">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu hàng ngày</h4>
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-primary rounded-full"></span>
                        <span className="text-xs text-slate-500 font-medium">Doanh thu (VNĐ)</span>
                      </div>
                    </div>
                    
                    <div className="h-[250px] flex items-end justify-between gap-2 px-2 relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant w-full"></div>
                      </div>
                      
                      {/* Bars */}
                      <div className="w-full h-full flex items-end justify-between gap-1 z-10">
                        <div className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-sm h-[40%] relative group cursor-pointer" title="01/10: 12.4M"></div>
                        <div className="w-full bg-primary/30 hover:bg-primary transition-all rounded-t-sm h-[55%] relative group cursor-pointer" title="05/10: 14.2M"></div>
                        <div className="w-full bg-primary/40 hover:bg-primary transition-all rounded-t-sm h-[45%] relative group cursor-pointer" title="10/10: 13.0M"></div>
                        <div className="w-full bg-primary/60 hover:bg-primary transition-all rounded-t-sm h-[70%] relative group cursor-pointer" title="15/10: 18.5M"></div>
                        <div className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-sm h-[35%] relative group cursor-pointer" title="20/10: 10.1M"></div>
                        <div className="w-full bg-primary/50 hover:bg-primary transition-all rounded-t-sm h-[60%] relative group cursor-pointer" title="25/10: 16.8M"></div>
                        <div className="w-full bg-primary hover:bg-primary transition-all rounded-t-sm h-[95%] relative group cursor-pointer" title="30/10: 24.2M"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 px-2 text-xs text-slate-400 font-medium">
                    <span>01 Oct</span>
                    <span>10 Oct</span>
                    <span>20 Oct</span>
                    <span>30 Oct</span>
                  </div>
                </Card>

                {/* Pie/Donut Chart */}
                <Card className="col-span-12 lg:col-span-4 p-6 shadow-sm flex flex-col justify-between bg-surface">
                  <h4 className="text-lg font-bold text-slate-800">Cơ cấu doanh thu dịch vụ</h4>
                  <div className="flex-1 flex flex-col items-center justify-center relative my-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#004782" stroke-dasharray="345" stroke-dashoffset="138" stroke-width="16"></circle>
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#185FA5" stroke-dasharray="345" stroke-dashoffset="120" stroke-width="16" className="opacity-70" style={{ strokeDashoffset: 258 }}></circle>
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#B5D4F4" stroke-dasharray="345" stroke-dashoffset="86" stroke-width="16" style={{ strokeDashoffset: 345 - 86 }}></circle>
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-xl font-bold text-slate-800">100%</p>
                      <p className="text-xs text-slate-400">Doanh thu</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#004782] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Basic Wash</span>
                      </div>
                      <span className="font-bold text-slate-800">40%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#185FA5] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Premium Wash</span>
                      </div>
                      <span className="font-bold text-slate-800">35%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#B5D4F4] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Full Detail</span>
                      </div>
                      <span className="font-bold text-slate-800">25%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Table section */}
              <Card className="shadow-sm overflow-hidden bg-surface">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-800">Top 5 ngày doanh thu cao nhất</h4>
                  <button className="text-primary text-xs font-semibold hover:underline flex items-center gap-0.5">
                    Xem tất cả <ChevronRight size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Ngày</th>
                        <th className="px-6 py-4">Tổng doanh thu</th>
                        <th className="px-6 py-4">Lượt rửa</th>
                        <th className="px-6 py-4">Doanh thu TB/lượt</th>
                        <th className="px-6 py-4">Tăng trưởng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-sm text-slate-600">
                      {revenueTopDays.map((day) => (
                        <tr key={day.date} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{day.date}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{day.revenue}</td>
                          <td className="px-6 py-4 font-medium text-slate-500">{day.washes}</td>
                          <td className="px-6 py-4 font-medium">{day.avg}</td>
                          <td className="px-6 py-4">
                            <span className="bg-success/10 text-success px-2.5 py-0.5 rounded-full text-xs font-bold">
                              {day.growth}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Insight tip banner */}
              <div className="bg-primary rounded-xl p-6 flex flex-col md:flex-row items-center justify-between text-white gap-4 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">Phân tích chuyên sâu từ hệ thống</h4>
                    <p className="text-xs text-white/90 leading-relaxed mt-1">
                      Gói dịch vụ "Full-detail" đang có xu hướng tăng trưởng 15% vào cuối tuần. Hãy cân nhắc tạo thêm chiến dịch combo rửa xe nhanh vào giữa tuần để cân bằng lưu lượng.
                    </p>
                  </div>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90 text-xs font-bold shrink-0">
                  Xem đề xuất
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER REPORT */}
          {activeReportTab === 'customer' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Metric Summary Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Tổng khách hàng</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">3,820</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 8.4% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                </Card>

                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Khách mới tháng này</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-info/10 text-info">
                      <UserPlus size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">420</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 15.3% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-info/5 rounded-full blur-2xl group-hover:bg-info/10 transition-colors"></div>
                </Card>

                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Khách hoạt động</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
                      <Award size={20} />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">1,850</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 5.2% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-success/5 rounded-full blur-2xl group-hover:bg-success/10 transition-colors"></div>
                </Card>

                <Card className="flex h-32 flex-col justify-between p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10">
                    <p className="text-sm font-medium text-slate-500">Hạng Gold / Platinum</p>
                    <div className="flex size-10 items-center justify-center rounded-full bg-warning/10 text-warning">
                      <Award size={20} className="fill-amber-500 text-amber-500" />
                    </div>
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold">320</h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-success mt-1">
                      <TrendingUp size={12} /> 12.1% so với tháng trước
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 size-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors"></div>
                </Card>
              </div>

              {/* Bento Charts customer */}
              <div className="grid grid-cols-12 gap-6">
                {/* Growth Bar Chart */}
                <Card className="col-span-12 lg:col-span-8 p-6 shadow-sm flex flex-col justify-between bg-surface">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-slate-800">Tăng trưởng khách hàng mới</h4>
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-info rounded-full"></span>
                        <span className="text-xs text-slate-500 font-medium">Khách hàng mới</span>
                      </div>
                    </div>
                    
                    <div className="h-[250px] flex items-end justify-between gap-2 px-2 relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant/30 w-full"></div>
                        <div className="border-t border-dashed border-outline-variant w-full"></div>
                      </div>
                      
                      {/* Bars */}
                      <div className="w-full h-full flex items-end justify-between gap-1 z-10">
                        {customerGrowthBars.map((bar) => (
                          <div 
                            key={bar.day}
                            className="w-full bg-info/20 hover:bg-info transition-all rounded-t-sm relative group cursor-pointer"
                            style={{ height: bar.height }}
                            title={`${bar.day}: +${bar.count} khách`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 px-2 text-xs text-slate-400 font-medium">
                    <span>01 Oct</span>
                    <span>10 Oct</span>
                    <span>20 Oct</span>
                    <span>30 Oct</span>
                  </div>
                </Card>

                {/* Donut Chart Customer segment */}
                <Card className="col-span-12 lg:col-span-4 p-6 shadow-sm flex flex-col justify-between bg-surface">
                  <h4 className="text-lg font-bold text-slate-800">Cơ cấu phân khúc khách hàng</h4>
                  <div className="flex-1 flex flex-col items-center justify-center relative my-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#D3D1C7" stroke-dasharray="345" stroke-dashoffset="173" stroke-width="16"></circle>
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#B5D4F4" stroke-dasharray="345" stroke-dashoffset="259" stroke-width="16" style={{ strokeDashoffset: 173 + 86 }}></circle>
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#FAC775" stroke-dasharray="345" stroke-dashoffset="311" stroke-width="16" style={{ strokeDashoffset: 259 + 52 }}></circle>
                      <circle cx="80" cy="80" fill="transparent" r="55" stroke="#CECBF6" stroke-dasharray="345" stroke-dashoffset="345" stroke-width="16" style={{ strokeDashoffset: 311 + 34 }}></circle>
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-xl font-bold text-slate-800">3,820</p>
                      <p className="text-xs text-slate-400">Khách hàng</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#D3D1C7] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Member</span>
                      </div>
                      <span className="font-bold text-slate-800">50%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#B5D4F4] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Silver</span>
                      </div>
                      <span className="font-bold text-slate-800">25%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#FAC775] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Gold</span>
                      </div>
                      <span className="font-bold text-slate-800">15%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3 bg-[#CECBF6] rounded-full"></span>
                        <span className="text-slate-600 font-medium">Platinum</span>
                      </div>
                      <span className="font-bold text-slate-800">10%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Table section Top Loyal Customers */}
              <Card className="shadow-sm overflow-hidden bg-surface">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-800">Top 5 khách hàng trung thành nhất</h4>
                  <button className="text-primary text-xs font-semibold hover:underline flex items-center gap-0.5">
                    Xem tất cả <ChevronRight size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Khách hàng</th>
                        <th className="px-6 py-4">Hạng</th>
                        <th className="px-6 py-4 text-center">Số lần rửa</th>
                        <th className="px-6 py-4">Điểm</th>
                        <th className="px-6 py-4">Tổng chi tiêu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-sm text-slate-600">
                      {topCustomers.map((customer) => (
                        <tr key={customer.email} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                              {customer.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{customer.name}</p>
                              <p className="text-xs text-slate-400">{customer.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <Badge variant={customer.tier} className="text-[10px]">
                              {customer.tier.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-3 text-center font-medium text-slate-500">{customer.washes}</td>
                          <td className="px-6 py-3 font-semibold text-slate-700">{customer.points}</td>
                          <td className="px-6 py-3 font-bold text-slate-800">{customer.spend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Insight tip banner */}
              <div className="bg-primary rounded-xl p-6 flex flex-col md:flex-row items-center justify-between text-white gap-4 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">Phân tích chuyên sâu phân khúc khách hàng</h4>
                    <p className="text-xs text-white/90 leading-relaxed mt-1">
                      Phân khúc Khách hàng VIP (Hạng Vàng & Bạch Kim) tuy chỉ chiếm 25% số lượng nhưng đóng góp đến 65% tổng doanh thu. Hãy cân nhắc chạy thêm các chương trình ưu đãi chăm sóc đặc biệt để gia tăng lòng trung thành.
                    </p>
                  </div>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90 text-xs font-bold shrink-0">
                  Xem đề xuất
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
