import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const predefinedResponses: Record<string, string> = {
  'attendance': 'To mark your attendance:\n\n1. Go to the Dashboard or Attendance page\n2. Click the "Mark Attendance" button\n3. Your attendance will be recorded with the current timestamp\n\nYou can mark attendance once per day. Check your attendance history on the Attendance page.',
  'grievance': 'To raise a grievance:\n\n1. Navigate to Grievances page from the sidebar\n2. Click "Raise New Grievance"\n3. Select a category and fill in the details\n4. Submit your grievance\n\nYou can track your grievance status on the same page.',
  'payroll': 'Your payroll information is available on the Payroll page:\n\n• View monthly salary breakdown\n• Check allowances and deductions\n• Download payslips\n• View payment history\n\nSalaries are typically credited by the 28th of each month.',
  'leave': 'For leave applications:\n\n1. Go to the Attendance page\n2. Click "Apply for Leave"\n3. Select leave type and dates\n4. Submit for approval\n\nLeave balance and history are shown on the same page.',
  'profile': 'To view or update your profile:\n\n1. Click on your name in the top-right corner\n2. Select "View Profile"\n3. You can view your details and contact HR for updates',
  'password': 'To change your password:\n\n1. Go to Settings from the sidebar\n2. Navigate to Security section\n3. Click "Change Password"\n4. Enter current and new password',
  'default': 'I can help you with:\n\n• **Attendance** - Mark attendance, view history\n• **Grievances** - Raise and track complaints\n• **Payroll** - View salary, download payslips\n• **Leave** - Apply for leave\n• **Profile** - View your details\n\nJust ask me about any of these topics!',
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m NagarSetu Assistant. How can I help you today?\n\nAsk me about attendance, grievances, payroll, or any other topic!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('attendance') || lowerQuery.includes('mark') || lowerQuery.includes('present')) {
      return predefinedResponses['attendance'];
    }
    if (lowerQuery.includes('grievance') || lowerQuery.includes('complaint') || lowerQuery.includes('issue')) {
      return predefinedResponses['grievance'];
    }
    if (lowerQuery.includes('payroll') || lowerQuery.includes('salary') || lowerQuery.includes('pay') || lowerQuery.includes('payslip')) {
      return predefinedResponses['payroll'];
    }
    if (lowerQuery.includes('leave') || lowerQuery.includes('holiday') || lowerQuery.includes('vacation')) {
      return predefinedResponses['leave'];
    }
    if (lowerQuery.includes('profile') || lowerQuery.includes('details') || lowerQuery.includes('info')) {
      return predefinedResponses['profile'];
    }
    if (lowerQuery.includes('password') || lowerQuery.includes('security')) {
      return predefinedResponses['password'];
    }
    
    return predefinedResponses['default'];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = getResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`chatbot-float ${isOpen ? 'hidden' : ''}`}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">NagarSetu Assistant</h3>
                <p className="text-xs text-primary-foreground/70">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'user' ? 'bg-primary' : 'bg-accent'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-md'
                      : 'bg-muted text-foreground rounded-tl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 gov-input py-2.5 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="btn-gov-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
