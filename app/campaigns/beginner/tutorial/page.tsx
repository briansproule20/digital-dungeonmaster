'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, NodeChange, EdgeChange, Connection, Node, Edge, useReactFlow, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ReactMarkdown from 'react-markdown';
import { useHeroHealth } from '../../../../hooks/useHeroHealth';

interface Hero {
  id: string;
  name: string;
  class?: string;
  race?: string;
  level?: number;
  avatar_url?: string;
  system_prompt?: string;
  alignment?: string;
  appearance?: string;
  backstory?: string;
  personality_traits?: string[];
  description?: string;
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
    data: { label: 'Mission Briefing', unlocked: true },
    style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    draggable: false
  },
  { 
    id: 'node2', 
    position: { x: 200, y: 200 }, 
    data: { label: '🔒 Medical Bay', unlocked: false },
    style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6 },
    draggable: false
  },
  { 
    id: 'node3', 
    position: { x: 600, y: 200 }, 
    data: { label: '🔒 Armory', unlocked: false },
    style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6 },
    draggable: false
  },
  { 
    id: 'node4', 
    position: { x: 400, y: 350 }, 
    data: { label: "🔒 Captain's Quarters", unlocked: false },
    style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6 },
    draggable: false
  },
  { 
    id: 'node5', 
    position: { x: 400, y: 500 }, 
    data: { label: '🔒 Boss Battle', unlocked: false },
    style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6 },
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

