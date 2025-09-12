'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
    id: 'instruction-text', 
    position: { x: 400, y: -100 }, 
    data: { label: 'Click Mission Briefing to begin' },
    style: { color: '#9ca3af', fontSize: '14px', fontWeight: '500', backgroundColor: 'transparent', border: 'none' },
    draggable: false,
    selectable: false
  },
  { 
    id: 'node1', 
    position: { x: 400, y: 50 }, 
    data: { label: 'Mission Briefing' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    draggable: false
  },
  { 
    id: 'node2', 
    position: { x: 200, y: 200 }, 
    data: { label: 'Medical Bay' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    draggable: false
  },
  { 
    id: 'node3', 
    position: { x: 600, y: 200 }, 
    data: { label: 'Armory' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    draggable: false
  },
  { 
    id: 'node4', 
    position: { x: 400, y: 350 }, 
    data: { label: "Captain's Quarters" },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    draggable: false
  },
  { 
    id: 'node5', 
    position: { x: 400, y: 500 }, 
    data: { label: 'Boss Battle' },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    draggable: false
  },
];

const initialEdges: Edge[] = [
  { id: 'instruction-line', source: 'instruction-text', target: 'node1' },
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

function DiceRoller({ missionBriefingOpen, onDiceRoll }: { 
  missionBriefingOpen: boolean; 
  onDiceRoll: (roll: number) => void; 
}) {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      setDiceValue(roll);
      setIsRolling(false);
      
      // If mission briefing is open, pass the roll to it
      if (missionBriefingOpen) {
        onDiceRoll(roll);
      }
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
        zIndex: 1001,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
        transform: isRolling ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.3s ease-in-out',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        pointerEvents: 'auto'
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
  currentSpeakerIndex?: number;
  partyMembers?: Hero[];
  inputValue: string;
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

  const [missionBriefingOpen, setMissionBriefingOpen] = useState(false);
  const [briefingParty, setBriefingParty] = useState<Hero[]>([]);
  const [briefingMessages, setBriefingMessages] = useState<{sender: 'user' | 'hero'; text: string; id: string; speaker?: string}[]>([]);
  const [briefingTyping, setBriefingTyping] = useState(false);
  const [briefingInput, setBriefingInput] = useState('');
  const briefingMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when briefing messages change or when typing
  useEffect(() => {
    briefingMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [briefingMessages, briefingTyping]);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.id === 'node1') { // Mission Briefing
      // Get user's party from localStorage
      const savedParty = localStorage.getItem('myParty');
      if (savedParty) {
        try {
          const party = JSON.parse(savedParty);
          setBriefingParty(party);
          setBriefingMessages([
            {
              sender: 'hero',
              text: `*Mission Control crackles to life*\n\nWelcome aboard, team. You've been assembled for an urgent mission. A research vessel has gone silent in deep space, and you're our only hope of discovering what happened.\n\nYour crew consists of: ${party.map(h => `**${h.name}** (${h.race} ${h.class})`).join(', ')}.\n\nThe vessel was last seen near the Kepler Station. Communication was lost 72 hours ago. Your mission: board the vessel, investigate, and report back.`,
              id: Date.now().toString(),
              speaker: 'Mission Control'
            }
          ]);
          setMissionBriefingOpen(true);
          return;
        } catch (error) {
          console.error('Failed to parse saved party:', error);
        }
      }
      // Fallback to regular modal if no party
      setSelectedNode(node);
    } else {
      setSelectedNode(node);
    }
  };

  const handleHeroResponse = async (hero: Hero) => {
    if (briefingTyping) return;
    
    setBriefingTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: briefingMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.speaker ? `${msg.speaker}: ${msg.text}` : msg.text
          })),
          heroSystemPrompt: hero.system_prompt || `You are ${hero.name}, a ${hero.race} ${hero.class}. You're listening to a mission briefing about investigating a mysterious silent research vessel. Respond in character with your thoughts, concerns, or questions about the mission. Keep it engaging but concise (2-3 sentences max).`
        })
      });

      if (response.ok) {
        const data = await response.text();
        
        // Stop typing and add empty message for streaming
        setBriefingTyping(false);
        const newMessage = {
          sender: 'hero' as const,
          text: '',
          id: Date.now().toString(),
          speaker: hero.name
        };
        setBriefingMessages(prev => [...prev, newMessage]);
        
        // Stream the response word by word
        const words = data.split(' ');
        let displayedContent = '';
        
        for (let i = 0; i < words.length; i++) {
          displayedContent += (i > 0 ? ' ' : '') + words[i];
          
          setBriefingMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, text: displayedContent }
              : msg
          ));
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } else {
        throw new Error(`API call failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Hero response error:', error);
      const errorMessage = {
        sender: 'hero' as const,
        text: 'I seem to be having trouble responding right now.',
        id: (Date.now()).toString(),
        speaker: hero.name
      };
      setBriefingMessages(prev => [...prev, errorMessage]);
    } finally {
      setBriefingTyping(false);
    }
  };

  const handleUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefingInput.trim() || briefingTyping) return;
    
    const userMessage = {
      sender: 'user' as const,
      text: briefingInput.trim(),
      id: Date.now().toString()
    };
    
    setBriefingMessages(prev => [...prev, userMessage]);
    setBriefingInput('');
  };

  const openGroupChat = (heroes: Hero[]) => {
    // Create all speakers (Mission Control + party members)
    const allSpeakers = [
      { 
        id: 'mission-control', 
        name: 'Mission Control', 
        avatar_url: '', 
        system_prompt: `You are Mission Control leading a briefing for a space crew. The team consists of: ${heroes.map(h => `${h.name} (${h.race} ${h.class})`).join(', ')}. Provide engaging mission briefing about the mysterious starship situation. Keep it dramatic and immersive.` 
      } as Hero,
      ...heroes
    ];

    const groupChatBox: ChatBox = {
      id: 'group-chat',
      hero: allSpeakers[0], // Start with Mission Control
      position: { x: 100, y: 100 },
      messages: [
        { 
          sender: 'hero', 
          text: `*Mission Control crackles to life*\n\n**Mission Control:** Welcome aboard, team. You've been assembled for an urgent mission. A research vessel has gone silent, and you're our only hope of discovering what happened. Your crew consists of: ${heroes.map(h => `**${h.name}** (${h.race} ${h.class})`).join(', ')}.\n\nWhat are your questions before we begin?`, 
          id: Date.now().toString() 
        }
      ],
      isDragging: false,
      isResizing: false,
      size: { width: 400, height: 500 },
      isLocked: false,
      isTyping: false,
      streamingContent: '',
      currentSpeakerIndex: 0,
      partyMembers: allSpeakers,
      inputValue: ''
    };
    setChatBoxes(prev => [...prev.filter(box => box.id !== 'group-chat'), groupChatBox]);
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
        streamingContent: '',
        inputValue: ''
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
      const chatBox = chatBoxes.find(box => box.hero.id === heroId);
      const hero = chatBox?.hero;
      const chatHistory = chatBox?.messages || [];
      
      // Special handling for group chat - turn-based
      if (heroId === 'group-chat') {
        const currentSpeakerIndex = chatBox?.currentSpeakerIndex || 0;
        const partyMembers = chatBox?.partyMembers || [];
        
        // Get next speaker (cycle through all speakers)
        const nextSpeakerIndex = (currentSpeakerIndex + 1) % partyMembers.length;
        const currentSpeaker = partyMembers[nextSpeakerIndex];
        
        if (!currentSpeaker) {
          throw new Error('No current speaker found');
        }

        // Generate response for current speaker
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: chatHistory.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })).concat([{ role: 'user', content: message }]),
            heroSystemPrompt: currentSpeaker.system_prompt || `You are ${currentSpeaker.name}. ${currentSpeaker.id === 'mission-control' ? 'You are Mission Control leading this briefing.' : `You are a ${currentSpeaker.race} ${currentSpeaker.class} on this mission.`} Respond in character. Keep responses engaging but concise.`
          })
        });

        if (response.ok) {
          const data = await response.text();
          
          // Stop typing
          setChatBoxes(prev => prev.map(box => 
            box.hero.id === heroId 
              ? { ...box, isTyping: false, streamingContent: '' }
              : box
          ));
          
          // Add response with speaker name
          const speakerMessage = {
            sender: 'hero' as const,
            text: `**${currentSpeaker.name}:** ${data}`,
            id: (Date.now() + 1).toString()
          };
          
          // Update chat with new message and next speaker
          setChatBoxes(prev => prev.map(box => 
            box.hero.id === heroId 
              ? { 
                  ...box, 
                  messages: [...box.messages, speakerMessage],
                  currentSpeakerIndex: nextSpeakerIndex,
                  hero: currentSpeaker // Update current speaker for display
                }
              : box
          ));
        } else {
          throw new Error(`API call failed: ${response.status}`);
        }
      } else {
        // Regular single hero chat
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

  const handleDiceRoll = (roll: number) => {
    // Add the dice roll only to the mission briefing input if it's open
    if (missionBriefingOpen) {
      setBriefingInput(prev => prev ? `${prev} [${roll}]` : `[${roll}]`);
    }
  };

  const updateChatBoxInput = (heroId: string, value: string) => {
    setChatBoxes(prev => prev.map(box => 
      box.hero.id === heroId ? { ...box, inputValue: value } : box
    ));
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
        onNodeClick={onNodeClick}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        style={{ pointerEvents: 'auto' }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#94a3b8" />
        <CustomControls />
        <PartyAvatars onAvatarClick={onAvatarClick} />
      </ReactFlow>

      <DiceRoller missionBriefingOpen={missionBriefingOpen} onDiceRoll={handleDiceRoll} />

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
          onInputChange={(value) => updateChatBoxInput(chatBox.hero.id, value)}
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

      {/* Mission Briefing Modal */}
      {missionBriefingOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 200,
          pointerEvents: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header with Party Avatars */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 8px 0'
                }}>
                  Mission Briefing
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Your Team:
                  </span>
                  {briefingParty.map(hero => (
                    <button
                      key={hero.id}
                      onClick={() => handleHeroResponse(hero)}
                      disabled={briefingTyping}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: briefingTyping ? '#f3f4f6' : '#ffffff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: briefingTyping ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}
                      onMouseOver={(e) => {
                        if (!briefingTyping) {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!briefingTyping) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      {hero.avatar_url && (
                        <img
                          src={hero.avatar_url}
                          alt={hero.name}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      {hero.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setMissionBriefingOpen(false)}
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
            
            {/* Messages Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: '#ffffff'
            }}>
              {briefingMessages.map(message => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    backgroundColor: message.sender === 'user' ? '#3b82f6' : '#f8fafc',
                    color: message.sender === 'user' ? '#ffffff' : '#374151',
                    border: message.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                  }}>
                    {message.speaker && message.sender !== 'user' && (
                      <div style={{
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}>
                        {message.speaker}
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              {briefingTyping && (
                <div style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'flex-start'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'blink 1.4s infinite'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'blink 1.4s infinite',
                        animationDelay: '0.2s'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'blink 1.4s infinite',
                        animationDelay: '0.4s'
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={briefingMessagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <form onSubmit={handleUserMessage} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={briefingInput}
                  onChange={(e) => setBriefingInput(e.target.value)}
                  placeholder="Type your message to the team..."
                  disabled={briefingTyping}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#374151',
                    backgroundColor: briefingTyping ? '#f9fafb' : '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  disabled={!briefingInput.trim() || briefingTyping}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: (!briefingInput.trim() || briefingTyping) ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!briefingInput.trim() || briefingTyping) ? 'not-allowed' : 'pointer',
                    minWidth: '80px'
                  }}
                >
                  Send
                </button>
              </form>
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
  onToggleLock,
  onInputChange
}: {
  chatBox: ChatBox;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onStartDrag: (event: React.MouseEvent) => void;
  onStartResize: (event: React.MouseEvent) => void;
  onToggleLock: () => void;
  onInputChange: (value: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or when typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatBox.messages, chatBox.streamingContent, chatBox.isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(chatBox.inputValue);
    onInputChange('');
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
            value={chatBox.inputValue}
            onChange={(e) => onInputChange(e.target.value)}
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
            disabled={!chatBox.inputValue.trim()}
            style={{
              padding: dynamicStyles.buttonPadding,
              backgroundColor: chatBox.inputValue.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: `${6 * scaleFactor}px`,
              fontSize: dynamicStyles.fontSize,
              cursor: chatBox.inputValue.trim() ? 'pointer' : 'not-allowed',
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