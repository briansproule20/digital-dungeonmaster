"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Hero } from "../lib/supabase";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface HeroChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: Hero;
}

export default function HeroChatModal({ isOpen, onClose, hero }: HeroChatModalProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or when typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingContent]);

  // Reset messages when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInput("");
      setStreamingContent("");
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-gray-500 ml-2">{hero.name} is thinking...</span>
        </div>
      </div>
    </div>
  );

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    const currentInput = input;
    setInput("");
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          heroSystemPrompt: hero.system_prompt
        })
      });
      
      if (response.ok) {
        setIsTyping(false);
        const data = await response.text();
        
        // Simulate streaming effect by showing content gradually
        const words = data.split(' ');
        let displayedContent = '';
        setStreamingContent('');
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: '',
          id: (Date.now() + 1).toString()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        for (let i = 0; i < words.length; i++) {
          displayedContent += (i > 0 ? ' ' : '') + words[i];
          setStreamingContent(displayedContent);
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: displayedContent }
              : msg
          ));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        setStreamingContent('');
      } else {
        setIsTyping(false);
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setIsTyping(false);
      setStreamingContent('');
      console.error('Hero chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        id: (Date.now() + 1).toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {hero.avatar_url && (
              <img
                src={hero.avatar_url}
                alt={hero.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Chat with {hero.name}</h2>
              <p className="text-sm text-gray-500">
                Level {hero.level} {hero.race} {hero.class}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="chat-container p-4 space-y-4 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Welcome!</div>
                <p className="text-sm">Start a conversation with {hero.name}. Ask them about their adventures, background, or anything else!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={message.id || index} className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm prose prose-sm max-w-none">
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${hero.name} anything...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}