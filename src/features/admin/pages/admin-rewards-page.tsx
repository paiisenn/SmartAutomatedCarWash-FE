import { useState } from 'react'
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'

export function AdminRewardsPage() {
  // 1. Tạo state giả lập số điểm hiện tại để khi đổi quà điểm sẽ tự trừ trực quan!
  const [currentPoints, setCurrentPoints] = useState(1240)
  const [selectedReward, setSelectedReward] = useState<any | null>(null)

  const rewardsData = [
    { id: 1, title: 'Giảm 10.000đ', cost: 50, icon: '🎫' },
    { id: 2, title: 'Rửa Basic miễn phí', cost: 200, icon: '🚗' },
    { id: 3, title: 'Rửa Premium miễn phí', cost: 400, icon: '⭐', badge: 'HẠNG GOLD+' },
    { id: 4, title: 'Dịch vụ xịt bóng', cost: 100, icon: '✨' },
    { id: 5, title: 'Làm thơm nội thất', cost: 100, icon: '💨' },
    { id: 6, title: 'Phủ Ceramic', cost: 2000, icon: '🛡️', locked: true },
  ]

  const handleExchange = (reward: any) => {
    if (reward.cost > currentPoints || reward.locked) return
    setSelectedReward(reward)
  }

  const confirmExchange = () => {
    if (selectedReward) {
      setCurrentPoints(prev => prev - selectedReward.cost)
      alert(`🎉 Đổi thành công ${selectedReward.title}!`)
      setSelectedReward(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="promotion" />
      <AdminTopbar />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-7xl space-y-6">
      {/* Header số điểm */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-xl font-bold text-slate-800">AutoWash Pro <span className="text-sm font-normal text-slate-400">| Đổi điểm lấy thưởng</span></h2>
          <p className="text-sm text-slate-500">Sử dụng điểm tích lũy để nhận ưu đãi đặc biệt.</p>
        </div>
        <div className="bg-blue-900 text-white px-4 py-2 rounded-full font-bold">
          ⭐ Điểm hiện có: {currentPoints.toLocaleString()}
        </div>
      </div>

      {/* Grid danh sách quà tặng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewardsData.map((reward) => {
          const isAffordable = currentPoints >= reward.cost && !reward.locked
          
          return (
            <div
              key={reward.id}
              onClick={() => handleExchange(reward)}
              className={`flex items-center justify-between p-5 bg-white rounded-2xl border transition-all duration-200 ${
                isAffordable 
                  ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-slate-100' 
                  : 'opacity-60 cursor-not-allowed bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl p-3 bg-slate-100 rounded-xl">{reward.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    {reward.title}
                    {reward.badge && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-md font-bold">{reward.badge}</span>}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">{reward.cost}đ</p>
                </div>
              </div>
              {!isAffordable && <span className="text-slate-400">🔒</span>}
            </div>
          )
        })}
      </div>

      {/* Pop-up Modal xác nhận đổi quà giả lập */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900">Xác nhận đổi quà</h3>
            <p className="text-sm text-slate-600">
              Bạn có chắc chắn muốn dùng <strong className="text-blue-600">{selectedReward.cost}đ</strong> để đổi gói <strong className="text-slate-900">{selectedReward.title}</strong> không?
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setSelectedReward(null)} className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
              <button onClick={confirmExchange} className="px-4 py-2 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-800">Đồng ý đổi</button>
            </div>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  )
}