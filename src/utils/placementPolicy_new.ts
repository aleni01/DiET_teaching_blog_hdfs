import type { RackData, DataNodeData, ReplicaPlacement, FileData, BlockData } from '../types';
import { DATANODE_CAPACITY } from '../constants';

export function getPlacementExplanation(replicaIdx: number): string {
  switch (replicaIdx) {
    case 1: return "Replica 1: Placed on local DataNode (client node) for fast access.";
    case 2: return "Replica 2: Placed on a remote rack for fault tolerance.";
    case 3: return "Replica 3: Placed on the same remote rack as Replica 2, but a different node.";
    case 4: return "Replica 4: Placed to maximize rack diversity and balance load.";
    default: return "";
  }
}

/**
 * Helper to find a DataNode based on a predicate.
 * Only respects capacity and "one replica per node" constraints.
 * Does NOT include a fallback; that is handled in the global fallback phase.
 */
function findNode(
  block: BlockData,
  racks: RackData[],
  predicate: (dn: DataNodeData, rack: RackData) => boolean
): { dn: DataNodeData; rack: RackData } | null {
  const usedNodeIds = new Set(block.replicas.map(p => p.dataNodeId));
  
  for (const rack of racks) {
    for (const dn of rack.dataNodes) {
      if (!usedNodeIds.has(dn.id) && dn.blocks.length < DATANODE_CAPACITY && predicate(dn, rack)) {
        return { dn, rack };
      }
    }
  }
  return null;
}

/**
 * Helper to find any DataNode with capacity not already used by the block.
 */
function findAnyNode(block: BlockData, racks: RackData[]): { dn: DataNodeData; rack: RackData } | null {
  const usedNodeIds = new Set(block.replicas.map(p => p.dataNodeId));
  
  for (const rack of racks) {
    for (const dn of rack.dataNodes) {
      if (!usedNodeIds.has(dn.id) && dn.blocks.length < DATANODE_CAPACITY) {
        return { dn, rack };
      }
    }
  }
  return null;
}

/**
 * Main entry point for distributing replicas across the cluster.
 * Implements a layered, fair placement strategy as required.
 */
export function distributeReplicasFairly(files: FileData[], racks: RackData[]) {
  // 1. Reset state: Clear existing replicas from blocks and DataNodes
  files.forEach(file => {
    file.blocks.forEach(block => {
      block.replicas = [];
    });
  });
  racks.forEach(rack => {
    rack.dataNodes.forEach(dn => {
      dn.blocks = [];
    });
  });

  const maxRF = Math.max(...files.map(f => f.replicationFactor), 0);

  // --- STAGE 1: Standard Placement Rules (Rack-Aware & Layered) ---
  // We iterate by replica level (n) to ensure fairness across all blocks.
  // Rules r1-r4 are applied here.
  for (let n = 1; n <= 4; n++) {
    files.forEach(file => {
      if (file.replicationFactor >= n) {
        file.blocks.forEach(block => {
          // Attempt standard placement for the n-th replica
          const nodeInfo = getStandardNodeForLevel(n, block, file, racks);
          if (nodeInfo) {
            block.replicas.push({ dataNodeId: nodeInfo.dn.id, replicaIndex: n });
            nodeInfo.dn.blocks.push(block.id);
          }
        });
      }
    });
  }

  // --- STAGE 2: Fallback Capacity-Filling Phase (Fair & Layered) ---
  // Executed after all standard rules have been attempted for all blocks.
  // Ensures all remaining storage capacity is used while maintaining fairness.
  for (let n = 3; n <= maxRF; n++) {
    files.forEach(file => {
      if (file.replicationFactor >= n) {
        file.blocks.forEach(block => {
          // If the block is still missing its n-th replica (or any previous ones),
          // try to place it on any available node with space.
          if (block.replicas.length < n) {
            const nodeInfo = findAnyNode(block, racks);
            if (nodeInfo) {
              block.replicas.push({ 
                dataNodeId: nodeInfo.dn.id, 
                replicaIndex: block.replicas.length + 1 
              });
              nodeInfo.dn.blocks.push(block.id);
            }
          }
        });
      }
    });
  }
}

/**
 * Returns a DataNode satisfying the standard HDFS placement rule for a given replica level.
 */
function getStandardNodeForLevel(n: number, block: BlockData, file: FileData, racks: RackData[]) {
  if (n === 1) {
    // Replica 1: Local DataNode (client node)
    return findNode(block, racks, (dn) => dn.id === file.clientNodeId);
  }
  
  if (n === 2) {
    // Replica 2: Remote rack
    const r1 = block.replicas.find(p => p.replicaIndex === 1);
    const r1RackId = r1 ? getRackIdForNode(r1.dataNodeId, racks) : null;
    return findNode(block, racks, (_, rack) => rack.id !== r1RackId);
  }
  
  if (n === 3) {
    // Replica 3: Same remote rack as Replica 2, different node
    const r2 = block.replicas.find(p => p.replicaIndex === 2);
    const r2RackId = r2 ? getRackIdForNode(r2.dataNodeId, racks) : null;
    return findNode(block, racks, (dn, rack) => rack.id === r2RackId && dn.id !== r2?.dataNodeId);
  }
  
  if (n >= 4) {
    // Replica 4+: Maximize rack diversity, max 2 per rack
    return findNode(block, racks, (_, rack) => {
      const replicasInRack = block.replicas.filter(p => 
        isNodeInRack(p.dataNodeId, rack.id, racks)
      ).length;
      return replicasInRack < 2;
    });
  }
  
  return null;
}

function getRackIdForNode(nodeId: string, racks: RackData[]): string | null {
  for (const rack of racks) {
    if (rack.dataNodes.some(dn => dn.id === nodeId)) return rack.id;
  }
  return null;
}

function isNodeInRack(nodeId: string, rackId: string, racks: RackData[]): boolean {
  const rack = racks.find(r => r.id === rackId);
  return !!rack?.dataNodes.some(dn => dn.id === nodeId);
}
