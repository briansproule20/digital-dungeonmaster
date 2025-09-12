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
  system_prompt?: string;
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
        onClick={() => {
          fitView({ padding: 0.3 });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
  messages: { sender: 'user' | 'hero'; text: string; id: string }[];
  isDragging: boolean;
  isResizing: boolean;
  size: { width: number; height: number };
  isLocked: boolean;
  isTyping: boolean;
  streamingContent: string;
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
          { sender: 'hero', text: `Greetings! I'm ${hero.name}. How can I assist you on this mission?`, id: Date.now().toString() }
        ],
        isDragging: false,
        isResizing: false,
        size: { width: 300, height: 400 },
        isLocked: false,
        isTyping: false,
        streamingContent: ''
      };
      setChatBoxes(prev => [...prev, newChatBox]);
    }
  };

  const closeChatBox = (heroId: string) => {
    setChatBoxes(prev => prev.filter(box => box.hero.id !== heroId));
  };

  const sendMessage = async (heroId: string, message: string) => {
    if (!message.trim()) return;
    
    const userMessage = { 
      sender: 'user' as const, 
      text: message, 
      id: Date.now().toString() 
    };
    
    // Add user message and start typing
    setChatBoxes(prev => prev.map(box => 
      box.hero.id === heroId 
        ? {
            ...box,
            messages: [...box.messages, userMessage],
            isTyping: true,
            streamingContent: ''
          }
        : box
    ));

    try {
      const hero = chatBoxes.find(box => box.hero.id === heroId)?.hero;
      const chatHistory = chatBoxes.find(box => box.hero.id === heroId)?.messages || [];
      
      // Convert chat history to API format
      const messages = chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })).concat([{ role: 'user', content: message }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          heroSystemPrompt: hero?.system_prompt || `You are ${hero?.name}, a ${hero?.race || ''} ${hero?.class || 'adventurer'} on a dangerous space mission. You are brave, helpful, and ready for adventure. Respond in character with personality and emotion. Keep responses concise but engaging.`
        })
      });

      if (response.ok) {
        const data = await response.text();
        
        // Stop typing and start streaming effect
        setChatBoxes(prev => prev.map(box => 
          box.hero.id === heroId 
            ? { ...box, isTyping: false, streamingContent: '' }
            : box
        ));
        
        // Add empty assistant message
        const assistantMessage = {
          sender: 'hero' as const,
          text: '',
          id: (Date.now() + 1).toString()
        };
        
        setChatBoxes(prev => prev.map(box => 
          box.hero.id === heroId 
            ? { ...box, messages: [...box.messages, assistantMessage] }
            : box
        ));
        
        // Simulate streaming by showing words gradually
        const words = data.split(' ');
        let displayedContent = '';
        
        for (let i = 0; i < words.length; i++) {
          displayedContent += (i > 0 ? ' ' : '') + words[i];
          
          setChatBoxes(prev => prev.map(box => 
            box.hero.id === heroId 
              ? {
                  ...box,
                  streamingContent: displayedContent,
                  messages: box.messages.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, text: displayedContent }
                      : msg
                  )
                }
              : box
          ));
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Clear streaming content
        setChatBoxes(prev => prev.map(box => 
          box.hero.id === heroId 
            ? { ...box, streamingContent: '' }
            : box
        ));
      } else {
        throw new Error(`API call failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatBoxes(prev => prev.map(box => 
        box.hero.id === heroId 
          ? {
              ...box,
              isTyping: false,
              streamingContent: '',
              messages: [...box.messages, {
                sender: 'hero' as const,
                text: 'Sorry, I seem to be having trouble responding right now.',
                id: (Date.now() + 1).toString()
              }]
            }
          : box
      ));
    }
  };

  const startDragging = (heroId: string, event: React.MouseEvent) => {
    const chatBox = chatBoxes.find(box => box.hero.id === heroId);
    if (chatBox && !chatBox.isLocked) {
      setDragOffset({
        x: event.clientX - chatBox.position.x,
        y: event.clientY - chatBox.position.y
      });
      setChatBoxes(prev => prev.map(box =>
        box.hero.id === heroId ? { ...box, isDragging: true } : box
      ));
    }
  };

  const toggleLock = (heroId: string) => {
    setChatBoxes(prev => prev.map(box =>
      box.hero.id === heroId ? { ...box, isLocked: !box.isLocked } : box
    ));
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const draggingBox = chatBoxes.find(box => box.isDragging);
    const resizingBox = chatBoxes.find(box => box.isResizing);
    
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
    
    if (resizingBox) {
      setChatBoxes(prev => prev.map(box =>
        box.isResizing
          ? {
              ...box,
              size: {
                width: Math.max(200, event.clientX - dragOffset.x),
                height: Math.max(200, event.clientY - dragOffset.y)
              }
            }
          : box
      ));
    }
  };

  const stopDragging = () => {
    setChatBoxes(prev => prev.map(box => ({ ...box, isDragging: false, isResizing: false })));
  };

  const startResizing = (heroId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const chatBox = chatBoxes.find(box => box.hero.id === heroId);
    if (chatBox) {
      setDragOffset({
        x: event.clientX - chatBox.size.width,
        y: event.clientY - chatBox.size.height
      });
      setChatBoxes(prev => prev.map(box =>
        box.hero.id === heroId ? { ...box, isResizing: true } : box
      ));
    }
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
    <>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
      <div 
        style={{ width: '100vw', height: '100vh', position: 'relative', pointerEvents: 'none' }}
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        style={{ pointerEvents: 'auto' }}
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
          onStartResize={(event) => startResizing(chatBox.hero.id, event)}
          onToggleLock={() => toggleLock(chatBox.hero.id)}
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
            zIndex: 100,
            pointerEvents: 'auto'
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
    </>
  );
}

function ChatBoxComponent({ 
  chatBox, 
  onClose, 
  onSendMessage, 
  onStartDrag,
  onStartResize,
  onToggleLock
}: {
  chatBox: ChatBox;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onStartDrag: (event: React.MouseEvent) => void;
  onStartResize: (event: React.MouseEvent) => void;
  onToggleLock: () => void;
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

  const isSmall = chatBox.size.width < 250 || chatBox.size.height < 250;
  const isTiny = chatBox.size.width < 200 || chatBox.size.height < 200;
  const scaleFactor = isTiny ? 0.7 : isSmall ? 0.85 : 1;
  
  const dynamicStyles = {
    fontSize: `${13 * scaleFactor}px`,
    padding: `${12 * scaleFactor}px`,
    headerPadding: `${12 * scaleFactor}px ${16 * scaleFactor}px`,
    avatarSize: `${24 * scaleFactor}px`,
    inputPadding: `${6 * scaleFactor}px ${10 * scaleFactor}px`,
    buttonPadding: `${6 * scaleFactor}px ${12 * scaleFactor}px`,
    resizeHandle: `${16 * scaleFactor}px`
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: chatBox.position.x,
        top: chatBox.position.y,
        width: chatBox.size.width,
        height: chatBox.size.height,
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        zIndex: 50,
        cursor: chatBox.isDragging ? 'grabbing' : 'default',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        opacity: chatBox.isLocked ? 0.9 : 1
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: dynamicStyles.headerPadding,
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: chatBox.isLocked ? 'default' : 'grab',
          backgroundColor: chatBox.isLocked ? '#fef3c7' : '#f9fafb',
          borderRadius: '12px 12px 0 0'
        }}
        onMouseDown={chatBox.isLocked ? undefined : onStartDrag}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * scaleFactor}px` }}>
          {chatBox.hero.avatar_url && (
            <img
              src={chatBox.hero.avatar_url}
              alt={chatBox.hero.name}
              style={{
                width: dynamicStyles.avatarSize,
                height: dynamicStyles.avatarSize,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <span style={{ fontWeight: '600', fontSize: dynamicStyles.fontSize, color: '#111827' }}>
            {chatBox.hero.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * scaleFactor}px` }}>
          <button
            onClick={onToggleLock}
            style={{
              background: 'none',
              border: 'none',
              fontSize: `${14 * scaleFactor}px`,
              color: chatBox.isLocked ? '#f59e0b' : '#9ca3af',
              cursor: 'pointer',
              padding: '0',
              width: `${20 * scaleFactor}px`,
              height: `${20 * scaleFactor}px`
            }}
            title={chatBox.isLocked ? 'Unlock' : 'Lock position'}
          >
            {chatBox.isLocked ? '🔒' : '🔓'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: `${16 * scaleFactor}px`,
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0',
              width: `${20 * scaleFactor}px`,
              height: `${20 * scaleFactor}px`
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: dynamicStyles.padding
      }}>
        {chatBox.messages.map((message, index) => (
          <div
            key={message.id || index}
            style={{
              marginBottom: `${8 * scaleFactor}px`,
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: `${8 * scaleFactor}px ${12 * scaleFactor}px`,
                borderRadius: `${12 * scaleFactor}px`,
                fontSize: dynamicStyles.fontSize,
                backgroundColor: message.sender === 'user' ? '#e5e7eb' : '#f3f4f6',
                color: message.sender === 'user' ? '#374151' : '#374151'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {chatBox.isTyping && (
          <div style={{
            marginBottom: `${8 * scaleFactor}px`,
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: `${8 * scaleFactor}px ${12 * scaleFactor}px`,
              borderRadius: `${12 * scaleFactor}px`,
              fontSize: dynamicStyles.fontSize,
              backgroundColor: '#f3f4f6',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: `${4 * scaleFactor}px`
            }}>
              <div style={{ display: 'flex', gap: `${2 * scaleFactor}px` }}>
                <div style={{
                  width: `${4 * scaleFactor}px`,
                  height: `${4 * scaleFactor}px`,
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'blink 1.4s infinite'
                }} />
                <div style={{
                  width: `${4 * scaleFactor}px`,
                  height: `${4 * scaleFactor}px`,
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'blink 1.4s infinite',
                  animationDelay: '0.2s'
                }} />
                <div style={{
                  width: `${4 * scaleFactor}px`,
                  height: `${4 * scaleFactor}px`,
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'blink 1.4s infinite',
                  animationDelay: '0.4s'
                }} />
              </div>
              <span style={{ fontSize: `${11 * scaleFactor}px`, color: '#6b7280' }}>
                {chatBox.hero.name} is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ padding: dynamicStyles.padding, borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${4 * scaleFactor}px` }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Talk to ${chatBox.hero.name}...`}
            style={{
              width: '100%',
              minHeight: `${30 * scaleFactor}px`,
              maxHeight: `${60 * scaleFactor}px`,
              padding: dynamicStyles.inputPadding,
              border: '1px solid #d1d5db',
              borderRadius: `${6 * scaleFactor}px`,
              fontSize: dynamicStyles.fontSize,
              outline: 'none',
              color: '#374151',
              resize: 'none',
              fontFamily: 'inherit'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              padding: dynamicStyles.buttonPadding,
              backgroundColor: inputValue.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: `${6 * scaleFactor}px`,
              fontSize: dynamicStyles.fontSize,
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              alignSelf: 'flex-end',
              minWidth: `${50 * scaleFactor}px`
            }}
          >
            {isTiny ? '→' : 'Send'}
          </button>
        </div>
      </form>

      {/* Resize Handle */}
      {!chatBox.isLocked && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartResize(e);
          }}
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: dynamicStyles.resizeHandle,
            height: dynamicStyles.resizeHandle,
            cursor: 'se-resize',
            background: 'linear-gradient(-45deg, transparent 30%, #d1d5db 30%, #d1d5db 50%, transparent 50%)',
            borderBottomRightRadius: '12px'
          }}
        />
      )}
    </div>
  );
}