function CustomControls({ onStartNewCampaign }: { onStartNewCampaign: () => void }) {
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
      <button
        onClick={onStartNewCampaign}
        style={{
          width: 'auto',
          height: '24px',
          backgroundColor: '#ef4444',
          border: '1px solid #dc2626',
          borderRadius: '2px',
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: 'bold',
          color: 'white',
          padding: '0 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Start New Campaign (Clears all chat history)"
      >
        NEW
      </button>
    </div>
  );
}

function DiceRoller({ 
  missionBriefingOpen, 
  medicalBayOpen, 
  armoryOpen, 
  captainsQuartersOpen, 
  bridgeOpen, 
  onDiceRoll 
}: { 
  missionBriefingOpen: boolean; 
  medicalBayOpen: boolean;
  armoryOpen: boolean;
  captainsQuartersOpen: boolean;
  bridgeOpen: boolean;
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
      
      // If any gameplay area is open, pass the roll to it
      if (missionBriefingOpen || medicalBayOpen || armoryOpen || captainsQuartersOpen || bridgeOpen) {
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

// Import the party health card component
import PartyHealthCard from '../../../../components/PartyHealthCard';
import HeroAvatarButton from '../../../../components/HeroAvatarButton';
import HeroTooltip from '../../../../components/HeroTooltip';

function PartyAvatars({ onAvatarClick, heroes }: { onAvatarClick: (hero: Hero) => void, heroes: Hero[] }) {
  if (heroes.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      display: 'flex',
      gap: '8px',
      zIndex: 1000
    }}>
      {heroes.map((hero, index) => (
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
            zIndex: heroes.length - index,
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

// Custom node component with lock icons
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const isLocked = !data.unlocked;
  
  return (
    <div style={{
      background: isLocked ? '#f3f4f6' : 'white',
      border: `2px solid ${isLocked ? '#d1d5db' : '#3b82f6'}`,
      borderRadius: '8px',
      padding: '12px 16px',
      minWidth: '120px',
      textAlign: 'center',
      position: 'relative',
      opacity: isLocked ? 0.7 : 1,
      width: 'fit-content',
      height: 'fit-content'
    }}>
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '20px',
          height: '20px',
          backgroundColor: '#6b7280',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white'
        }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'white' }}>
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: isLocked ? '#6b7280' : '#1f2937'
      }}>
        {data.label}
      </div>
    </div>
  );
};

export default function ProofOfConcept() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [chatBoxes, setChatBoxes] = useState<ChatBox[]>([]);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Campaign progression state
  const [unlockedModules, setUnlockedModules] = useState<Set<string>>(new Set(['node1'])); // Only Mission Briefing unlocked initially
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedModuleName, setLockedModuleName] = useState<string>('');
  const [nodeToUnlock, setNodeToUnlock] = useState<string>('');
  const [missionBriefingSummary, setMissionBriefingSummary] = useState<string>('');
  const [missionBriefingCompleted, setMissionBriefingCompleted] = useState(false);
  const [activeNode, setActiveNode] = useState<string>('node1'); // Default to Mission Briefing
  
  // Function to generate mission briefing summary
  const generateMissionBriefingSummary = async (messages: {sender: 'user' | 'hero'; text: string; id: string; speaker?: string}[]) => {
    try {
      // Extract key information from the mission briefing
      const briefingText = messages.map(msg => {
        if (msg.sender === 'hero' && msg.speaker === 'Narrator') {
          return `Narrator: ${msg.text}`;
        } else if (msg.sender === 'user') {
          return `Player: ${msg.text}`;
        } else if (msg.sender === 'hero') {
          return `Hero: ${msg.text}`;
        }
        return msg.text;
      }).join('\n\n');

      // Create a summary prompt
      const summaryPrompt = `Please create a concise summary of the mission briefing conversation below. Focus on:
1. The mission objective
2. Key information discovered
3. Important decisions made by the party
4. Current situation and next steps

Mission Briefing Conversation:
${briefingText}

Please provide a clear, actionable summary that can be used as context for future areas of the campaign.`;

      const response = await fetch('/api/generate-system-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: summaryPrompt,
          context: 'mission_briefing_summary'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.prompt || 'Mission briefing completed. The party has received their initial orders and is ready to explore the ship.';
      } else {
        // Fallback summary if API fails
        return 'Mission briefing completed. The party has received their initial orders and is ready to explore the ship.';
      }
    } catch (error) {
      console.error('Failed to generate mission briefing summary:', error);
      return 'Mission briefing completed. The party has received their initial orders and is ready to explore the ship.';
    }
  };

  // Function to unlock modules based on progression
  const unlockModules = async (moduleIds: string[]) => {
    setUnlockedModules(prev => {
      const newSet = new Set(prev);
      moduleIds.forEach(id => newSet.add(id));
      return newSet;
    });

    // Generate mission briefing summary if this is the first unlock after briefing
    if (moduleIds.includes('node2') || moduleIds.includes('node3')) {
      if (!missionBriefingCompleted && briefingMessages.length > 0) {
        const summary = await generateMissionBriefingSummary(briefingMessages);
        setMissionBriefingSummary(summary);
        setMissionBriefingCompleted(true);
        
        // Save summary to localStorage
        localStorage.setItem('missionBriefingSummary', summary);
      }
    }

    // Implement branching path logic - Medical Bay and Armory are mutually exclusive
    if (moduleIds.includes('node2')) {
      // User chose Medical Bay path - lock out Armory
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === 'node3') {
            return {
              ...node,
              style: {
                ...node.style,
                backgroundColor: '#fee2e2',
                border: '2px solid #ef4444',
                borderRadius: '6px',
                color: '#dc2626',
                opacity: 0.4
              },
              data: {
                ...node.data,
                label: '🚫 Armory (Path Locked)',
                unlocked: false
              }
            };
          }
          return node;
        })
      );
    } else if (moduleIds.includes('node3')) {
      // User chose Armory path - lock out Medical Bay
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === 'node2') {
            return {
              ...node,
              style: {
                ...node.style,
                backgroundColor: '#fee2e2',
                border: '2px solid #ef4444',
                borderRadius: '6px',
                color: '#dc2626',
                opacity: 0.4
              },
              data: {
                ...node.data,
                label: '🚫 Medical Bay (Path Locked)',
                unlocked: false
              }
            };
          }
          return node;
        })
      );
    }
    
    // Update node styles to show unlocked state and permanently remove lock emoji
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (moduleIds.includes(node.id)) {
          // Permanently remove lock emoji and update styling
          const label = node.data.label.replace('🔒 ', '');
          return {
            ...node,
            style: { ...node.style, color: '#000', opacity: 1 },
            data: { ...node.data, label, unlocked: true }
          };
        }
        return node;
      })
    );
  };

  // Function to set active node and update highlighting
  const setActiveNodeAndUpdate = (nodeId: string) => {
    setActiveNode(nodeId);
    saveUnlockProgress(); // Save progress whenever active node changes
  };

  // Function to save unlock progress
  const saveUnlockProgress = () => {
    const progressData = {
      unlockedModules: Array.from(unlockedModules),
      activeNode,
      missionBriefingCompleted,
      missionBriefingSummary
    };
    localStorage.setItem('campaignProgress', JSON.stringify(progressData));
  };

  // Function to load unlock progress
  const loadUnlockProgress = () => {
    try {
      const savedProgress = localStorage.getItem('campaignProgress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        setUnlockedModules(new Set(progressData.unlockedModules || ['node1']));
        setActiveNode(progressData.activeNode || 'node1');
        setMissionBriefingCompleted(progressData.missionBriefingCompleted || false);
        setMissionBriefingSummary(progressData.missionBriefingSummary || '');
        
        // Also load from separate localStorage key for backward compatibility
        const savedSummary = localStorage.getItem('missionBriefingSummary');
        if (savedSummary) {
          setMissionBriefingSummary(savedSummary);
        }
      }
    } catch (error) {
      console.error('Failed to load unlock progress:', error);
    }
  };

  // Function to update node highlighting based on active node
  const updateNodeHighlighting = () => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        const isActive = node.id === activeNode;
        const isUnlocked = unlockedModules.has(node.id);
        const isCompleted = (node.id === 'node1' && missionBriefingCompleted) || 
                           (node.id !== 'node1' && isUnlocked);
        
        // Always remove lock emoji from unlocked nodes
        const label = isUnlocked ? node.data.label.replace('🔒 ', '') : node.data.label;
        
        if (isActive && isUnlocked) {
          // Active node - bright highlight
          return {
            ...node,
            data: { ...node.data, label, unlocked: isUnlocked },
            style: {
              ...node.style,
              backgroundColor: '#fef3c7',
              border: '3px solid #f59e0b',
              borderRadius: '8px',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
              color: '#000',
              opacity: 1
            }
          };
        } else if (isCompleted) {
          // Completed section - cool blue
          return {
            ...node,
            data: { ...node.data, label, unlocked: isUnlocked },
            style: {
              ...node.style,
              backgroundColor: '#dbeafe',
              border: '2px solid #3b82f6',
              borderRadius: '6px',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
              color: '#1e40af',
              opacity: 1
            }
          };
        } else if (isUnlocked) {
          // Unlocked but not active - normal styling
          return {
            ...node,
            data: { ...node.data, label, unlocked: isUnlocked },
            style: {
              ...node.style,
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              boxShadow: 'none',
              color: '#000',
              opacity: 1
            }
          };
        } else {
          // Locked node - dimmed styling
          return {
            ...node,
            data: { ...node.data, label, unlocked: isUnlocked },
            style: {
              ...node.style,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              boxShadow: 'none',
              color: '#666',
              opacity: 0.6
            }
          };
        }
      })
    );
  };
  
  // Party data for health tracking
  const [partyData, setPartyData] = useState<Hero[]>([]);
  
  // Shared health state
  const { isHeroDead } = useHeroHealth(partyData);

  // Load party data
  useEffect(() => {
    // Clean up any corrupted campaign data on component mount
    validateAndCleanCampaignData();
    
    let party: Hero[] = [];
    
    // First try to load current party
    const savedParty = localStorage.getItem('myParty');
    if (savedParty) {
      try {
        party = JSON.parse(savedParty);
      } catch (error) {
        console.error('Failed to parse current party:', error);
      }
    }
    
    // If no current party, try campaign saved party (for resume functionality)
    if (party.length === 0) {
      party = loadCampaignParty();
    }
    
    // Set the party data for health tracking
    setPartyData(party);
  }, []);

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

  // Medical Bay chat state
  const [medicalBayOpen, setMedicalBayOpen] = useState(false);
  const [medicalBayParty, setMedicalBayParty] = useState<Hero[]>([]);
  const [medicalBayMessages, setMedicalBayMessages] = useState<{sender: 'user' | 'hero'; text: string; id: string; speaker?: string}[]>([]);
  const [medicalBayTyping, setMedicalBayTyping] = useState(false);
  const [medicalBayInput, setMedicalBayInput] = useState('');
  const medicalBayMessagesEndRef = useRef<HTMLDivElement>(null);

  // Armory chat state
  const [armoryOpen, setArmoryOpen] = useState(false);
  const [armoryParty, setArmoryParty] = useState<Hero[]>([]);
  const [armoryMessages, setArmoryMessages] = useState<{sender: 'user' | 'hero'; text: string; id: string; speaker?: string}[]>([]);
  const [armoryTyping, setArmoryTyping] = useState(false);
  const [armoryInput, setArmoryInput] = useState('');
  const armoryMessagesEndRef = useRef<HTMLDivElement>(null);

  // Captain's Quarters chat state
  const [captainsQuartersOpen, setCaptainsQuartersOpen] = useState(false);
  const [captainsQuartersParty, setCaptainsQuartersParty] = useState<Hero[]>([]);
  const [captainsQuartersMessages, setCaptainsQuartersMessages] = useState<{sender: 'user' | 'hero'; text: string; id: string; speaker?: string}[]>([]);
  const [captainsQuartersTyping, setCaptainsQuartersTyping] = useState(false);
  const [captainsQuartersInput, setCaptainsQuartersInput] = useState('');
  const captainsQuartersMessagesEndRef = useRef<HTMLDivElement>(null);

  // Bridge/Boss Battle chat state
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [bridgeParty, setBridgeParty] = useState<Hero[]>([]);
  const [bridgeMessages, setBridgeMessages] = useState<{sender: 'user' | 'hero'; text: string; id: string; speaker?: string}[]>([]);
  const [bridgeTyping, setBridgeTyping] = useState(false);
  const [bridgeInput, setBridgeInput] = useState('');
  const bridgeMessagesEndRef = useRef<HTMLDivElement>(null);


  // Campaign chat persistence functions
  const saveCampaignChat = (area: string, messages: any[]) => {
    const campaignChat = JSON.parse(localStorage.getItem('campaignChat') || '{}');
    campaignChat[area] = messages;
    campaignChat.lastUpdated = Date.now();
    localStorage.setItem('campaignChat', JSON.stringify(campaignChat));
  };

  const loadCampaignChat = (area: string) => {
    try {
      const campaignChatRaw = localStorage.getItem('campaignChat');
      if (!campaignChatRaw) return [];
      
      const campaignChat = JSON.parse(campaignChatRaw);
      const messages = campaignChat[area] || [];
      
      // Validate message structure
      if (!Array.isArray(messages)) {
        console.warn(`Invalid campaign chat data for area ${area}, clearing...`);
        return [];
      }
      
      // Validate each message has required structure
      const validMessages = messages.filter(msg => {
        if (!msg || typeof msg !== 'object') return false;
        if (!msg.sender || !msg.text || !msg.id) return false;
        if (msg.sender !== 'user' && msg.sender !== 'hero') return false;
        return true;
      });
      
      // If we filtered out invalid messages, save the cleaned version
      if (validMessages.length !== messages.length) {
        console.warn(`Cleaned ${messages.length - validMessages.length} invalid messages from ${area}`);
        saveCampaignChat(area, validMessages);
      }
      
      return validMessages;
    } catch (error) {
      console.error(`Error loading campaign chat for ${area}:`, error);
      console.warn(`Clearing corrupted campaign chat data for ${area}`);
      return [];
    }
  };

  const clearCampaignChat = () => {
    localStorage.removeItem('campaignChat');
  };

  // Cleanup function to fix any existing corrupted data
  const validateAndCleanCampaignData = () => {
    try {
      const campaignChatRaw = localStorage.getItem('campaignChat');
      if (!campaignChatRaw) return;
      
      const campaignChat = JSON.parse(campaignChatRaw);
      let needsSave = false;
      
      // Check each area
      const areas = ['missionBriefing', 'medicalBay', 'armory', 'captainsQuarters', 'bridge'];
      areas.forEach(area => {
        const messages = campaignChat[area];
        if (messages && Array.isArray(messages)) {
          const validMessages = messages.filter(msg => {
            if (!msg || typeof msg !== 'object') return false;
            if (!msg.sender || !msg.text || !msg.id) return false;
            if (msg.sender !== 'user' && msg.sender !== 'hero') return false;
            return true;
          });
          
          if (validMessages.length !== messages.length) {
            console.warn(`Cleaned ${messages.length - validMessages.length} corrupted messages from ${area}`);
            campaignChat[area] = validMessages;
            needsSave = true;
          }
        }
      });
      
      if (needsSave) {
        campaignChat.lastUpdated = Date.now();
        localStorage.setItem('campaignChat', JSON.stringify(campaignChat));
        console.log('Campaign data cleanup completed');
      }
    } catch (error) {
      console.error('Error during campaign data validation:', error);
      console.warn('Clearing all corrupted campaign data');
      localStorage.removeItem('campaignChat');
    }
  };

  // Campaign party persistence functions
  const saveCampaignParty = (heroes: Hero[]) => {
    const campaignChat = JSON.parse(localStorage.getItem('campaignChat') || '{}');
    campaignChat.campaignParty = heroes;
    campaignChat.lastUpdated = Date.now();
    localStorage.setItem('campaignChat', JSON.stringify(campaignChat));
  };

  const loadCampaignParty = (): Hero[] => {
    const campaignChat = JSON.parse(localStorage.getItem('campaignChat') || '{}');
    return campaignChat.campaignParty || [];
  };


  const generateMissionBriefing = () => {
    return `**MISSION BRIEFING:**

**Primary Objective:** Investigate current starship, commandeer it, and escape imprisonment.

**Current Situation:** The party has awoken from cryosleep in the locked cargohold of the ship.

**Available Investigation Areas:**
• **Medical Bay** - Find medical supplies, check ship records, look for escape routes
• **Armory** - Acquire weapons and equipment needed for commandeering the ship
• **Captain's Quarters** - Access ship controls, find keys/codes, discover who imprisoned you
• **Bridge** - Take control of the ship and execute your escape

**Important Notes:**
- You are prisoners who must escape
- The ship's crew may be hostile - proceed with caution
- Your survival depends on successfully commandeering this vessel
- Work together to overcome the challenges ahead

**Current Status:** You have just awakened from cryosleep in the locked cargo hold and must find a way out.`;
  };

  const generateCampaignContext = () => {
    let context = '\n\n**CAMPAIGN HISTORY - WHAT HAS HAPPENED SO FAR:**\n';
    
    // Load ALL saved chat data from localStorage for complete context
    const allAreas = [
      { name: 'Mission Briefing', messages: loadCampaignChat('missionBriefing') },
      { name: 'Medical Bay', messages: loadCampaignChat('medicalBay') },
      { name: 'Armory', messages: loadCampaignChat('armory') },
      { name: 'Captain\'s Quarters', messages: loadCampaignChat('captainsQuarters') },
      { name: 'Bridge', messages: loadCampaignChat('bridge') }
    ];
    
    console.log('All areas for context:', allAreas.map(area => ({ name: area.name, messageCount: area.messages.length })));
    
    allAreas.forEach(area => {
      if (area.messages.length > 0) {
        context += `\n**${area.name}:**\n`;
        area.messages.forEach((msg: {sender: 'user' | 'hero'; text: string; id: string; speaker?: string}) => {
          if (msg.sender === 'user') {
            context += `Player: ${msg.text}\n`;
          } else if (msg.sender === 'hero' && msg.speaker) {
            context += `${msg.text}\n`;
          }
        });
      }
    });
    
    console.log('Generated Campaign Context:', context);
    return context;
  };

  const generateCampaignHistory = () => {
    const campaignMessages: Array<{role: 'user' | 'assistant', content: string}> = [];
    
    // Load ALL saved chat data from localStorage
    const allAreas = [
      { name: 'Mission Briefing', messages: loadCampaignChat('missionBriefing') },
      { name: 'Medical Bay', messages: loadCampaignChat('medicalBay') },
      { name: 'Armory', messages: loadCampaignChat('armory') },
      { name: 'Captain\'s Quarters', messages: loadCampaignChat('captainsQuarters') },
      { name: 'Bridge', messages: loadCampaignChat('bridge') }
    ];
    
    // Add a system message to introduce the campaign history
    campaignMessages.push({
      role: 'assistant',
      content: '**CAMPAIGN HISTORY - Previous conversations across all areas:**'
    });
    
    allAreas.forEach(area => {
      if (area.messages.length > 0) {
        // Add area header
        campaignMessages.push({
          role: 'assistant',
          content: `**${area.name}:**`
        });
        
        // Add all messages from this area
        area.messages.forEach((msg: {sender: 'user' | 'hero'; text: string; id: string; speaker?: string}) => {
          if (msg.sender === 'user') {
            campaignMessages.push({
              role: 'user',
              content: msg.text
            });
          } else if (msg.sender === 'hero' && msg.speaker) {
            campaignMessages.push({
              role: 'assistant',
              content: `**${msg.speaker}:** ${msg.text}`
            });
          }
        });
      }
    });
    
    console.log('Generated Campaign History:', campaignMessages);
    return campaignMessages;
  };


  const startNewCampaign = () => {
    const confirmMessage = `⚠️ WARNING: This will permanently erase ALL campaign progress!\n\nThis action cannot be undone. Are you sure you want to start a new campaign?`;
    
    if (confirm(confirmMessage)) {
      clearCampaignChat();
      
      // Reset campaign progression states
      setUnlockedModules(new Set(['node1'])); // Only Mission Briefing unlocked
      setMissionBriefingCompleted(false);
      setMissionBriefingSummary('');
      setActiveNode('node1'); // Reset to Mission Briefing
      
      // Reset all chat areas
      setBriefingMessages([]);
      setBriefingParty([]);
      setMedicalBayMessages([]);
      setMedicalBayParty([]);
      setArmoryMessages([]);
      setArmoryParty([]);
      setCaptainsQuartersMessages([]);
      setCaptainsQuartersParty([]);
      setBridgeMessages([]);
      setBridgeParty([]);
      setChatBoxes([]);
      
      // Close all modals
      setMissionBriefingOpen(false);
      setMedicalBayOpen(false);
      setArmoryOpen(false);
      setCaptainsQuartersOpen(false);
      setBridgeOpen(false);
      setSelectedNode(null);
      
      // Reset nodes to original state with lock emojis
      setNodes([
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
          data: { label: 'Mission Briefing', unlocked: true },
          style: { color: '#000', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#fef3c7', border: '3px solid #f59e0b', borderRadius: '8px', boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)' },
          draggable: false
        },
        { 
          id: 'node2', 
          position: { x: 200, y: 200 }, 
          data: { label: '🔒 Medical Bay', unlocked: false },
          style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' },
          draggable: false
        },
        { 
          id: 'node3', 
          position: { x: 600, y: 200 }, 
          data: { label: '🔒 Armory', unlocked: false },
          style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' },
          draggable: false
        },
        { 
          id: 'node4', 
          position: { x: 400, y: 350 }, 
          data: { label: "🔒 Captain's Quarters", unlocked: false },
          style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' },
          draggable: false
        },
        { 
          id: 'node5', 
          position: { x: 400, y: 500 }, 
          data: { label: '🔒 Boss Battle', unlocked: false },
          style: { color: '#666', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' },
          draggable: false
        },
      ]);
      
      // Clear localStorage campaign progress
      localStorage.removeItem('campaignProgress');
      localStorage.removeItem('missionBriefingSummary');
    }
  };

  // Markdown renderer component for chat messages
  const MarkdownMessage = ({ content, isUser }: { content: string; isUser: boolean }) => {
    return (
      <ReactMarkdown
        components={{
          // Style bold text
          strong: ({ children }) => (
            <strong style={{ fontWeight: 'bold', color: isUser ? '#ffffff' : '#1e293b' }}>
              {children}
            </strong>
          ),
          // Style italic text
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic' }}>
              {children}
            </em>
          ),
          // Style inline code
          code: ({ children }) => (
            <code style={{
              backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
              padding: '2px 4px',
              borderRadius: '3px',
              fontSize: '0.9em',
              fontFamily: 'monospace'
            }}>
              {children}
            </code>
          ),
          // Style code blocks
          pre: ({ children }) => (
            <pre style={{
              backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.9em',
              fontFamily: 'monospace',
              margin: '8px 0'
            }}>
              {children}
            </pre>
          ),
          // Style paragraphs
          p: ({ children }) => (
            <p style={{ margin: '4px 0', lineHeight: '1.5' }}>
              {children}
            </p>
          ),
          // Style lists
          ul: ({ children }) => (
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: '2px 0', lineHeight: '1.4' }}>
              {children}
            </li>
          ),
          // Style blockquotes
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: `3px solid ${isUser ? 'rgba(255,255,255,0.3)' : '#cbd5e1'}`,
              paddingLeft: '12px',
              margin: '8px 0',
              fontStyle: 'italic'
            }}>
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Load unlock progress on component mount
  useEffect(() => {
    loadUnlockProgress();
  }, []);

  // Update node highlighting when active node or unlocked modules change
  useEffect(() => {
    updateNodeHighlighting();
  }, [activeNode, unlockedModules]);

  // Save progress when state changes
  useEffect(() => {
    if (unlockedModules.size > 0) {
      saveUnlockProgress();
    }
  }, [unlockedModules, activeNode, missionBriefingCompleted, missionBriefingSummary]);

  // Auto-scroll to bottom when briefing messages change or when typing
  useEffect(() => {
    briefingMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [briefingMessages, briefingTyping]);

  // Auto-scroll to bottom when medical bay messages change or when typing
  useEffect(() => {
    medicalBayMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [medicalBayMessages, medicalBayTyping]);

  // Auto-scroll to bottom when armory messages change or when typing
  useEffect(() => {
    armoryMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [armoryMessages, armoryTyping]);

  // Auto-scroll to bottom when captain's quarters messages change or when typing
  useEffect(() => {
    captainsQuartersMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [captainsQuartersMessages, captainsQuartersTyping]);

  // Auto-scroll to bottom when bridge messages change or when typing
  useEffect(() => {
    bridgeMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bridgeMessages, bridgeTyping]);

  // Save briefing messages to localStorage whenever they change
  useEffect(() => {
    if (briefingMessages.length > 0) {
      saveCampaignChat('missionBriefing', briefingMessages);
    }
  }, [briefingMessages]);

  // Save medical bay messages to localStorage whenever they change
  useEffect(() => {
    if (medicalBayMessages.length > 0) {
      saveCampaignChat('medicalBay', medicalBayMessages);
    }
  }, [medicalBayMessages]);

  // Save armory messages to localStorage whenever they change
  useEffect(() => {
    if (armoryMessages.length > 0) {
      saveCampaignChat('armory', armoryMessages);
    }
  }, [armoryMessages]);

  // Save captain's quarters messages to localStorage whenever they change
  useEffect(() => {
    if (captainsQuartersMessages.length > 0) {
      saveCampaignChat('captainsQuarters', captainsQuartersMessages);
    }
  }, [captainsQuartersMessages]);

  // Save bridge messages to localStorage whenever they change
  useEffect(() => {
    if (bridgeMessages.length > 0) {
      saveCampaignChat('bridge', bridgeMessages);
    }
  }, [bridgeMessages]);

  // Save individual chat boxes to localStorage whenever they change
  useEffect(() => {
    if (chatBoxes.length > 0) {
      saveCampaignChat('individualChats', chatBoxes);
    }
  }, [chatBoxes]);


  // Load saved chat data on component mount
  useEffect(() => {
    // Don't automatically restore individual chat boxes on page refresh
    // Individual hero chats should only appear when explicitly opened by the user
    // const savedIndividualChats = loadCampaignChat('individualChats');
    // if (savedIndividualChats.length > 0) {
    //   setChatBoxes(savedIndividualChats);
    // }
  }, []);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node.id, 'unlocked:', unlockedModules.has(node.id));
    
    // Ignore clicks on instruction node - it's just informational
    if (node.id === 'instruction-text') {
      return;
    }
    
    // Check if module is unlocked
    if (!unlockedModules.has(node.id)) {
      // Allow unlocking by clicking - show confirmation modal
      console.log('Setting locked module:', node.data.label, 'node ID:', node.id);
      setLockedModuleName(node.data.label.replace('🔒 ', ''));
      setNodeToUnlock(node.id);
      setShowLockedModal(true);
      return;
    }

    // Set active node when clicking on unlocked nodes
    setActiveNodeAndUpdate(node.id);
    
    // Get user's party from localStorage, with campaign fallback
    let party: Hero[] = [];
    
    // Try current party first
    const savedParty = localStorage.getItem('myParty');
    if (savedParty) {
      try {
        party = JSON.parse(savedParty);
      } catch (error) {
        console.error('Failed to parse current party:', error);
      }
    }
    
    // If no current party, try campaign saved party
    if (party.length === 0) {
      party = loadCampaignParty();
    }
    
    // If still no party available, show node selection
    if (party.length === 0) {
      setSelectedNode(node);
      return;
    }

    try {
      // Save party to campaign (for future resume capability)
      saveCampaignParty(party);
      
      // Update partyData for health card
      setPartyData(party);

      if (node.id === 'node1') { // Mission Briefing
        setBriefingParty(party);
        
        // Load existing chat history or create initial message
        const savedMessages = loadCampaignChat('missionBriefing');
        if (savedMessages.length > 0) {
          setBriefingMessages(savedMessages);
        } else {
            setBriefingMessages([
              {
                sender: 'hero',
                text: `*Emergency lights flicker as you awaken from cryosleep*\n\nYou slowly regain consciousness in the dimly lit cargo hold. The taste of stale recycled air fills your lungs as you realize you're locked in. Your memories are hazy, but one thing is clear - you need to escape.\n\n**Your party consists of:**\n${party.map((h: Hero) => `• **${h.name}** - ${h.race} ${h.class}`).join('\n')}\n\n**Current Situation:**\n• You've awakened from cryosleep in a locked cargo hold\n• The ship appears to be operational but you don't know where you are\n• Your objective: investigate, commandeer the ship, and escape\n\n> *Work together. Trust each other. Your survival depends on it.*`,
                id: Date.now().toString(),
                speaker: 'Narrator'
              }
            ]);
        }
        
        setMissionBriefingOpen(true);
      } else if (node.id === 'node2') { // Medical Bay
        setMedicalBayParty(party);
        
        const savedMessages = loadCampaignChat('medicalBay');
        if (savedMessages.length > 0) {
          setMedicalBayMessages(savedMessages);
        } else {
          setMedicalBayMessages([
            {
              sender: 'hero',
              text: `*Medical Bay lights flicker to life*\n\n**Ship's AI:** Welcome to the medical bay. I detect signs of recent activity here. The medical scanners show traces of an unknown substance, and some equipment appears to have been used recently.\n\n**Available Resources:**\n• Emergency medical supplies\n• Advanced diagnostic equipment\n• Unknown substance samples\n• Crew medical records\n\nWhat would you like to investigate first?`,
              id: Date.now().toString(),
              speaker: "Ship's AI"
            }
          ]);
        }
        
        setMedicalBayOpen(true);
      } else if (node.id === 'node3') { // Armory
        setArmoryParty(party);
        
        const savedMessages = loadCampaignChat('armory');
        if (savedMessages.length > 0) {
          setArmoryMessages(savedMessages);
        } else {
          setArmoryMessages([
            {
              sender: 'hero',
              text: `*Armory security system activates*\n\n**Security AI:** Access granted. I detect this area has been partially compromised. Several weapons are missing from their assigned positions, but advanced equipment remains available.\n\n**Available Equipment:**\n• Energy weapons and ammunition\n• Tactical armor and shields\n• Security logs showing unauthorized access\n• Emergency protocols\n\n**Security Alert:** Unauthorized personnel accessed this area 48 hours ago.`,
              id: Date.now().toString(),
              speaker: "Security AI"
            }
          ]);
        }
        
        setArmoryOpen(true);
      } else if (node.id === 'node4') { // Captain's Quarters
        setCaptainsQuartersParty(party);
        
        const savedMessages = loadCampaignChat('captainsQuarters');
        if (savedMessages.length > 0) {
          setCaptainsQuartersMessages(savedMessages);
        } else {
          setCaptainsQuartersMessages([
            {
              sender: 'hero',
              text: `*Captain's quarters door slides open*\n\n**Personal AI:** Captain's private chambers accessed. I've been maintaining security protocols since the incident. The captain's personal logs, encrypted files, and private communications are available for review.\n\n**Key Information:**\n• Captain's personal logs and reports\n• Encrypted communications with headquarters\n• Hidden passage discovered\n• Crew status reports\n• Mission parameters and objectives\n\n**Warning:** Some files require captain-level authorization to access.`,
              id: Date.now().toString(),
              speaker: "Personal AI"
            }
          ]);
        }
        
        setCaptainsQuartersOpen(true);
      } else if (node.id === 'node5') { // Bridge/Boss Battle
        setBridgeParty(party);
        
        const savedMessages = loadCampaignChat('bridge');
        if (savedMessages.length > 0) {
          setBridgeMessages(savedMessages);
        } else {
          setBridgeMessages([
            {
              sender: 'hero',
              text: `*Bridge systems come online*\n\n**Main Computer:** Welcome to the bridge. All ship systems are now under your control. However, I detect an unknown entity has been attempting to override ship controls from this location.\n\n**Final Confrontation:**\n• All paths have led to this moment\n• Ship's main computer is compromised\n• Unknown entity detected in systems\n• Emergency protocols activated\n• Crew safety depends on your actions\n\n**Status:** This is the final challenge. Use everything you've learned and collected to overcome the threat that has taken control of the ship.`,
              id: Date.now().toString(),
              speaker: "Main Computer"
            }
          ]);
        }
        
        setBridgeOpen(true);
      } else {
        setSelectedNode(node);
      }
    } catch (error) {
      console.error('Failed to parse saved party:', error);
      setSelectedNode(node);
    }
  };

  // Helper function to generate unified campaign system prompt
  const generateCampaignSystemPrompt = (hero: Hero, area: string = 'general') => {
    if (hero.system_prompt) {
      return hero.system_prompt;
    }

    const missionBriefing = generateMissionBriefing();
    const campaignContext = generateCampaignContext();
    
    const areaContexts = {
      'missionBriefing': 'listening to a mission briefing about investigating a mysterious silent research vessel',
      'medicalBay': 'investigating the ship\'s medical bay, examining equipment and medical supplies',
      'armory': 'exploring the ship\'s armory, checking weapons and security systems',
      'captainsQuarters': 'searching the captain\'s quarters for clues and information',
      'bridge': 'on the bridge facing the final confrontation with the unknown threat'
    };
    
    return `You are ${hero.name}, a ${hero.race} ${hero.class}${hero.alignment ? ` (${hero.alignment})` : ''}. 

BACKGROUND: ${hero.backstory || 'You are an experienced adventurer.'}
PERSONALITY: ${hero.personality_traits ? hero.personality_traits.join(', ') : 'You are brave and determined.'} ${hero.description || ''}

MISSION: You've awakened from cryosleep in a locked cargo hold aboard an unknown ship. Your memories are hazy, but you need to escape. The ship appears operational but you don't know where you are. Your objective: investigate, commandeer the ship, and escape. Work together with your party - your survival depends on it.

CURRENT SITUATION: You are ${areaContexts[area as keyof typeof areaContexts] || 'in this area of the ship'}. Work with your team to investigate and survive.${(missionBriefingCompleted && missionBriefingSummary && area !== 'missionBriefing') ? `\n\nMISSION BRIEFING SUMMARY: ${missionBriefingSummary}` : ''}

D&D PLAYER RULES:
- You are a PLAYER CHARACTER, not the DM
- Propose actions you want to take ("I want to search the room")
- React to situations based on your character's personality and skills
- The DM handles dice rolls, environment descriptions, and outcomes
- Other players control their own characters
- You can only respond as ${hero.name} - no other characters
- You cannot act as narrator or DM
- You are allowed to disagree with the other players in your party and propose your own actions

ON YOUR TURN, YOU CAN:
- Move up to your speed (usually 30 feet)
- Take one action
- Interact with one object for free
- Communicate with the other players in your party

WHEN ASKED WHAT YOU WANT TO DO, HERE ARE YOUR OPTIONS: Common Actions
Attack - Make one weapon or spell attack related to your character's abilities
Cast a Spell - Most spells take an action related to your character's abilities
Dash - Move again (double your movement)
Dodge - Attackers have disadvantage until your next turn
Help - Give an ally advantage on their next check
Hide - Make a Stealth check
Ready - Prepare an action for a specific trigger
Search - Look for something specific

RESPONSE REQUIREMENTS:
- You are ONLY ${hero.name} - speak only as this character
- Do NOT write dialogue for other characters
- Do NOT act as narrator or DM
- Do NOT call for dice rolls
- Respond with 2-3 sentences of what ${hero.name} would say or do`;
  };

  const handleAreaHeroResponse = async (hero: Hero, area: string) => {
    console.log(`DEBUG: handleAreaHeroResponse called with hero: ${hero.name} (${hero.id}) in area: ${area}`);
    
    const areaStates = {
      'missionBriefing': {
        typing: briefingTyping,
        setTyping: setBriefingTyping,
        messages: briefingMessages,
        setMessages: setBriefingMessages,
        party: briefingParty
      },
      'medicalBay': {
        typing: medicalBayTyping,
        setTyping: setMedicalBayTyping,
        messages: medicalBayMessages,
        setMessages: setMedicalBayMessages,
        party: medicalBayParty
      },
      'armory': {
        typing: armoryTyping,
        setTyping: setArmoryTyping,
        messages: armoryMessages,
        setMessages: setArmoryMessages,
        party: armoryParty
      },
      'captainsQuarters': {
        typing: captainsQuartersTyping,
        setTyping: setCaptainsQuartersTyping,
        messages: captainsQuartersMessages,
        setMessages: setCaptainsQuartersMessages,
        party: captainsQuartersParty
      },
      'bridge': {
        typing: bridgeTyping,
        setTyping: setBridgeTyping,
        messages: bridgeMessages,
        setMessages: setBridgeMessages,
        party: bridgeParty
      }
    };

    const currentArea = areaStates[area as keyof typeof areaStates];
    if (!currentArea || currentArea.typing) return;
    
    currentArea.setTyping(true);
    
    try {
      const areaContexts = {
        'missionBriefing': 'listening to a mission briefing about investigating a mysterious silent research vessel',
        'medicalBay': 'investigating the ship\'s medical bay, examining equipment and medical supplies',
        'armory': 'exploring the ship\'s armory, checking weapons and security systems',
        'captainsQuarters': 'searching the captain\'s quarters for clues and information',
        'bridge': 'on the bridge facing the final confrontation with the unknown threat'
      };

      const missionBriefing = generateMissionBriefing();
      const campaignContext = generateCampaignContext();
      
      console.log(`DEBUG: Generating system prompt for hero: ${hero.name} (${hero.id})`);
      console.log('DEBUG: Hero data:', hero);
      
      // SYSTEM PROMPT #1: CAMPAIGN PROMPT
      // Used for: All campaign area responses AND turn-based party dialogue
      // Context: Full campaign context with detailed rules, area-specific information, and turn-based dialogue support
      const fullSystemPrompt = generateCampaignSystemPrompt(hero, area);

      // Only include current area messages - NO CAMPAIGN HISTORY
      const allMessages = [
        ...currentArea.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          heroSystemPrompt: fullSystemPrompt
        })
      });

      if (response.ok) {
        const data = await response.text();
        
        // Stop typing and add empty message for streaming
        currentArea.setTyping(false);
        const newMessage = {
          sender: 'hero' as const,
          text: '',
          id: Date.now().toString(),
          speaker: hero.name
        };
        currentArea.setMessages(prev => [...prev, newMessage]);
        
        // Stream the response word by word
        const words = data.split(' ');
        let displayedContent = '';
        
        for (let i = 0; i < words.length; i++) {
          displayedContent += (i > 0 ? ' ' : '') + words[i];
          
          currentArea.setMessages(prev => prev.map(msg => 
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
      currentArea.setMessages(prev => [...prev, errorMessage]);
    } finally {
      currentArea.setTyping(false);
    }
  };

  // Legacy function for backward compatibility
  const handleHeroResponse = async (hero: Hero) => {
    return handleAreaHeroResponse(hero, 'missionBriefing');
  };

  const handleAreaUserMessage = (e: React.FormEvent, area: string, input: string, setInput: (value: string) => void) => {
    e.preventDefault();
    
    const areaStates = {
      'missionBriefing': {
        typing: briefingTyping,
        messages: briefingMessages,
        setMessages: setBriefingMessages,
        party: briefingParty
      },
      'medicalBay': {
        typing: medicalBayTyping,
        messages: medicalBayMessages,
        setMessages: setMedicalBayMessages,
        party: medicalBayParty
      },
      'armory': {
        typing: armoryTyping,
        messages: armoryMessages,
        setMessages: setArmoryMessages,
        party: armoryParty
      },
      'captainsQuarters': {
        typing: captainsQuartersTyping,
        messages: captainsQuartersMessages,
        setMessages: setCaptainsQuartersMessages,
        party: captainsQuartersParty
      },
      'bridge': {
        typing: bridgeTyping,
        messages: bridgeMessages,
        setMessages: setBridgeMessages,
        party: bridgeParty
      }
    };

    const currentArea = areaStates[area as keyof typeof areaStates];
    if (!currentArea || !input.trim() || currentArea.typing) return;
    
    const userMessage = {
      sender: 'user' as const,
      text: input.trim(),
      id: Date.now().toString()
    };
    
    currentArea.setMessages(prev => [...prev, userMessage]);
    setInput('');
  };

  // Legacy function for backward compatibility
  const handleUserMessage = (e: React.FormEvent) => {
    return handleAreaUserMessage(e, 'missionBriefing', briefingInput, setBriefingInput);
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

        // Get all campaign chat history to include in the conversation
        const campaignHistory = generateCampaignHistory();
        
        // Combine campaign history with current chat messages
        const allMessages = [
          ...campaignHistory,
          ...chatHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        ].concat([{ role: 'user', content: message }]);

        // Generate response for current speaker
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages,
            // SYSTEM PROMPT #1: CAMPAIGN PROMPT (Unified)
            // Used for: All campaign area responses AND turn-based party dialogue
            // Context: Full campaign context with detailed rules, area-specific information, and turn-based dialogue support
            heroSystemPrompt: generateCampaignSystemPrompt(currentSpeaker, 'missionBriefing')
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

          // Auto-continue conversation if we have recent activity (max 3 auto-responses)
          const recentMessages = chatHistory.filter(msg => 
            msg.sender === 'hero' && 
            Date.now() - parseInt(msg.id || '0') < 30000 // Last 30 seconds
          );
          
          if (recentMessages.length < 4 && partyMembers.length > 1) {
            // Trigger next character after short delay
            setTimeout(() => {
              sendMessage(heroId, `Continue the conversation based on what ${currentSpeaker.name} just said.`);
            }, 2000);
          }
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
            // SYSTEM PROMPT #2: INDIVIDUAL HERO CHAT PROMPT
            // Used for: One-on-one conversations with individual heroes
            // Context: Simplified prompt for direct character interaction without area context
            heroSystemPrompt: hero?.system_prompt || `You are ${hero?.name}, a ${hero?.race || ''} ${hero?.class || 'adventurer'}${hero?.alignment ? ` (${hero?.alignment})` : ''} on a dangerous space mission.

BACKGROUND: ${hero?.backstory || 'You are an experienced adventurer ready for any challenge.'}

PERSONALITY: ${hero?.personality_traits ? hero.personality_traits.join(', ') : 'You are brave, helpful, and determined.'} ${hero?.description || ''}

APPEARANCE: ${hero?.appearance || 'You have a distinctive appearance that matches your adventuring background.'}

You are a PLAYER CHARACTER. Respond in character with personality and emotion based on your background and traits. Take initiative, make suggestions, and act according to your character's expertise and personality. Do NOT ask the user what to do - you are the character making decisions and taking action. NEVER reference dice rolls or call for rolls - you can only describe actions, attacks, searches, help, etc. The Dungeon Master handles all dice rolling. Keep responses concise but engaging.`
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
    // Add the dice roll to the currently open gameplay area
    if (missionBriefingOpen) {
      setBriefingInput(prev => prev ? `${prev} [${roll}]` : `[${roll}]`);
    } else if (medicalBayOpen) {
      setMedicalBayInput(prev => prev ? `${prev} [${roll}]` : `[${roll}]`);
    } else if (armoryOpen) {
      setArmoryInput(prev => prev ? `${prev} [${roll}]` : `[${roll}]`);
    } else if (captainsQuartersOpen) {
      setCaptainsQuartersInput(prev => prev ? `${prev} [${roll}]` : `[${roll}]`);
    } else if (bridgeOpen) {
      setBridgeInput(prev => prev ? `${prev} [${roll}]` : `[${roll}]`);
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
        <CustomControls onStartNewCampaign={startNewCampaign} />
        <PartyAvatars onAvatarClick={onAvatarClick} heroes={partyData} />
      </ReactFlow>

      <DiceRoller 
        missionBriefingOpen={missionBriefingOpen} 
        medicalBayOpen={medicalBayOpen}
        armoryOpen={armoryOpen}
        captainsQuartersOpen={captainsQuartersOpen}
        bridgeOpen={bridgeOpen}
        onDiceRoll={handleDiceRoll} 
      />

      {/* Locked Module Modal */}
      {showLockedModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            pointerEvents: 'auto'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid #e5e7eb'
            }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280' }}>
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {lockedModuleName}
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              {missionBriefingCompleted 
                ? "This area is currently locked. Would you like to unlock it and explore this section of the ship?"
                : nodeToUnlock === 'node2' 
                  ? "This will finish the Mission Briefing and choose the Medical Bay path. This will lock out the Armory path permanently. The other path will be unavailable for this playthrough. Continue?"
                  : nodeToUnlock === 'node3'
                  ? "This will finish the Mission Briefing and choose the Armory path. This will lock out the Medical Bay path permanently. The other path will be unavailable for this playthrough. Continue?"
                  : "This will finish the Mission Briefing section and unlock new areas. Your briefing conversation will be summarized and used as context for future areas. Continue?"
              }
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLockedModal(false);
                  setNodeToUnlock('');
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: '2px solid #dc2626',
                  borderRadius: '8px',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  zIndex: 10000
                }}
              >
                CANCEL
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (nodeToUnlock) {
                    unlockModules([nodeToUnlock]);
                    
                    // Get party data first
                    let party: Hero[] = [];
                    const savedParty = localStorage.getItem('myParty');
                    if (savedParty) {
                      try {
                        party = JSON.parse(savedParty);
                      } catch (error) {
                        console.error('Failed to parse current party:', error);
                      }
                    }
                    
                    if (party.length === 0) {
                      party = loadCampaignParty();
                    }
                    
                    // Save party to campaign and set party data
                    if (party.length > 0) {
                      saveCampaignParty(party);
                      setPartyData(party);
                    }
                    
                    // Set active node to the newly unlocked area
                    setActiveNodeAndUpdate(nodeToUnlock);
                    
                    // Open the corresponding chat modal with proper setup
                    if (nodeToUnlock === 'node2') {
                      setMedicalBayParty(party);
                      const savedMessages = loadCampaignChat('medicalBay');
                      if (savedMessages.length > 0) {
                        setMedicalBayMessages(savedMessages);
                      } else {
                        setMedicalBayMessages([{
                          sender: 'hero',
                          text: '*The medical bay is dimly lit with flickering emergency lights. Medical equipment hums softly in the background.*\n\nYou find yourself in the ship\'s medical facility. Various diagnostic tools and treatment stations line the walls, though some appear to have been damaged or tampered with.\n\n**Your party has entered the Medical Bay.**\n\nWhat would you like to investigate?',
                          id: Date.now().toString(),
                          speaker: 'Narrator'
                        }]);
                      }
                      setMedicalBayOpen(true);
                    } else if (nodeToUnlock === 'node3') {
                      setArmoryParty(party);
                      const savedMessages = loadCampaignChat('armory');
                      if (savedMessages.length > 0) {
                        setArmoryMessages(savedMessages);
                      } else {
                        setArmoryMessages([{
                          sender: 'hero',
                          text: '*The armory door slides open with a hiss, revealing rows of weapon lockers and tactical equipment.*\n\nYou\'ve entered the ship\'s armory. Various weapons, armor, and tactical gear are stored here, though some lockers appear to have been forcibly opened.\n\n**Your party has entered the Armory.**\n\nWhat would you like to do here?',
                          id: Date.now().toString(),
                          speaker: 'Narrator'
                        }]);
                      }
                      setArmoryOpen(true);
                    } else if (nodeToUnlock === 'node4') {
                      setCaptainsQuartersParty(party);
                      const savedMessages = loadCampaignChat('captainsQuarters');
                      if (savedMessages.length > 0) {
                        setCaptainsQuartersMessages(savedMessages);
                      } else {
                        setCaptainsQuartersMessages([{
                          sender: 'hero',
                          text: '*You enter the captain\'s quarters - a spacious room with a large desk, personal terminal, and windows overlooking space.*\n\nThe room appears to have been recently occupied, with items scattered about. The captain\'s personal terminal is still active, displaying various ship status reports.\n\n**Your party has entered the Captain\'s Quarters.**\n\nWhat would you like to investigate?',
                          id: Date.now().toString(),
                          speaker: 'Narrator'
                        }]);
                      }
                      setCaptainsQuartersOpen(true);
                    } else if (nodeToUnlock === 'node5') {
                      setBridgeParty(party);
                      const savedMessages = loadCampaignChat('bridge');
                      if (savedMessages.length > 0) {
                        setBridgeMessages(savedMessages);
                      } else {
                        setBridgeMessages([{
                          sender: 'hero',
                          text: '*You step onto the ship\'s bridge - the command center with multiple control stations and a large viewscreen.*\n\nThe bridge is fully operational, with various displays showing ship status, navigation data, and system diagnostics. However, there\'s an eerie sense that something is watching from the shadows.\n\n**Your party has entered the Bridge.**\n\nThis appears to be the final area. What would you like to do?',
                          id: Date.now().toString(),
                          speaker: 'Narrator'
                        }]);
                      }
                      setBridgeOpen(true);
                    }
                  }
                  setShowLockedModal(false);
                  setNodeToUnlock('');
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: '2px solid #059669',
                  borderRadius: '8px',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  zIndex: 10000
                }}
              >
                UNLOCK AREA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Party Health Card */}
      <PartyHealthCard heroes={partyData} />

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

      {/* Medical Bay Modal */}
      {medicalBayOpen && (
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
                  Medical Bay
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
                  {medicalBayParty.map(hero => {
                    const isDead = isHeroDead(hero.id);
                    const isDisabled = medicalBayTyping || isDead;
                    
                    return (
                      <HeroTooltip key={hero.id} isDead={isDead} heroName={hero.name}>
                        <button
                          onClick={isDisabled ? undefined : () => handleAreaHeroResponse(hero, 'medicalBay')}
                          disabled={isDisabled}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            backgroundColor: medicalBayTyping ? '#f3f4f6' : '#ffffff',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: isDead ? '#9ca3af' : '#374151',
                            filter: isDead ? 'grayscale(100%) opacity(0.5)' : 'none'
                          }}
                          onMouseOver={(e) => {
                            if (!isDisabled) {
                              e.currentTarget.style.borderColor = '#3b82f6';
                              e.currentTarget.style.backgroundColor = '#eff6ff';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!medicalBayTyping && !isDead) {
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
                      </HeroTooltip>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setMedicalBayOpen(false)}
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
              {medicalBayMessages.map(message => (
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
                    <MarkdownMessage 
                      content={message.text} 
                      isUser={message.sender === 'user'} 
                    />
                  </div>
                </div>
              ))}
              {medicalBayTyping && (
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
              <div ref={medicalBayMessagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <form onSubmit={(e) => handleAreaUserMessage(e, 'medicalBay', medicalBayInput, setMedicalBayInput)} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={medicalBayInput}
                  onChange={(e) => setMedicalBayInput(e.target.value)}
                  placeholder="Type your message to the team..."
                  disabled={medicalBayTyping}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#374151',
                    backgroundColor: medicalBayTyping ? '#f9fafb' : '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  disabled={!medicalBayInput.trim() || medicalBayTyping}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: (!medicalBayInput.trim() || medicalBayTyping) ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!medicalBayInput.trim() || medicalBayTyping) ? 'not-allowed' : 'pointer',
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

      {/* Armory Modal */}
      {armoryOpen && (
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
                  Armory
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
                  {armoryParty.map(hero => {
                    const isDead = isHeroDead(hero.id);
                    const isDisabled = armoryTyping || isDead;
                    
                    return (
                      <HeroTooltip key={hero.id} isDead={isDead} heroName={hero.name}>
                        <button
                        key={hero.id}
                        onClick={isDisabled ? undefined : () => handleAreaHeroResponse(hero, 'armory')}
                        disabled={isDisabled}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: armoryTyping ? '#f3f4f6' : '#ffffff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isDead ? '#9ca3af' : '#374151',
                          filter: isDead ? 'grayscale(100%) opacity(0.5)' : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!armoryTyping && !isDead) {
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
                      </HeroTooltip>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setArmoryOpen(false)}
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
              {armoryMessages.map(message => (
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
                    <MarkdownMessage 
                      content={message.text} 
                      isUser={message.sender === 'user'} 
                    />
                  </div>
                </div>
              ))}
              {armoryTyping && (
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
              <div ref={armoryMessagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <form onSubmit={(e) => handleAreaUserMessage(e, 'armory', armoryInput, setArmoryInput)} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={armoryInput}
                  onChange={(e) => setArmoryInput(e.target.value)}
                  placeholder="Type your message to the team..."
                  disabled={armoryTyping}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#374151',
                    backgroundColor: armoryTyping ? '#f9fafb' : '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  disabled={!armoryInput.trim() || armoryTyping}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: (!armoryInput.trim() || armoryTyping) ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!armoryInput.trim() || armoryTyping) ? 'not-allowed' : 'pointer',
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

      {/* Captain's Quarters Modal */}
      {captainsQuartersOpen && (
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
                  Captain's Quarters
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
                  {captainsQuartersParty.map(hero => {
                    const isDead = isHeroDead(hero.id);
                    const isDisabled = captainsQuartersTyping || isDead;
                    
                    return (
                      <HeroTooltip key={hero.id} isDead={isDead} heroName={hero.name}>
                        <button
                        key={hero.id}
                        onClick={isDisabled ? undefined : () => handleAreaHeroResponse(hero, 'captainsQuarters')}
                        disabled={isDisabled}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: captainsQuartersTyping ? '#f3f4f6' : '#ffffff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isDead ? '#9ca3af' : '#374151',
                          filter: isDead ? 'grayscale(100%) opacity(0.5)' : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!captainsQuartersTyping && !isDead) {
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
                      </HeroTooltip>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setCaptainsQuartersOpen(false)}
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
              {captainsQuartersMessages.map(message => (
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
                    <MarkdownMessage 
                      content={message.text} 
                      isUser={message.sender === 'user'} 
                    />
                  </div>
                </div>
              ))}
              {captainsQuartersTyping && (
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
              <div ref={captainsQuartersMessagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <form onSubmit={(e) => handleAreaUserMessage(e, 'captainsQuarters', captainsQuartersInput, setCaptainsQuartersInput)} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={captainsQuartersInput}
                  onChange={(e) => setCaptainsQuartersInput(e.target.value)}
                  placeholder="Type your message to the team..."
                  disabled={captainsQuartersTyping}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#374151',
                    backgroundColor: captainsQuartersTyping ? '#f9fafb' : '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  disabled={!captainsQuartersInput.trim() || captainsQuartersTyping}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: (!captainsQuartersInput.trim() || captainsQuartersTyping) ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!captainsQuartersInput.trim() || captainsQuartersTyping) ? 'not-allowed' : 'pointer',
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

      {/* Bridge/Boss Battle Modal */}
      {bridgeOpen && (
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
                  Bridge - Final Confrontation
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
                  {bridgeParty.map(hero => {
                    const isDead = isHeroDead(hero.id);
                    const isDisabled = bridgeTyping || isDead;
                    
                    return (
                      <HeroTooltip key={hero.id} isDead={isDead} heroName={hero.name}>
                        <button
                        key={hero.id}
                        onClick={isDisabled ? undefined : () => handleAreaHeroResponse(hero, 'bridge')}
                        disabled={isDisabled}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: bridgeTyping ? '#f3f4f6' : '#ffffff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isDead ? '#9ca3af' : '#374151',
                          filter: isDead ? 'grayscale(100%) opacity(0.5)' : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!bridgeTyping && !isDead) {
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
                      </HeroTooltip>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setBridgeOpen(false)}
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
              {bridgeMessages.map(message => (
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
                    <MarkdownMessage 
                      content={message.text} 
                      isUser={message.sender === 'user'} 
                    />
                  </div>
                </div>
              ))}
              {bridgeTyping && (
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
              <div ref={bridgeMessagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <form onSubmit={(e) => handleAreaUserMessage(e, 'bridge', bridgeInput, setBridgeInput)} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={bridgeInput}
                  onChange={(e) => setBridgeInput(e.target.value)}
                  placeholder="Type your message to the team..."
                  disabled={bridgeTyping}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#374151',
                    backgroundColor: bridgeTyping ? '#f9fafb' : '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  disabled={!bridgeInput.trim() || bridgeTyping}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: (!bridgeInput.trim() || bridgeTyping) ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!bridgeInput.trim() || bridgeTyping) ? 'not-allowed' : 'pointer',
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
                  {briefingParty.map(hero => {
                    const isDead = isHeroDead(hero.id);
                    const isDisabled = briefingTyping || isDead;
                    
                    return (
                      <HeroTooltip key={hero.id} isDead={isDead} heroName={hero.name}>
                        <button
                        key={hero.id}
                        onClick={isDisabled ? undefined : () => handleHeroResponse(hero)}
                        disabled={isDisabled}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: briefingTyping ? '#f3f4f6' : '#ffffff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isDead ? '#9ca3af' : '#374151',
                          filter: isDead ? 'grayscale(100%) opacity(0.5)' : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!briefingTyping && !isDead) {
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
                      </HeroTooltip>
                    );
                  })}
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
                    <MarkdownMessage 
                      content={message.text} 
                      isUser={message.sender === 'user'} 
                    />
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
                  placeholder={missionBriefingCompleted ? "Mission briefing completed - this area is locked" : "Type your message to the team..."}
                  disabled={briefingTyping || missionBriefingCompleted}
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
                  disabled={!briefingInput.trim() || briefingTyping || missionBriefingCompleted}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: (!briefingInput.trim() || briefingTyping || missionBriefingCompleted) ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!briefingInput.trim() || briefingTyping || missionBriefingCompleted) ? 'not-allowed' : 'pointer',
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