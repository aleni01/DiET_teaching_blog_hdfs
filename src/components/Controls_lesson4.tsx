import React, { useEffect, useMemo, useState } from "react";
import { BLOCK_SIZES, FILE_SIZE_STEPS, FILE_SIZE_STEPS_SMALL } from "../constants";
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

  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    const totalNumBlocks = files.reduce((acc, file) => acc + file.numBlocks*file.replicationFactor, 0);

    setShowWarning(totalNumBlocks>1000);
  }, [files]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 space-y-6">

          <h3 className="text-[15px] font-bold uppercase tracking-widest text-zinc-900">
            Global Controls
          </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Global Controls */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Number of Files
              </h2>
              <input
                type="range"
                min="1"
                max="2"
                step="1"
                value={numFiles}
                onChange={(e) => setNumFiles(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
              />
              <div className="flex justify-between mt-2 text-[15px] text-zinc-400 font-mono uppercase tracking-wider">
                {Array.from({ length: 2 }).map((s, i) => (
                  <span
                    key={i}
                    className={
                      i + 1 === numFiles ? "text-zinc-900 font-bold" : ""
                    }
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

        

            {/* {showWarning && (
              <div>
              <p>Your selected configuration needs more space than its currently available! Please adjust xy </p>
            </div>)} */}
          </div>
        </div>

        <div>
        
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Block Size
              </h2>
              <input
                type="range"
                min="2"
                max={BLOCK_SIZES.length - 1}
                step="1"
                value={blockSizeIdx}
                onChange={(e) => setBlockSizeIdx(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
              />
              <div className="flex justify-between mt-2 text-[15px] text-zinc-400 font-mono uppercase tracking-wider">
                {BLOCK_SIZES.slice(2,5).map((s, i) => (
                  <span
                    key={i}
                    className={
                      i === blockSizeIdx-2 ? "text-zinc-900 font-bold" : ""
                    }
                  >
                    {s.label}
                  </span>
                ))}
                
              </div>
            </div>


        {/* Column 2: File 1*/}
        <div>
          {/* <h3 className="text-[15px] font-bold uppercase tracking-widest text-zinc-900">
            File 1
          </h3> */}
          <div className="space-y-8">
            {files.slice(0, 1).map((file, idx) => (
              <FileControl
                key={file.id}
                file={file}
                idx={idx}
                updateFileProperty={updateFileProperty}
              />
            ))}
          </div>
       
        </div>

        {/* Column 3: File 2 */}
        <div>
          <div className="space-y-8">
            {files.slice(1, 2).map((file, idx) => (
              <FileControl
                key={file.id}
                file={file}
                idx={idx+1}
                updateFileProperty={updateFileProperty}
              />
            ))}
          </div>
          {files.length < 2 && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl p-8">
                <p className="text-xs text-zinc-400 italic">
                  Add more files to see controls
                </p>
              </div>
            )}
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
  const currentStepIdx = FILE_SIZE_STEPS_SMALL.findIndex(
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
        <div className="text-[13pt] font-bold flex items-center gap-2"> {file.numBlocks} Blocks</div>
        {/* <span className="text-[10px] font-mono text-zinc-500">{formatBytes(file.sizeBytes)}</span> */}
      </div>

      <div className="">
        <span className="text-[17px] font-bold text-zinc-900 py-0.5 rounded-full">
          File size: {formatBytes(file.sizeBytes)}
        </span>
        {/* Slider wrapper so ticks can align */}
        <div className="relative mt-4">
          {/* Slider */}
          <input
            type="range"
            min="0"
            max={FILE_SIZE_STEPS_SMALL.length - 1} // 10 steps
            step="1"
            value={currentStepIdx}
            // onChange={(e) => setBlockSizeIdx(parseInt(e.target.value))}
            onChange={(e) =>
              updateFileProperty(
                file.id,
                "sizeBytes",
                FILE_SIZE_STEPS_SMALL[parseInt(e.target.value)].value
              )
            }
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
            style={{ accentColor: `hsl(${file.colorHue}, 70%, 50%)` }}
          />

          {/* Ticks */}
          <div className="relative mt-3 h-6">
            {/* All 10 tick positions */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {Array.from({ length: FILE_SIZE_STEPS_SMALL.length }).map((_, i) => {
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
                    {isMainTick && FILE_SIZE_STEPS_SMALL[i] && (
                      <span
                        className={`text-[15px] font-mono uppercase mt-1 ${
                          currentStepIdx === i
                            ? "text-zinc-900 font-bold"
                            : "text-zinc-400"
                        }`}
                      >
                        {FILE_SIZE_STEPS_SMALL[i].label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Replication Factor */}
      <div className="space-y-1">
        {/* <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Replication Factor: {file.replicationFactor}</p> */}
        <span className="text-[17px] font-bold text-zinc-900 py-0.5 rounded-full">
          Replication Factor
        </span>

        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={file.replicationFactor}
          onChange={(e) =>
            updateFileProperty(
              file.id,
              "replicationFactor",
              parseInt(e.target.value)
            )
          }
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
          style={{ accentColor: `hsl(${file.colorHue}, 70%, 50%)` }}
        />
        <div className="flex justify-between mt-2 text-[15px] text-zinc-400 font-mono uppercase tracking-wider">
          {Array.from({ length: 4 }).map((s, i) => (
            <span
              key={i}
              className={
                i + 1 === file.replicationFactor
                  ? "text-zinc-900 font-bold"
                  : ""
              }
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Client Connection */}
      <div className="space-y-1">
        {/* <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Client Connection: DN{file.clientNodeId.split('-')[1]}</p> */}
        <span className="text-[17px] font-bold text-zinc-900 py-0.5 rounded-full">
          Client Connection: DN{file.clientNodeId.split("-")[1]}
        </span>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          // value={parseInt(file.clientNodeId.split('-')[1])}
          value={Number(file.clientNodeId.split("-")[1])}
          onChange={(e) =>
            updateFileProperty(file.id, "clientNodeId", `dn-${e.target.value}`)
          }
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#7c0044]"
          style={{ accentColor: `hsl(${file.colorHue}, 70%, 50%)` }}
        />
        <div className="flex justify-between mt-2 text-[15px] text-zinc-400 font-mono uppercase tracking-wider">
          {Array.from({ length: 10 }).map((s, i) => (
            <span
              key={i}
              className={
                i + 1 === Number(file.clientNodeId.split("-")[1])
                  ? "text-zinc-900 font-bold"
                  : ""
              }
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
