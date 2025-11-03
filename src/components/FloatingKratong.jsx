import React, { useEffect, useRef, useState } from "react";

export default function FloatingKratong({ kratong, index, baseY }) {
  // ขนาดฉากอิงที่ 1920px กว้าง (พอประมาณเมื่อ responsive)
  const SCENE_WIDTH = 1920;
  const START_LEFT = -200; // เริ่มนอกซ้ายเล็กน้อย
  const END_RIGHT = SCENE_WIDTH + 280; // เลยขวาเล็กน้อย (รวมเงา)
  const SPEED_PX_PER_SEC = 60; // ความเร็วคงที่ เพื่อไม่ให้ชนกันขณะ X ทับ

  // หน่วงการโคลงขึ้นลง
  const floatDelaySec = (index % 7) * 0.5;

  const [x, setX] = useState(() => START_LEFT - (index % 10) * 60);
  const offsetAccRef = useRef(0);
  const lastTsRef = useRef(0);

  useEffect(() => {
    let rafId;
    const loop = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dtSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      setX((prev) => {
        const next = prev + SPEED_PX_PER_SEC * dtSec;
        if (next > END_RIGHT) {
          // วนกลับพร้อมสุ่มบวกแกน X (+20 แบบสุ่มเพื่อไม่ซ้ำ)
          const add = 20 + Math.floor(Math.random() * 40); // 20..60
          offsetAccRef.current = (offsetAccRef.current + add) % 320; // จำกัดช่วงสะสม
          return START_LEFT - offsetAccRef.current;
        }
        return next;
      });

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: `${baseY}px`,
        left: 0,
        transform: `translateX(${x}px)`,
        willChange: "transform",
      }}
    >
      {/* ชั้นใน = โยกขึ้นลง */}
      <div
        style={{
          animationName: "bobbing",
          animationDuration: "2s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: `${floatDelaySec}s`,
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
