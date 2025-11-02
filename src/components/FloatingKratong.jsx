import React from "react";

export default function FloatingKratong({ kratong, index }) {
  // ความสูงจากขอบล่างของฉาก
  const baseY = 60 + (index % 5) * 80;

  // random-ish เพื่อไม่ให้กระทงทั้งหมด sync กัน
  const floatDelay = `${(index % 7) * 0.5}s`;
  const driftDuration = `${20 + (index % 5) * 30}s`; // 20s, 23s, 26s,...
  const ageMs = Date.now() - (kratong.createdAt ?? 0);
  const isNew = ageMs < 3000; // ถือว่า 'ใหม่' ถ้าน้อยกว่า 3 วินาที

  return (
    // ชั้นนอก = เคลื่อนที่ทางขวา
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: `${baseY}px`,
        left: 0,

        animationName: "drift-right",
        animationDuration: driftDuration,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationDelay: isNew? "0" : floatDelay,
        animationFillMode: "forwards",
      }}
    >
      {/* ชั้นใน = โยกขึ้นลง */}
      <div
        style={{
          animationName: "bobbing",
          animationDuration: "2s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: floatDelay,
          animationFillMode: "forwards",
        }}
      >
        {/* bubble คำอวยพร */}
        <div className="flex justify-center mb-2">
          <div className="max-w-[200px] bg-white/90 text-gray-800 text-xs sm:text-sm px-3 py-2 rounded-xl shadow-lg border border-white/60 backdrop-blur-sm">
            {kratong.wishText || "สุขสันต์วันลอยกระทง 🌕"}
          </div>
        </div>

        {/* ตัวกระทง + ชื่อ */}
        <div className="flex flex-col items-center">
          <img
            src={kratong.shapeImg}
            alt="kratong"
            className="w-40 h-auto drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]"
          />
          <div className="text-white text-xs sm:text-sm font-semibold mt-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {kratong.ownerName || "ไม่ระบุชื่อ"}
          </div>
        </div>
      </div>
    </div>
  );
}
