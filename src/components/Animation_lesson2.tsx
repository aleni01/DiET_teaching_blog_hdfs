import React, { useState, useEffect, useMemo } from 'react';
import { Controls } from './Controls_lesson2';
import { FilePanel } from './FilePanel';
import type { FileData, RackData, DataNodeData } from '../types';
import { BLOCK_SIZES, FILE_SIZE_STEPS, FILE_HUES, DATANODE_CAPACITY } from '../constants';
import { generateBlocksForFile, distributeBlocks, calculateMetadataSize, computeNumberOfBlocksForFile } from '../utils/hdfsLogic';


export default function App() {
  const [numFiles, setNumFiles] = useState(1);
  const [blockSizeIdx, setBlockSizeIdx] = useState(2); // Default 128MB
  const [files, setFiles] = useState<FileData[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const blockSizeBytes = BLOCK_SIZES[blockSizeIdx].value;

  // Initialize or update files when numFiles or blockSize changes
  useEffect(() => {
    console.log("init files");
    setFiles(prev => {
      const newFiles = [...prev];
      
      // Add files if needed
      if (newFiles.length < numFiles) {
        for (let i = newFiles.length; i < numFiles; i++) {
          const id = `file-${Date.now()}-${i}`;
          const sizeBytes = FILE_SIZE_STEPS[0].value; // Default 1GB
          const hue = FILE_HUES[i % FILE_HUES.length];
          newFiles.push({
            id,
            name: `File ${i + 1}`,
            sizeBytes,
            colorHue: hue,
            blocks:[],
            numBlocks:0,
            replicationFactor: 3,
            clientNodeId: 'dn-1',
          });
        }
      } 
      // Remove files if needed
      else if (newFiles.length > numFiles) {
        newFiles.splice(numFiles);
      }

      // Re-generate blocks for all files if block size changed
      return newFiles.map((f, idx) => ({
        ...f,
        blocks: generateBlocksForFile(f.id, f.sizeBytes, blockSizeBytes, idx),
        numBlocks: computeNumberOfBlocksForFile(f.sizeBytes, blockSizeBytes),
      }));
    });
  }, [numFiles, blockSizeBytes]);

  // Update DataNode distribution whenever files change

  const updateFileProperty = (fileId: string, property: keyof FileData, value: any) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const updatedFile = { ...f, [property]: value };
        if (property === 'sizeBytes') {
          const fileIdx = prev.findIndex(pf => pf.id === fileId);
          updatedFile.blocks = generateBlocksForFile(f.id, value, blockSizeBytes, fileIdx);
          updatedFile.numBlocks = computeNumberOfBlocksForFile(value, blockSizeBytes);
        }
        return updatedFile;
      }
      return f;
    }));
  };

  const resetSimulation = () => {
    setNumFiles(1);
    setBlockSizeIdx(2);
    setFiles([]);
    // setRacks(INITIAL_RACKS);
  };

  const totalBlocks = useMemo(() => files.reduce((acc, f) => acc + f.numBlocks, 0), [files]);
  const metadataSize = useMemo(() => calculateMetadataSize(totalBlocks), [totalBlocks]);

  return (
    <div className="rounded-xl bg-[oklch(0.8335_0.026_84.59)] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white flex flex-col">

      <main className="p-8 max-w-[1800px] mx-auto flex-grow flex flex-col gap-8 w-full">
        {/* Bottom Section: Controls */}
        

        {/* Top Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">

        <div className="lg:col-span-5">
          <Controls 
            numFiles={numFiles}
            setNumFiles={setNumFiles}
            blockSizeIdx={blockSizeIdx}
            setBlockSizeIdx={setBlockSizeIdx}
            files={files}
            updateFileProperty={updateFileProperty}
            onReset={resetSimulation}
          />
        </div>


        
          {/* Right Column: Files & Blocks */}
          <div className="lg:col-span-7">
            <FilePanel files={files} lessonNumber={2} />
          </div>
        </div>



        
      </main>
    </div>
  );
}
