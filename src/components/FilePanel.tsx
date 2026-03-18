import React from "react";
import type { FileData } from "../types";
import { motion, AnimatePresence } from "motion/react";
// import { motion, AnimatePresence } from "framer-motion";
import { formatBytes } from "../utils/hdfsLogic";

interface FilePanelProps {
  files: FileData[];
  lessonNumber?: number;
}

export const FilePanel: React.FC<FilePanelProps> = ({
  files,
  lessonNumber = 0,
}) => {
  return (
    // davor war noch h-full drin in className von div
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 space-y-6 overflow-y-auto">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">
        Files & Blocks
      </h2>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {files.map((file, idx) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-end">
                <div>
                  {files.length > 1 && (
                    <h3 className="text-[15px] font-bold text-zinc-800">
                      File {idx + 1}
                    </h3>
                  )}
                  {lessonNumber == 0 && (
                    <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                      {formatBytes(file.sizeBytes)} • {file.blocks.length}{" "}
                      Blocks
                    </p>
                  )}
                  {lessonNumber == 2 && (
                    // <p className="text-[15px] text-zinc-400 font-mono uppercase tracking-wider">
                    //   {formatBytes(file.sizeBytes)} • {file.blocks.length}{" "}
                    //   Blocks
                    // </p>
                    <label className="text-xs font-bold flex items-center gap-2" style={{ color: `hsl(${file.colorHue}, 70%, 40%)` }}>
                              {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${file.colorHue}, 70%, 50%)` }} /> */}
                              {/* File {idx + 1} */}
                            <span className="text-[15px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full tracking-wider">{formatBytes(file.sizeBytes)} • {file.blocks.length}{" "}Blocks</span>
                      </label>
                  )}
                  {lessonNumber == 3 && (
                    // <p className="text-[15px] text-zinc-400 font-mono uppercase tracking-wider">
                    //   {formatBytes(file.sizeBytes)} • {file.blocks.length}{" "}
                    //   Blocks
                    // </p>
                    <label className="text-xs font-bold flex items-center gap-2" style={{ color: `hsl(${file.colorHue}, 70%, 40%)` }}>
                              {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${file.colorHue}, 70%, 50%)` }} /> */}
                              {/* File {idx + 1} */}
                            <span className="text-[15px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full tracking-wider">{formatBytes(file.sizeBytes)} • {file.blocks.length}{" "}Blocks</span>
                      </label>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-0.5 p-1 bg-zinc-50 rounded-lg border border-zinc-100 min-h-[40px]">
                {file.blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    layoutId={block.id}
                    className="w-4 h-6 rounded-sm shadow-sm border border-black/5"
                    style={{ backgroundColor: block.color }}
                    title={`Block ${block.index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ))}
                {file.blocks.length === 0 && (
                  <div className="w-full flex items-center justify-center text-[10px] text-zinc-300 italic">
                    No blocks
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
