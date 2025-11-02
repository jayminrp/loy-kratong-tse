import React, { useState } from "react";
import { KRATONG_SHAPES } from "../data/kratongShapes";

export default function CreateKratongModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [selectedShape, setSelectedShape] = useState(null);
  const [wishText, setWishText] = useState("");
  const [ownerName, setOwnerName] = useState("");

  if (!isOpen) return null;

  function handleNext() {
    if (step === 1 && selectedShape) {
      setStep(2);
    }
  }

  function handleSubmit() {
    const newKratong = {
      id: Date.now().toString(),
      shapeImg: selectedShape.img,
      wishText,
      ownerName,
      createdAt: Date.now(), // timestamp ms
    };


    onCreate(newKratong);

    // reset state ของ modal เอง
    setStep(1);
    setSelectedShape(null);
    setWishText("");
    setOwnerName("");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay ดำโปร่งคลิกปิด */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* กล่อง modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        {/* header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {step === 1 ? "เลือกกระทง | Choose your kratong" : "ใส่คำอวยพร 🎑 | Write your wish"}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 1
                ? "เลือกแบบกระทงที่คุณอยากลอย | Choose your kratong style"
                : "เขียนคำอวยพรและชื่อของคุณ | Write your wish and name"}
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* STEP 1: เลือกกระทง */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {KRATONG_SHAPES.map((shape) => (
              <button
                key={shape.id}
                className={`border rounded-xl p-2 flex flex-col items-center gap-2 hover:bg-gray-50 ${
                  selectedShape?.id === shape.id
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedShape(shape)}
              >
                <img
                  src={shape.img}
                  alt={shape.name}
                  className="w-24 h-auto"
                />
                <span className="text-xs font-medium text-gray-700">
                  {shape.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: กรอกข้อมูล */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                คำอวยพร
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                maxLength={120}
                placeholder="ขอให้มีความสุข สมหวัง ปลอดภัย 🌕 | Write your own wish"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
              />
              <div className="text-right text-[10px] text-gray-400">
                {wishText.length}/120
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ชื่อที่จะแสดงใต้กระทง | Name to display under kratong
              </label>
              <input
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                maxLength={20}
                placeholder=" ชื่อใต้กระทง | input name here"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* footer ปุ่มควบคุม */}
        <div className="flex justify-end gap-2 pt-2">
          {step === 1 && (
            <button
              className={`px-4 py-2 rounded-xl text-white text-sm font-semibold ${
                selectedShape
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!selectedShape}
              onClick={handleNext}
            >
              ถัดไป | Next
            </button>
          )}

          {step === 2 && (
            <>
              <button
                className="px-4 py-2 rounded-xl text-gray-600 text-sm font-medium bg-gray-100 hover:bg-gray-200"
                onClick={() => setStep(1)}
              >
                ย้อนกลับ | Back
              </button>
              <button
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold ${
                  wishText && ownerName
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!wishText || !ownerName}
                onClick={handleSubmit}
              >
                ลอยกระทง 🎉 | Loy Kratong
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
