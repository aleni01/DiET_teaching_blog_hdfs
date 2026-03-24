import React from "react";
import { BLOCK_SIZES, FILE_SIZE_STEPS } from "../constants";
import { formatBytes } from "../utils/hdfsLogic";
import type { FileData } from "../types";

interface ControlsProps {
  numFiles: number;
  setNumFiles: (n: number) => void;
  blockSizeIdx: number;
  setBlockSizeIdx: (i: number) => void;
  files: FileData[];
  updateFileProperty: (
    fileId: string,
    property: keyof FileData,
    value: any
  ) => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  numFiles = 4,
  setNumFiles,
  blockSizeIdx,
  setBlockSizeIdx,
  files,
  updateFileProperty,
  onReset,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 space-y-6">
      {/* Column 1: Global Controls */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            {/* <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2"> */}
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Block Size
            </h2>

            <input
              type="range"
              min="0"
              max={BLOCK_SIZES.length - 1}
              step="1"
              value={blockSizeIdx}
              onChange={(e) => setBlockSizeIdx(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
            />
            <div className="flex justify-between mt-2 text-[15px] text-zinc-400 font-mono uppercase ">
              {BLOCK_SIZES.map((s, i) => (
                <span
                  key={i}
                  className={
                    i === blockSizeIdx ? "text-zinc-900 font-bold" : ""
                  }
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Files 1 & 2 */}
        <div className="space-y-6">
          <div className="space-y-8">
            {files.slice(0, 2).map((file, idx) => (
              <FileControl
                key={file.id}
                file={file}
                idx={idx}
                updateFileProperty={updateFileProperty}
              />
            ))}
          </div>
        </div>

        {/* Column 3: Files 3 & 4 */}
        <div className="space-y-6">
          <div className="space-y-8">
            {files.slice(2, 4).map((file, idx) => (
              <FileControl
                key={file.id}
                file={file}
                idx={idx + 2}
                updateFileProperty={updateFileProperty}
              />
            ))}
            {files.length < 3 && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl p-8">
                <p className="text-xs text-zinc-300 italic">
                  Add more files to see controls
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FileControlProps {
  file: FileData;
  idx: number;
  updateFileProperty: (
    fileId: string,
    property: keyof FileData,
    value: any
  ) => void;
}

const FileControl: React.FC<FileControlProps> = ({
  file,
  idx,
  updateFileProperty,
}) => {
  const currentStepIdx = FILE_SIZE_STEPS.findIndex(
    (s) => s.value === file.sizeBytes
  );

  return (
    <div className="space-y-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
      <div className="flex justify-between items-center">
        <label
          className="text-[15pt] font-bold flex items-center gap-2"
          style={{ color: `hsl(${file.colorHue}, 70%, 40%)` }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: `hsl(${file.colorHue}, 70%, 50%)` }}
          />
          File {idx + 1}
        </label>

        <span className="text-[15px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">
          File size: {formatBytes(file.sizeBytes)}
        </span>
      </div>

      <div className="">
        {/* Slider wrapper so ticks can align */}
        <div className="relative mt-4">
          {/* Slider */}
          <input
            type="range"
            min="0"
            max={FILE_SIZE_STEPS.length - 1} // 10 steps
            step="1"
            value={currentStepIdx}
            onChange={(e) =>
              updateFileProperty(
                file.id,
                "sizeBytes",
                FILE_SIZE_STEPS[parseInt(e.target.value)].value
              )
            }
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
          />

          {/* Ticks */}
          <div className="relative mt-3 h-6">
            {/* All 10 tick positions */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {Array.from({ length: FILE_SIZE_STEPS.length }).map((_, i) => {
                const isMainTick = i % 2 === 0; // 5 labeled ticks

                return (
                  <div key={i} className="flex flex-col items-center">
                    {/* Tick mark */}
                    <div
                      className={
                        isMainTick
                          ? "w-[2px] h-4 bg-zinc-700"
                          : "w-[1px] h-2 bg-zinc-400 mt-[6px]"
                      }
                    />

                    {/* Labels only for main ticks */}
                    {isMainTick && FILE_SIZE_STEPS[i] && (
                      <span
                        className={`text-[15px] font-mono uppercase mt-1 ${
                          currentStepIdx === i
                            ? "text-zinc-900 font-bold"
                            : "text-zinc-400"
                        }`}
                      >
                        {FILE_SIZE_STEPS[i].label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
