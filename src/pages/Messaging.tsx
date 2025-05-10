import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Clock, Check, CheckCheck, ChevronLeft, MapPin, Package, FileText, Share2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Message } from '../types';

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    matchId: '3',
    senderId: 'hosp2',
    receiverId: 'hosp4',
    content: 'Hello, I see you need Losartan. We have 30 boxes available. Would you be interested?',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '2',
    matchId: '3',
    senderId: 'hosp4',
    receiverId: 'hosp2',
    content: 'Yes, we are very interested! What dosage and quantity can you provide?',
    read: true,
    createdAt: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
  },
  {
    id: '3',
    matchId: '3',
    senderId: 'hosp2',
    receiverId: 'hosp4',
    content: 'We have Losartan 50mg, 30 tablets per box. The expiration date is next year in June.',
    read: true,
    createdAt: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
  },
  {
    id: '4',
    matchId: '3',
    senderId: 'hosp4',
    receiverId: 'hosp2',
    content: 'That sounds perfect. How much are you asking for each box?',
    read: true,
    createdAt: new Date(Date.now() - 75600000).toISOString(), // 21 hours ago
  },
  {
    id: '5',
    matchId: '3',
    senderId: 'hosp2',
    receiverId: 'hosp4',
    content: 'We can do $45 per box, which is below market price. We just want to make sure it gets used before expiring.',
    read: true,
    createdAt: new Date(Date.now() - 72000000).toISOString(), // 20 hours ago
  },
  {
    id: '6',
    matchId: '3',
    senderId: 'hosp4',
    receiverId: 'hosp2',
    content: 'That works for us. We would like to purchase 20 boxes. How should we arrange pickup or delivery?',
    read: true,
    createdAt: new Date(Date.now() - 36000000).toISOString(), // 10 hours ago
  },
  {
    id: '7',
    matchId: '3',
    senderId: 'hosp2',
    receiverId: 'hosp4',
    content: 'We can have our courier deliver it to you tomorrow. Can you provide your shipping address and a contact person?',
    read: true,
    createdAt: new Date(Date.now() - 32400000).toISOString(), // 9 hours ago
  },
];

interface MessageGroup {
  date: string;
  messages: Message[];
}

export const Messaging: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages.filter(m => m.matchId === matchId));
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Quick reply options
  const quickReplies = [
    { icon: <MapPin size={14} />, text: 'Share shipping address' },
    { icon: <Package size={14} />, text: 'Confirm receipt of package' },
    { icon: <FileText size={14} />, text: 'Request invoice' },
    { icon: <Share2 size={14} />, text: 'Share contact information' },
  ];
  
  useEffect(() => {
    // Scroll to bottom on load or when new messages arrive
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = async (content = newMessage) => {
    if (content.trim() === '') return;
    
    setIsLoading(true);
    
    // In a real app, you would send this to your API
    const message: Message = {
      id: `temp-${Date.now()}`,
      matchId: matchId || '3',
      senderId: 'hosp2', // Current user's hospital ID
      receiverId: 'hosp4', // Other hospital's ID
      content,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    // Add message to state
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };
  
  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };
  
  // Group messages by date
  const groupMessagesByDate = (): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.createdAt).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: [...currentGroup],
          });
        }
        
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: [...currentGroup],
      });
    }
    
    return groups;
  };
  
  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getMessageStatus = (message: Message) => {
    if (message.senderId === 'hosp2') { // Current user's hospital ID
      if (message.id.startsWith('temp')) {
        return <Clock size={14} className="text-gray-400" />;
      } else if (message.read) {
        return <CheckCheck size={14} className="text-blue-500" />;
      } else {
        return <Check size={14} className="text-gray-400" />;
      }
    }
    return null;
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft size={16} />}
          className="mb-4"
          onClick={() => window.history.back()}
        >
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Conversation with St. Mary's Hospital</h1>
        <p className="text-gray-600">Regarding Losartan medication exchange</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card className="h-[600px] flex flex-col p-0">
            {/* Message thread */}
            <div className="flex-grow overflow-y-auto p-4">
              {groupMessagesByDate().map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <div className="text-center mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {group.date === new Date().toLocaleDateString() ? 'Today' : group.date}
                    </span>
                  </div>
                  
                  {group.messages.map((message, msgIndex) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.senderId === 'hosp2' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.senderId === 'hosp2'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                          message.senderId === 'hosp2' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                          {getMessageStatus(message)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick replies */}
            <div className="px-4 pt-2 pb-3 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.text)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                  >
                    {reply.icon}
                    <span>{reply.text}</span>
                  </button>
                ))}
              </div>
              
              {/* Message input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-end gap-2"
              >
                <Input
                  id="message"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  variant="primary"
                  rightIcon={<Send size={16} />}
                  isLoading={isLoading}
                  disabled={newMessage.trim() === ''}
                >
                  Send
                </Button>
              </form>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Exchange Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Medication</h4>
                <p className="text-gray-900">Losartan 50mg</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Provider</h4>
                <p className="text-gray-900">Your Hospital</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Requester</h4>
                <p className="text-gray-900">St. Mary's Hospital</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Agreement in Progress
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Match Quality</h4>
                <p className="text-gray-900">85% match</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Distance</h4>
                <p className="text-gray-900">12.3 kilometers</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};