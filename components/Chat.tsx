"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `**Welcome to Digital Dungeonmaster!**

You are the **Dungeonmaster** here! I'm your AI assistant to help you manage your campaigns with AI heroes.

**How our system works:**
- **You're the DM** - You control the story, make final decisions, and guide the adventure
- **AI heroes** - Your party members are AI characters with unique personalities
- **Your responsibilities:** Manage dice rolls, track HP in battles, and decide when checks are needed
- **My role:** Help you be an awesome DM and work with your AI party

**Get started:**
- Ask me about DM tips for AI characters
- Get help creating campaign scenarios
- Learn how to manage your AI party effectively

What would you like to know about being a DM for AI heroes?`,
      id: 'welcome-message'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  console.log("Chat component rendered");
  console.log("Chat state:", { messages, isLoading, input, inputLength: input.length });

  // Auto-scroll to bottom when messages change or when typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingContent]);

  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-gray-500 ml-2">Dungeonmaster is thinking...</span>
        </div>
      </div>
    </div>
  );

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    console.log("Sending message:", input);
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
      const response = await fetch('/api/homepage-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });
      
      console.log("API Response status:", response.status);
      console.log("API Response statusText:", response.statusText);
      console.log("API Response ok:", response.ok);
      
      if (response.ok) {
        setIsTyping(false);
        const data = await response.text();
        console.log("API Response data:", data);
        
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
          await new Promise(resolve => setTimeout(resolve, 50)); // Adjust speed as needed
        }
        
        setStreamingContent('');
      } else {
        setIsTyping(false);
        const errorText = await response.text();
        console.error("API Error status:", response.status);
        console.error("API Error statusText:", response.statusText);
        console.error("API Error text:", errorText);
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setIsTyping(false);
      setStreamingContent('');
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        id: (Date.now() + 1).toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col max-h-[600px]">
      {/* Messages Container */}
      <div className="chat-container p-4 space-y-4 flex-1 overflow-y-auto max-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Loading...</div>
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
            placeholder="Ask your Dungeonmaster anything..."
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
  );
}