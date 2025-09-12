'use client';

import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, NodeChange, EdgeChange, Connection, Node, Edge, useReactFlow, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 
const initialNodes: Node[] = [
  { 
    id: 'node1', 
    position: { x: 400, y: 50 }, 
    data: { label: 'Node 1' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node2', 
    position: { x: 200, y: 200 }, 
    data: { label: 'Node 2' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node3', 
    position: { x: 600, y: 200 }, 
    data: { label: 'Node 3' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node4', 
    position: { x: 400, y: 350 }, 
    data: { label: 'Node 4' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node5', 
    position: { x: 400, y: 500 }, 
    data: { label: 'Node 5' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
];

const initialEdges: Edge[] = [
  { id: 'node1-node2', source: 'node1', target: 'node2' },
  { id: 'node1-node3', source: 'node1', target: 'node3' },
  { id: 'node2-node4', source: 'node2', target: 'node4' },
  { id: 'node3-node4', source: 'node3', target: 'node4' },
  { id: 'node4-node5', source: 'node4', target: 'node5' },
];

function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div style={{
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      display: 'flex',
      gap: '4px',
      zIndex: 1000
    }}>
      <button
        onClick={() => zoomIn()}
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '2px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '2px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        −
      </button>
      <button
        onClick={() => fitView()}
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '2px',
          cursor: 'pointer',
          fontSize: '12px',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ⌂
      </button>
    </div>
  );
}
 
export default function ProofOfConcept() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
 
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#94a3b8" />
        <CustomControls />
      </ReactFlow>
    </div>
  );
}