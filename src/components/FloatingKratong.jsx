import React, { useEffect, useMemo, useRef, useState } from "react";

export default function FloatingKratong({ kratong, index, baseY }) {
  // ขนาดฉากอิงที่ 1920px กว้าง (พอประมาณเมื่อ responsive)
  const SCENE_WIDTH = 1920;
  const START_LEFT = -200; // เริ่มนอกซ้ายเล็กน้อย
  const END_RIGHT = SCENE_WIDTH + 280; // เลยขวาเล็กน้อย (รวมเงา)
  const SPEED_PX_PER_SEC = 60; // ความเร็วคงที่ เพื่อไม่ให้ชนกันขณะ X ทับ

  // หน่วงการโคลงขึ้นลง
  const floatDelaySec = (index % 7) * 0.5;

  // แฮชแบบกำหนดได้จาก id เพื่อให้สุ่มคงที่ข้ามการรีเฟรช
  const idKey = kratong.id ?? String(index);
  const hash = useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < idKey.length; i++) {
      h ^= idKey.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0;
  }, [idKey]);

  // เว้นระยะเริ่มต้นให้ไม่ติดกันแม้หลังรีเฟรช (คงที่ตาม id)
  const initialSpacing = 160; // px ระยะห่างขั้นต่ำระหว่างกระทงที่เข้าเฟรม
  const hashOffset = (hash % 120); // 0..119 px
  const [x, setX] = useState(() => START_LEFT - index * initialSpacing - hashOffset);
  const offsetAccRef = useRef(0);
  const lastTsRef = useRef(0);
  const startAtMsRef = useRef(0);
  const startedRef = useRef(false);
  const mountTimeRef = useRef(performance.now());

  // หน่วงเวลาการเริ่มเคลื่อนที่ เพื่อไม่ให้เข้าเฟรมพร้อมกัน
  // หน่วงให้ต่างกันชัดเจนและคงที่ทุกครั้งตาม id
  const startDelayMs = useMemo(() => {
    const base = 400; // เริ่มหน่วงพื้นฐาน
    const perIndex = index * 900; // หน่วงตามลำดับมากขึ้น
    const perId = (hash % 1200); // เพิ่มสุ่มคงที่จาก id
    const groupJitter = ((hash >>> 11) % 400); // คงที่จาก id อีกนิด
    return base + perIndex + perId + groupJitter;
  }, [index, hash]);

  useEffect(() => {
    let rafId;
    const loop = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dtSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      // เริ่มนับหน่วงเวลา
      if (!startedRef.current) {
        const elapsedSinceMount = ts - mountTimeRef.current;
        if (elapsedSinceMount >= startDelayMs) {
          startedRef.current = true;
          startAtMsRef.current = ts;
        } else {
          // ยังไม่เริ่ม เคลื่อน x คงที่ (อยู่นอกเฟรมซ้าย)
          setX((prev) => prev);
          rafId = requestAnimationFrame(loop);
          return;
        }
      }

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
