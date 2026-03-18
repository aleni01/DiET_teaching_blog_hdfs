import React from "react";
import { BLOCK_SIZES, FILE_SIZE_STEPS } from "../constants";
import { formatBytes } from "../utils/hdfsLogic";
import type { FileData } from "../types";
import { RotateCcw, Info } from "lucide-react";

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
  numFiles,
  setNumFiles,
  blockSizeIdx,
  setBlockSizeIdx,
  files,
  updateFileProperty,
  onReset,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 space-y-6">
      {/* <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Simulation & Control</h2>
        <button 
          onClick={onReset}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
          title="Reset Simulation"
        >
          <RotateCcw size={20} />
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        {/* Column 2: Files 1 & 2 */}
        <div className="space-y-6">
          {/* <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">File size</h3> */}
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            File Size
          </h2>
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
          {/* </div> */}

          {/* Column 1: Global Controls */}
          {/* <div className="space-y-6"> */}
          {/* <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Global Controls</h3> */}
          <div className="space-y-4">
            {/* <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                Number of Files
                <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{numFiles}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="4" 
                value={numFiles} 
                onChange={(e) => setNumFiles(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
              />
            </div> */}

            <div>
              {/* <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2"> */}
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Block Size
              </h2>
              {/* Block Size
                <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {BLOCK_SIZES[blockSizeIdx].label}
                </span> */}
              {/* </label> */}
              <input
                type="range"
                min="0"
                max={BLOCK_SIZES.length - 1}
                step="1"
                value={blockSizeIdx}
                onChange={(e) => setBlockSizeIdx(parseInt(e.target.value))}
                // className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
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
    <div className="space-y-4 rounded-xl">
      <div className="flex justify-between items-center">
        <label
          className="text-xs font-bold flex items-center gap-2"
          style={{ color: `hsl(${file.colorHue}, 70%, 40%)` }}
        >
          {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${file.colorHue}, 70%, 50%)` }} /> */}
          {/* File {idx + 1} */}
          <span className="text-[15px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">
            {formatBytes(file.sizeBytes)}
          </span>
        </label>
        {/* <span className="text-[10px] font-mono text-zinc-500">{formatBytes(file.sizeBytes)}</span> */}
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
            // onChange={(e) => setBlockSizeIdx(parseInt(e.target.value))}
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
