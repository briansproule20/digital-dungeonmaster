'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, NodeChange, EdgeChange, Connection, Node, Edge, useReactFlow, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Hero {
  id: string;
  name: string;
  class?: string;
  race?: string;
  level?: number;
  avatar_url?: string;
}
 
const initialNodes: Node[] = [
  { 
    id: 'node1', 
    position: { x: 400, y: 50 }, 
    data: { label: 'Mission Briefing' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node2', 
    position: { x: 200, y: 200 }, 
    data: { label: 'Medical Bay' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node3', 
    position: { x: 600, y: 200 }, 
    data: { label: 'Armory' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node4', 
    position: { x: 400, y: 350 }, 
    data: { label: "Captain's Quarters" },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold' },
    draggable: false
  },
  { 
    id: 'node5', 
    position: { x: 400, y: 500 }, 
    data: { label: 'Boss Battle' },
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

function DiceRoller() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      setDiceValue(roll);
      setIsRolling(false);
    }, 300);
  };

  return (
    <div 
      onClick={rollDice}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '56px',
        height: '56px',
        background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
        border: '2px solid #888',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
        transform: isRolling ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.3s ease-in-out',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}
    >
      {isRolling ? '...' : (diceValue || 'D20')}
    </div>
  );
}

function PartyAvatars() {
  const [userParty, setUserParty] = useState<Hero[]>([]);

  useEffect(() => {
    const savedParty = localStorage.getItem('myParty');
    if (savedParty) {
      try {
        const party = JSON.parse(savedParty);
        setUserParty(party);
      } catch (error) {
        console.error('Failed to parse saved party:', error);
      }
    }
  }, []);

  if (userParty.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      display: 'flex',
      gap: '8px',
      zIndex: 1000
    }}>
      {userParty.map((hero, index) => (
        <div
          key={hero.id}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backgroundColor: '#f3f4f6',
            marginLeft: index > 0 ? '-8px' : '0',
            position: 'relative',
            zIndex: userParty.length - index
          }}
        >
          {hero.avatar_url ? (
            <img
              src={hero.avatar_url}
              alt={hero.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#6b7280'
            }}>
              {hero.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
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
        <DiceRoller />
        <PartyAvatars />
      </ReactFlow>
    </div>
  );
}