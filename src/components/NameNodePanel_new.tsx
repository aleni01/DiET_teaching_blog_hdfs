import React, { useState } from "react";
import type { FileData } from "../types";
import { formatBytes } from "../utils/hdfsLogic";
import {
  Database,
  Folder,
  FileText,
  Activity,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  HardDrive,
  Layers,
  BoomBox,
  Blocks,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NameNodePanelProps {
  files: FileData[];
  metadataSize: number;
}

const FILE_METADATA_TEMPLATE: Record<
  string,
  { owner: string; permissions: string }
> = {
  f1: { owner: "Alice", permissions: "rw-r--r--" },
  f2: { owner: "Alice", permissions: "rw-------" },
  f3: { owner: "System", permissions: "r--r--r--" },
  f4: { owner: "Bob", permissions: "rw-rw-r--" },
};

export const NameNodePanel: React.FC<NameNodePanelProps> = ({
  files,
  metadataSize,
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    metadata: false,
    namespace: false,
    mapping: false,
  });

  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFile = (fileId: string) => {
    setExpandedFiles((prev) => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  const toggleBlocks = (fileId: string) => {
    setExpandedBlocks((prev) => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          NameNode
        </h2>
        <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
          <Database size={18} className="text-zinc-400" />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {/* 2. Namespace Tree */}
        <div className="border border-zinc-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("namespace")}
            className="w-full flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Folder size={18} className="text-zinc-400" />
              <span className="text-[15px] font-bold uppercase tracking-widest text-zinc-600">
                Namespace Tree
              </span>
            </div>
            {expandedSections.namespace ? (
              <ChevronDown size={16} className="text-zinc-400" />
            ) : (
              <ChevronRight size={16} className="text-zinc-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.namespace && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="p-4 font-mono text-[11px] space-y-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Folder size={18} />
                    <span>/</span>
                  </div>
                  <div className="pl-4 border-l border-zinc-100 ml-1.5 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Folder size={16} />
                      <span className="text-[18px]">user</span>
                    </div>
                    <div className="pl-4 border-l border-zinc-100 ml-1.5 space-y-2">
                      {files.map((file, idx) => (
                        <div key={file.id} className="space-y-1">
                          <div className="flex items-center gap-2 text-zinc-500">
                            <Folder size={13} />
                            <span className="text-[15px]">
                              client_{idx + 1}
                            </span>
                          </div>
                          <div className="pl-4 border-l border-zinc-100 ml-1.5">
                            <div className="flex items-center gap-2 text-zinc-900 font-bold">
                              <FileText size={13} className="text-zinc-300" />
                              <span className="text-[13px]">
                                file_{idx + 1}.csv
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 1. File Metadata */}
        <div className="border border-zinc-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("metadata")}
            className="w-full flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-zinc-400" />
              <span className="text-[15px] font-bold uppercase tracking-widest text-zinc-600">
                File Metadata
              </span>
            </div>
            {expandedSections.metadata ? (
              <ChevronDown size={16} className="text-zinc-400" />
            ) : (
              <ChevronRight size={16} className="text-zinc-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.metadata && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="p-3 space-y-2">
                  {files.map((file, idx) => {
                    const fKey = `f${idx + 1}`;
                    const meta = FILE_METADATA_TEMPLATE[fKey] || {
                      owner: "unknown",
                      permissions: "---",
                    };
                    const isExpanded = expandedFiles[file.id];
                    const isBlocksExpanded = expandedBlocks[file.id];

                    return (
                      <div
                        key={file.id}
                        className="border border-zinc-50 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFile(file.id)}
                          className="w-full flex items-center justify-between p-2 hover:bg-zinc-50 transition-colors text-left"
                        >
                          <span className="text-[15px] font-mono font-bold text-zinc-900"
                          style={{ color: `hsl(${file.colorHue}, 70%, 40%)` }}>
                            {fKey}
                          </span>
                          {isExpanded ? (
                            <ChevronDown size={14} className="text-zinc-300" />
                          ) : (
                            <ChevronRight size={14} className="text-zinc-300" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-zinc-50"
                            >
                              <div className="p-3 space-y-2 text-[11px]">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-2 text-zinc-500">
                                    <User size={18} />
                                    <span className="text-[15px]">Client:</span>
                                    <span className="text-[15px] text-zinc-900">
                                      client_{idx + 1}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-zinc-500">
                                    <FileText size={18} />
                                    <span className="text-[15px]">Name:</span>
                                    <span className="text-[15px] text-zinc-900">
                                      file_{idx + 1}.csv
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-zinc-500">
                                    <Shield size={18} />
                                    <span className="text-[15px]">Owner:</span>
                                    <span className="text-[15px] text-zinc-900">
                                      {meta.owner}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-zinc-500">
                                    <Shield size={18} />
                                    <span className="text-[15px]">Perms:</span>
                                    <span className="text-[15px] text-zinc-900">
                                      {meta.permissions}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-zinc-500">
                                    <HardDrive size={18} />
                                    <span className="text-[15px]">Size:</span>
                                    <span className="text-[15px] text-zinc-900 font-mono">
                                      {formatBytes(file.sizeBytes)}
                                    </span>
                                  </div>
                                  {/* <div className="flex items-center gap-2 text-zinc-500"> */}
                                  {/* < size={18} /> */}
                                    {/* <span className="text-[15px]"># Blocks:</span>
                                    <span className="text-[15px] text-zinc-900 font-mono">
                                      {file.blocks.length}
                                    </span>
                                  </div> */}
                                </div>

                                {/* Nested Blocks Toggle */}
                                <div className="mt-2 border-t border-zinc-50 pt-2">
                                  <button
                                    onClick={() => toggleBlocks(file.id)}
                                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                  >
                                    <Layers size={18} />
                                    <span className="text-[15px] font-bold uppercase tracking-tighter">
                                      Blocks • {file.numBlocks}
                                    </span>
                                    {isBlocksExpanded ? (
                                      <ChevronDown size={14} />
                                    ) : (
                                      <ChevronRight size={14} />
                                    )}
                                  </button>

                                  <AnimatePresence>
                                    {isBlocksExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="flex flex-wrap gap-1 mt-2 p-2 bg-zinc-50 rounded-lg">
                                          {file.numBlocks < 500 ? file.blocks.map((block) => (
                                            <div
                                              key={block.id}
                                              className="w-6 h-8 rounded-sm shadow-sm border border-black/5"
                                              style={{
                                                backgroundColor: block.color,
                                              }}
                                              title={`Block ${block.index}`}
                                            />
                                          )) : (
                                            <p>Too many blocks to show</p>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Block Mapping */}
        <div className="border border-zinc-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("mapping")}
            className="w-full flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-zinc-400" />
              <span className="text-[15px] font-bold uppercase tracking-widest text-zinc-600">
                Block Mapping
              </span>
            </div>
            {expandedSections.mapping ? (
              <ChevronDown size={16} className="text-zinc-400" />
            ) : (
              <ChevronRight size={16} className="text-zinc-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.mapping && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="p-4 space-y-4 font-mono text-[10px]">
                  {files.map((file, idx) => (
                    <div key={file.id} className="text-[15px] space-y-2">
                      <div className="text-zinc-900 font-bold">
                        f{idx + 1}: {"{"}
                      </div>
                      <div className="pl-4 space-y-1">
                        {file.blocks.map((block) => (
                          <div
                            key={block.id}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-4 h-6 rounded-sm border border-black/5"
                              style={{ backgroundColor: block.color }}
                            />
                            <span className="text-zinc-400">→</span>
                            <span className="text-zinc-600">
                              {block.replicas
                                .map((r) => `DN${r.dataNodeId.split("-")[1]}`)
                                .join(", ")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-zinc-900 font-bold">{"}"}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata Stats */}
        <div className="pt-4 border-t border-zinc-100 space-y-4">
          <h3 className="text-[15px] font-bold uppercase tracking-widest text-zinc-900">
            Metadata Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <p className="centered-text text-[15px] font-bold uppercase tracking-wider text-zinc-600">
                Total Blocks
              </p>
              <p className="centered-text text-lg font-bold text-zinc-900">
                {/* {files.reduce((acc, f) => acc + f.blocks.length, 0)} */}
                {files.reduce((acc,f) => acc + f.numBlocks, 0)}
              </p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <p className="centered-text text-[15px] font-bold uppercase tracking-wider text-zinc-600">
                RAM Usage
              </p>
              <p className="centered-text text-lg font-bold text-zinc-900">
                {formatBytes(metadataSize)}
              </p>
            </div>
          </div>
        </div>

        {/* Educational Insight
        <div className="bg-zinc-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Educational Insight
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            The NameNode keeps the entire namespace in RAM. Each block replica
            adds metadata overhead. Notice how increasing replication factor or
            decreasing block size directly impacts RAM usage.
          </p>
        </div> */}
      </div>
    </div>
  );
};
