import { useState, useEffect } from 'react';
import { 
  Search, Download, Plus, Mail, Phone, Eye, X, CreditCard, Car, Lock
} from 'lucide-react';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'
import { 
  getAdminCustomers, 
  createAdminCustomer, 
  updateAdminCustomerStatus, 
  getCustomerVehicles, 
  getCustomerHistory 
} from '@/mocks/customer/mockService'

interface Vehicle {
  vehicleId: string;
  brand: string;
  color: string;
  licensePlate: string;
  vehicleType: string;
}

interface Booking {
  bookingId: string;
  serviceType: string;
  status: string;
  scheduledAt: string;
}

interface Customer {
  customerId: string;
  fullName: string;
  phone: string;
  email: string | null;
  tier: 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM';
  totalPoints: number;
  totalVisits: number;
  isActive: boolean;
}

export function AdminCustomerPage() {
  // --- STATES QUẢN LÝ DỮ LIỆU ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATES SIDE DRAWER (CHI TIẾT) ---
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'history'>('info');
  const [customerVehicles, setCustomerVehicles] = useState<Vehicle[]>([]);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingDrawerData, setLoadingDrawerData] = useState(false);

  // --- STATES MODAL THÊM KHÁCH HÀNG ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', password: 'password123' });
  const [formError, setFormError] = useState('');

  // --- STATES BỘ LỌC TÌM KIẾM ---
  // Đổi từ cơ chế multi-checkbox sang cấu trúc Chọn 1 Tab Tier tương tự như phần Promotion để khớp 100% với Backend
  const [activeTierTab, setActiveTierTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. 🌟 HÀM LẤY DANH SÁCH KHÁCH HÀNG ĐÃ ĐỒNG BỘ THAM SỐ XUỐNG DB
  const fetchCustomers = async () => {
    try {
      if (customers.length === 0) setLoading(true);
      const data = await getAdminCustomers(searchQuery, activeTierTab);
      setCustomers(data);
    } catch (err) {
      console.error("Lỗi đồng bộ API khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tự động kích hoạt gọi lại API mỗi khi Khang gõ chữ tìm kiếm hoặc chuyển đổi giữa các Tab Tier
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300); // 300ms Debounce để tránh spam request liên tục khi gõ phím nhanh

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTierTab]);

  // 2. HÀM TỰ ĐỘNG GỌI API CHI TIẾT XE & LỊCH SỬ KHI ẤN CON MẮT
  const handleOpenDrawer = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('info');
    setLoadingDrawerData(true);
    try {
      const [vData, bData] = await Promise.all([
        getCustomerVehicles(customerId),
        getCustomerHistory(customerId)
      ]);
      
      setCustomerVehicles(vData);
      setCustomerBookings(bData);
    } catch (err) {
      console.error("Lỗi lấy thông tin chi tiết phụ:", err);
      setCustomerVehicles([]);
      setCustomerBookings([]);
    } finally {
      setLoadingDrawerData(false);
    }
  };

  // 3. LOGIC XỬ LÝ THÊM MỚI KHÁCH HÀNG (POST API)
  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.fullName || !formData.phone) {
      setFormError('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }
    try {
      await createAdminCustomer(formData);
      alert('Thêm khách hàng mới tại quầy thành công! 🎉');
      setIsAddModalOpen(false);
      setFormData({ fullName: '', phone: '', email: '', password: 'password123' });
      fetchCustomers();
    } catch (err) {
      setFormError('Không thể kết nối đến Backend!');
    }
  };

  // 4. LOGIC XỬ LÝ ĐẢO TRẠNG THÁI KHÓA / KÍCH HOẠT LẠI
  const handleDisableCustomer = async (customerId: string, name: string, currentStatus: boolean) => {
    const actionText = currentStatus ? "VÔ HIỆU HÓA" : "KÍCH HOẠT LẠI";
    const confirmClose = window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của khách hàng "${name}"?`);
    if (!confirmClose) return;

    try {
      await updateAdminCustomerStatus(customerId, !currentStatus);
      alert(`Đã ${actionText.toLowerCase()} tài khoản thành công!`);
      setSelectedCustomerId(null); // Đóng Drawer
      fetchCustomers(); // Làm mới dữ liệu real-time
    } catch (err) {
      alert("Lỗi kết nối API.");
    }
  };

  const currentCustomer = customers.find(c => c.customerId === selectedCustomerId);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Đang kết nối hệ thống AutoWash...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-hidden">
      <AdminSidebar activeItem="customers" />
      <AdminTopbar
        searchPlaceholder="Tìm kiếm khách hàng..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={null}
      />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-70">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Quản lý khách hàng</h1>
              <p className="text-sm text-slate-500">
                Hiển thị: <span className="font-semibold text-blue-900">{customers.length}</span> khách hàng theo bộ lọc
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                <Download className="w-4 h-4" /> Xuất báo cáo
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Thêm khách hàng
              </button>
            </div>
          </div>

          {/* FILTERBAR DẠNG TAB ĐỒNG BỘ CAO CẤP */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 min-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Tìm nhanh theo tên hoặc số điện thoại..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            
            {/* Thanh Tab chuyển phân hạng giống hệt trang Promotion */}
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
              {['ALL', 'MEMBER', 'SILVER', 'GOLD', 'PLATINUM'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTierTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    activeTierTab === tab 
                      ? 'bg-blue-900 text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === 'ALL' ? 'Tất cả' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Hạng</th>
                  <th className="p-4">Điểm tích lũy</th>
                  <th className="p-4 text-center">Số lần rửa</th>
                  <th className="p-4 w-16">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {customers.map((customer) => (
                  <tr key={customer.customerId} className={`hover:bg-slate-50 transition ${selectedCustomerId === customer.customerId ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300" 
                        checked={selectedCustomerId === customer.customerId} 
                        onChange={() => handleOpenDrawer(customer.customerId)} 
                      />
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                        {customer.fullName ? customer.fullName.substring(0, 2).toUpperCase() : 'KH'}
                      </div>
                      <div>
                        <p className={`font-semibold ${customer.isActive ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{customer.fullName}</p>
                        <p className="text-xs text-slate-400">{customer.email || 'Chưa cập nhật'}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{customer.phone}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        customer.tier === 'GOLD' ? 'bg-amber-100 text-amber-700' :
                        customer.tier === 'PLATINUM' ? 'bg-purple-100 text-purple-700' : 
                        customer.tier === 'SILVER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{customer.totalPoints}</td>
                    <td className="p-4 text-center font-medium">{customer.totalVisits}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleOpenDrawer(customer.customerId)}
                        className={`p-1.5 rounded-lg transition ${selectedCustomerId === customer.customerId ? 'bg-blue-900 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- SIDE DETAILS DRAWER --- */}
          {selectedCustomerId && currentCustomer && (
            <>
              <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40" onClick={() => setSelectedCustomerId(null)} />
              
              <div className="fixed right-0 top-0 h-full w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
                
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-100 relative">
                  <button 
                    onClick={() => setSelectedCustomerId(null)}
                    className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-start gap-4 mt-2">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xl relative">
                      {currentCustomer.fullName ? currentCustomer.fullName.substring(0, 2).toUpperCase() : 'KH'}
                      <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${currentCustomer.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{currentCustomer.fullName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {currentCustomer.tier}
                        </span>
                        <span className="text-xs text-slate-400">• {currentCustomer.totalPoints} điểm khả dụng</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs Navigation */}
                <div className="px-6 border-b border-slate-100 flex gap-4 text-sm font-medium text-slate-400">
                  <button 
                    onClick={() => setActiveTab('info')}
                    className={`py-3 transition-all ${activeTab === 'info' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}
                  >
                    Thông tin
                  </button>
                  <button 
                    onClick={() => setActiveTab('vehicles')}
                    className={`py-3 transition-all ${activeTab === 'vehicles' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}
                  >
                    Xe <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-xs ml-0.5">{loadingDrawerData ? '...' : customerVehicles.length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`py-3 transition-all ${activeTab === 'history' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}
                  >
                    Lịch sử rửa
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  {loadingDrawerData ? (
                    <p className="text-xs text-slate-400 text-center py-10">Đang đồng bộ dữ liệu liên quan...</p>
                  ) : (
                    <>
                      {/* TAB 1: THÔNG TIN CHI TIẾT */}
                      {activeTab === 'info' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Chi tiết cá nhân</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5" /> Email</p>
                                <p className="font-medium text-slate-700 truncate">{currentCustomer.email || 'Chưa cập nhật'}</p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Phone className="w-3.5 h-3.5" /> Số điện thoại</p>
                                <p className="font-medium text-slate-700">{currentCustomer.phone}</p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Car className="w-3.5 h-3.5" /> Trạng thái</p>
                                <p className={`font-semibold ${currentCustomer.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                  {currentCustomer.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><CreditCard className="w-3.5 h-3.5" /> Số lần rửa</p>
                                <p className="font-medium text-slate-700">{currentCustomer.totalVisits} lần</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: DANH SÁCH XE THẬT */}
                      {activeTab === 'vehicles' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phương tiện đang sử dụng</h4>
                          {customerVehicles.length > 0 ? (
                            customerVehicles.map((v) => (
                              <div key={v.vehicleId} className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center hover:border-slate-300 transition">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Car className="w-5 h-5" /></div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">{v.licensePlate}</p>
                                    <p className="text-xs text-slate-400">{v.brand} • {v.color} ({v.vehicleType})</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 text-center py-4">ℹ️ Khách hàng chưa đăng ký phương tiện nào.</p>
                          )}
                        </div>
                      )}

                      {/* TAB 3: LỊCH SỬ BOOKING THẬT */}
                      {activeTab === 'history' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử dịch vụ gần đây</h4>
                          {customerBookings.length > 0 ? (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-4">
                              {customerBookings.map((b) => (
                                <div key={b.bookingId || Math.random().toString()} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-bold text-slate-700">{b.serviceType || 'Dịch vụ Autowash'}</span>
                                    <span className="text-green-600 font-semibold">{b.status || 'Hoàn thành'}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400">
                                    Lịch hẹn: {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString('vi-VN') : 'Vừa xong'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 text-center py-4">ℹ️ Khách hàng chưa có lịch sử dịch vụ nào.</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* FOOTER DRAWER */}
                <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
                  {currentCustomer.isActive ? (
                    <button 
                      onClick={() => handleDisableCustomer(currentCustomer.customerId, currentCustomer.fullName, true)}
                      className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                    >
                      Vô hiệu hóa tài khoản
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleDisableCustomer(currentCustomer.customerId, currentCustomer.fullName, false)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm animate-in fade-in duration-100"
                    >
                      Kích hoạt lại tài khoản
                    </button>
                  )}
                </div>

              </div>
            </>
          )}

          {/* --- POPUP MODAL THÊM KHÁCH HÀNG --- */}
          {isAddModalOpen && (
            <>
              <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" onClick={() => setIsAddModalOpen(false)} />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-100 z-50 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Thêm mới khách hàng tại quầy</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                
                {formError && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mb-3 font-medium">⚠️ {formError}</p>}

                <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Họ và Tên *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Trần Minh Khang" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Số điện thoại *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: 0395939056" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Địa chỉ Email (Không bắt buộc)</label>
                    <input 
                      type="email" 
                      placeholder="Ví dụ: khang@gmail.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-2 text-xs text-slate-500 border border-slate-100">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Mật khẩu mặc định hệ thống: <strong className="text-blue-900">password123</strong></span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm"
                    >
                      Xác nhận tạo
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}