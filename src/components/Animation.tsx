import React, { useState, useEffect, useMemo } from 'react';
import { Controls } from './Controls';
import { FilePanel } from './FilePanel';
import { NameNodePanel } from './NameNodePanel';
import { ClusterPanel } from './ClusterPanel';
import type { FileData, RackData, DataNodeData } from '../types';
import { BLOCK_SIZES, FILE_SIZE_STEPS, FILE_HUES, DATANODE_CAPACITY } from '../constants';
import { generateBlocksForFile, distributeBlocks, calculateMetadataSize } from '../utils/hdfsLogic';

const INITIAL_RACKS: RackData[] = [
  {
    id: 'rack-1',
    dataNodes: [
      { id: 'dn-1', rackId: 'rack-1', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-2', rackId: 'rack-1', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-3', rackId: 'rack-1', blocks: [], capacity: DATANODE_CAPACITY },
    ]
  },
  {
    id: 'rack-2',
    dataNodes: [
      { id: 'dn-4', rackId: 'rack-2', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-5', rackId: 'rack-2', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-6', rackId: 'rack-2', blocks: [], capacity: DATANODE_CAPACITY },
    ]
  },
  {
    id: 'rack-3',
    dataNodes: [
      { id: 'dn-7', rackId: 'rack-3', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-8', rackId: 'rack-3', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-9', rackId: 'rack-3', blocks: [], capacity: DATANODE_CAPACITY },
      { id: 'dn-10', rackId: 'rack-3', blocks: [], capacity: DATANODE_CAPACITY },
    ]
  }
];

export default function App() {
  const [numFiles, setNumFiles] = useState(1);
  const [blockSizeIdx, setBlockSizeIdx] = useState(2); // Default 128MB
  const [files, setFiles] = useState<FileData[]>([]);
  const [racks, setRacks] = useState<RackData[]>(INITIAL_RACKS);
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
            blocks: generateBlocksForFile(id, sizeBytes, blockSizeBytes, i),
            replicationFactor: 3,
            clientNodeId: 'dn-1'
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
        blocks: generateBlocksForFile(f.id, f.sizeBytes, blockSizeBytes, idx)
      }));
    });
  }, [numFiles, blockSizeBytes]);

  // Update DataNode distribution whenever files change
  useEffect(() => {
    setRacks(prevRacks => distributeBlocks(files, prevRacks));
  }, [files]);

  const updateFileProperty = (fileId: string, property: keyof FileData, value: any) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const updatedFile = { ...f, [property]: value };
        if (property === 'sizeBytes') {
          const fileIdx = prev.findIndex(pf => pf.id === fileId);
          updatedFile.blocks = generateBlocksForFile(f.id, value, blockSizeBytes, fileIdx);
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
    setRacks(INITIAL_RACKS);
  };

  const totalBlocks = useMemo(() => files.reduce((acc, f) => acc + f.blocks.length, 0), [files]);
  const metadataSize = useMemo(() => calculateMetadataSize(totalBlocks), [totalBlocks]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white flex flex-col">

      <main className="p-8 max-w-[1800px] mx-auto flex-grow flex flex-col gap-8 w-full">
        {/* Bottom Section: Controls */}
        <div className="w-full">
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

        {/* Top Section: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          {/* Left Column: NameNode */}
          <div className="lg:col-span-3 min-h-[500px]">
            <NameNodePanel 
              files={files} 
              metadataSize={metadataSize} 
            />
          </div>

          {/* Center Column: DataNodes & Racks */}
          <div className="lg:col-span-6 min-h-[500px]">
            <ClusterPanel racks={racks} allBlocks={files.flatMap(f => f.blocks)} files={files} />
          </div>

          {/* Right Column: Files & Blocks */}
          <div className="lg:col-span-3 min-h-[500px]">
            <FilePanel files={files} />
          </div>
        </div>

        
      </main>
    </div>
  );
}
