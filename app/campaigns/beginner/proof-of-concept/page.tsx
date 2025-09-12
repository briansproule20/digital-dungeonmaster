'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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

function PartyAvatars({ onAvatarClick }: { onAvatarClick: (hero: Hero) => void }) {
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
          onClick={() => onAvatarClick(hero)}
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
            zIndex: userParty.length - index,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
 
interface ChatBox {
  id: string;
  hero: Hero;
  position: { x: number; y: number };
  messages: { sender: 'user' | 'hero'; text: string }[];
  isDragging: boolean;
}

export default function ProofOfConcept() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [chatBoxes, setChatBoxes] = useState<ChatBox[]>([]);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const nodeInfo: Record<string, { title: string; description: string; content: string }> = {
    'node1': {
      title: 'Mission Briefing',
      description: 'Receive your orders and understand the mission parameters',
      content: 'You awaken aboard a mysterious starship. The AI system briefs you on an urgent mission - the ship\'s captain has gone missing and strange readings are coming from various sections of the vessel.'
    },
    'node2': {
      title: 'Medical Bay',
      description: 'Investigate the ship\'s medical facilities',
      content: 'The medical bay shows signs of recent activity. Medical scanners reveal traces of an unknown substance. You discover healing supplies and clues about what happened to the crew.'
    },
    'node3': {
      title: 'Armory',
      description: 'Explore the weapons and equipment storage',
      content: 'The armory has been partially ransacked. Some weapons are missing, but you find advanced equipment that will aid in your mission. Security logs show unauthorized access.'
    },
    'node4': {
      title: 'Captain\'s Quarters',
      description: 'Search the captain\'s private chambers',
      content: 'The captain\'s quarters hold the key to understanding what happened. Personal logs, encrypted files, and a hidden passage reveal the truth about the ship\'s predicament.'
    },
    'node5': {
      title: 'Boss Battle',
      description: 'Face the ultimate challenge',
      content: 'All paths lead to this final confrontation. Use everything you\'ve learned and collected to overcome the threat that has taken control of the ship.'
    }
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onAvatarClick = (hero: Hero) => {
    const existingChatBox = chatBoxes.find(box => box.hero.id === hero.id);
    if (!existingChatBox) {
      const newChatBox: ChatBox = {
        id: hero.id,
        hero,
        position: { 
          x: 100 + chatBoxes.length * 50, 
          y: 100 + chatBoxes.length * 50 
        },
        messages: [
          { sender: 'hero', text: `Greetings! I'm ${hero.name}. How can I assist you on this mission?` }
        ],
        isDragging: false
      };
      setChatBoxes(prev => [...prev, newChatBox]);
    }
  };

  const closeChatBox = (heroId: string) => {
    setChatBoxes(prev => prev.filter(box => box.hero.id !== heroId));
  };

  const sendMessage = async (heroId: string, message: string) => {
    if (!message.trim()) return;
    
    // Add user message immediately
    setChatBoxes(prev => prev.map(box => 
      box.hero.id === heroId 
        ? {
            ...box,
            messages: [...box.messages, { sender: 'user', text: message }]
          }
        : box
    ));

    // Add typing indicator
    setChatBoxes(prev => prev.map(box => 
      box.hero.id === heroId 
        ? {
            ...box,
            messages: [...box.messages, { sender: 'hero', text: '...' }]
          }
        : box
    ));

    try {
      const hero = chatBoxes.find(box => box.hero.id === heroId)?.hero;
      const chatHistory = chatBoxes.find(box => box.hero.id === heroId)?.messages || [];
      
      // Convert chat history to API format
      const messages = chatHistory
        .filter(msg => msg.text !== '...') // Exclude typing indicator
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
        .concat([{ role: 'user', content: message }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          heroSystemPrompt: hero?.system_prompt || `You are ${hero?.name}, a ${hero?.race || ''} ${hero?.class || 'adventurer'} on a dangerous space mission. You are brave, helpful, and ready for adventure. Respond in character with personality and emotion. Keep responses concise but engaging.`
        })
      });

      const responseText = await response.text();
      
      // Replace typing indicator with actual response
      setChatBoxes(prev => prev.map(box => 
        box.hero.id === heroId 
          ? {
              ...box,
              messages: box.messages.slice(0, -1).concat({ sender: 'hero', text: responseText || 'I apologize, but I cannot respond right now.' })
            }
          : box
      ));
    } catch (error) {
      console.error('Chat error:', error);
      // Replace typing indicator with error message
      setChatBoxes(prev => prev.map(box => 
        box.hero.id === heroId 
          ? {
              ...box,
              messages: box.messages.slice(0, -1).concat({ sender: 'hero', text: 'Sorry, I seem to be having trouble responding right now.' })
            }
          : box
      ));
    }
  };

  const startDragging = (heroId: string, event: React.MouseEvent) => {
    const chatBox = chatBoxes.find(box => box.hero.id === heroId);
    if (chatBox) {
      setDragOffset({
        x: event.clientX - chatBox.position.x,
        y: event.clientY - chatBox.position.y
      });
      setChatBoxes(prev => prev.map(box =>
        box.hero.id === heroId ? { ...box, isDragging: true } : box
      ));
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const draggingBox = chatBoxes.find(box => box.isDragging);
    if (draggingBox) {
      setChatBoxes(prev => prev.map(box =>
        box.isDragging
          ? {
              ...box,
              position: {
                x: event.clientX - dragOffset.x,
                y: event.clientY - dragOffset.y
              }
            }
          : box
      ));
    }
  };

  const stopDragging = () => {
    setChatBoxes(prev => prev.map(box => ({ ...box, isDragging: false })));
  };
 
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
    <div 
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#94a3b8" />
        <CustomControls />
        <DiceRoller />
        <PartyAvatars onAvatarClick={onAvatarClick} />
      </ReactFlow>

      {/* Chat Boxes */}
      {chatBoxes.map((chatBox) => (
        <ChatBoxComponent
          key={chatBox.hero.id}
          chatBox={chatBox}
          onClose={() => closeChatBox(chatBox.hero.id)}
          onSendMessage={(message) => sendMessage(chatBox.hero.id, message)}
          onStartDrag={(event) => startDragging(chatBox.hero.id, event)}
        />
      ))}

      {/* Node Info Modal */}
      {selectedNode && nodeInfo[selectedNode.id] && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setSelectedNode(null)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0
              }}>
                {nodeInfo[selectedNode.id].title}
              </h2>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  color: '#9ca3af',
                  fontSize: '24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <p style={{
                fontSize: '16px',
                color: '#4b5563',
                marginBottom: '16px',
                fontWeight: '500'
              }}>
                {nodeInfo[selectedNode.id].description}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                {nodeInfo[selectedNode.id].content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatBoxComponent({ 
  chatBox, 
  onClose, 
  onSendMessage, 
  onStartDrag 
}: {
  chatBox: ChatBox;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onStartDrag: (event: React.MouseEvent) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatBox.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: chatBox.position.x,
        top: chatBox.position.y,
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        zIndex: 50,
        cursor: chatBox.isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab',
          backgroundColor: '#f9fafb',
          borderRadius: '12px 12px 0 0'
        }}
        onMouseDown={onStartDrag}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {chatBox.hero.avatar_url && (
            <img
              src={chatBox.hero.avatar_url}
              alt={chatBox.hero.name}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <span style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
            {chatBox.hero.name}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '0',
            width: '20px',
            height: '20px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        height: '200px',
        overflowY: 'auto',
        padding: '12px'
      }}>
        {chatBox.messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '8px',
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                backgroundColor: message.sender === 'user' ? '#e5e7eb' : '#f3f4f6',
                color: message.sender === 'user' ? '#374151' : '#374151'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Talk to ${chatBox.hero.name}...`}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
              color: '#374151'
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              padding: '6px 12px',
              backgroundColor: inputValue.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}