import React, { useEffect, useState } from "react";
import FloatingKratong from "./components/FloatingKratong";
import CreateKratongModal from "./components/CreateKratongModal";
import { loadKratongs, saveKratong } from "./utils/storage";
import "./index.css";

export default function App() {
  const [kratongs, setKratongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load kratongs on mount and refresh every 5 seconds
  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadKratongs();
        setKratongs(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load kratongs', err);
        setIsLoading(false);
      }
    }

    loadData();

    // refresh ทุก 5 วิ เพื่อดึงข้อมูลล่าสุด
    const interval = setInterval(async () => {
      try {
        const latest = await loadKratongs();
        setKratongs(latest);
      } catch (err) {
        console.error('Failed to refresh kratongs', err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleCreate(newKratong) {
    try {
      const updated = await saveKratong(newKratong);
      setKratongs(updated);
    } catch (err) {
      console.error('Failed to create kratong', err);
      // Still update UI even if API call fails (fallback to localStorage)
      const updated = await loadKratongs();
      setKratongs(updated);
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-black text-white">
      {/* ฉากหลัก 1920x1080 (responsive โดย max-w/max-h) */}
      <div
        className="relative w-[1920px] h-[1080px] max-w-full max-h-full overflow-hidden rounded-xl shadow-2xl border border-white/20"
        style={{
          backgroundImage: "url('/lkt.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay ไลท์ให้ตัวหนังสืออ่านง่าย */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.6)_60%)] pointer-events-none" />

        {/* render กระทงทุกใบ */}
        <div className="absolute inset-0 pointer-events-none" style={{ fontFamily: "'Kanit', sans-serif" }}>
          {(() => {
            const total = kratongs.length;
            // กำหนดแถบน้ำ (จากขอบล่างขึ้นบน) เพื่อไม่ให้ลอยสูงเกินพื้นหลัง
            const WATER_MIN_BOTTOM = 60;    // ต่ำสุดจากก้นจอ
            const WATER_MAX_BOTTOM = 360;   // สูงสุดจากก้นจอ (อย่าเกินนี้)
            const usable = Math.max(1, WATER_MAX_BOTTOM - WATER_MIN_BOTTOM);
            const step = Math.floor(usable / Math.max(1, total));
            const half = Math.floor(step / 2);
            return kratongs.map((k, idx) => {
              const baseY = WATER_MIN_BOTTOM + idx * step + half;
              return (
                <FloatingKratong key={k.id} kratong={k} index={idx} baseY={baseY} />
              );
            });
          })()}

          {/* ปุ่มสร้างกระทง — ย้ายมาอยู่กลางล่าง (เหนือ footer) */}
          <div className="absolute left-0 right-0 bottom-20 flex items-center justify-center pointer-events-none">
            <button
              className="pointer-events-auto px-6 py-3 rounded-2xl bg-white/90 text-gray-900 text-lg font-semibold shadow-xl border border-white hover:bg-white"
              onClick={() => setShowModal(true)}
            >
              สร้างกระทงของคุณ | Create Your Kratong 🌕
            </button>
          </div>
        </div>

        {/* footer credit เล็กๆ */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-center text-xs font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] text-xs opacity-80">
         <div> 梅林，我爱你 ❤️</div>
         <div>KN.ENGR TU2025 | คณะกรรมการนักศึกษาคณะวิศวกรรมศาสตร์ </div>
          
        </div>
      </div>

      {/* modal popup */}
      <CreateKratongModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
