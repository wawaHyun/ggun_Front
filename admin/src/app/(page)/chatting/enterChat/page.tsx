'use client';

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { useChatAction, useChatStack } from "@/app/store/chat.store";
import { useYourChatStack } from "@/app/store/yourChat.store";
import Initials from "@/app/common/icons/initials";

interface Message {
  id: string | null;
  roomId: string;
  message: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [inputMessage2, setInputMessage2] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [tempIdCounter, setTempIdCounter] = useState<number>(1);


  const actionChat = useChatAction();
  const chat = useChatStack();

  const actionYourChat = useChatAction();
  const yourChat = useYourChatStack();

  useEffect(() => {
    const eventSource = new EventSource(`https://api.jinpold.ggun.store/alarms/chats/receive/1`);

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    eventSource.onmessage = (event) => {
      try {
        const newMessage: Message = JSON.parse(event.data);
        console.log("New message received:", newMessage);

        // Handle null ID by assigning a temporary sequential ID
        if (newMessage.id === null) {
          newMessage.id = `temp-${tempIdCounter}`;
          setTempIdCounter((prev) => prev + 1);
        }

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          console.log("Updated messages:", updatedMessages);
          return updatedMessages;
        });
      } catch (error) {
        console.error("Failed to parse message", error);
      }
    };

    eventSource.onerror = (e) => {
      console.error("SSE error", e);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [tempIdCounter]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      const message = {
        id: null, // ID는 null로 설정
        roomId: "1",
        message: inputMessage,
        senderId: "1",
        senderName: "soo",
        createdAt: new Date().toISOString()
      };
      console.log("Sending message:", message);
      try {
        await fetch(`https://api.jinpold.ggun.store/alarms/chats/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
          mode: 'cors', // CORS 모드를 명시적으로 설정
        });
        setInputMessage('');
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const sendMessage2 = async () => {
    if (inputMessage2.trim()) {
      const message = {
        id: null, // ID는 null로 설정
        roomId: "1",
        message: inputMessage2,
        senderId: "2",
        senderName: "jin",
        createdAt: new Date().toISOString()
      };
      console.log("Sending message:", message);
      try {
        await fetch(`https://api.jinpold.ggun.store/alarms/chats/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
          mode: 'cors', // CORS 모드를 명시적으로 설정
        });
        setInputMessage2('');
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, sendMessageFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessageFunction();
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Seoul'
    }).format(new Date(date));
  };

  return (
    <div className="w-full h-full flex justify-center">

      <div className="w-[90%] h-full grid grid-cols-2 gap-5 ">

        <div className="w-full h-full ">
          <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>admin01 Chat Room</h1>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5' }}>
            {messages.map((msg) => (
              <div key={msg.id || `temp-key-${Math.random()}`} style={{
                display: 'flex',
                flexDirection: msg.senderId === '1' ? 'row-reverse' : 'row',
                marginBottom: '10px',
                alignItems: 'flex-start'
              }}>
                {msg.senderId !== '1' && (
                  <Initials
                    initials={getInitials(msg.senderName)}
                    size={40}
                  />
                )}
                <div style={{
                  backgroundColor: msg.senderId === '1' ? '#DCF8C6' : '#FFFFFF',
                  color: '#000000',
                  borderRadius: '10px',
                  padding: '10px',
                  maxWidth: '60%',
                  position: 'relative',
                  marginLeft: msg.senderId === '1' ? '0' : '10px',
                  marginRight: msg.senderId === '1' ? '10px' : '0',
                }}>
                  <p style={{ margin: 0 }}>{msg.message}</p>
                  <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '10px',
                    fontSize: '12px',
                    color: '#888',
                  }}>
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
                {msg.senderId === '1' && (
                  <Initials
                    initials={getInitials(msg.senderName)}
                    size={40}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div  className="fixed bottom-0 w-full flex border-t-1 p-5" >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={inputMessage}
                onKeyDown={(e) => handleKeyDown(e, sendMessage)}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex w-[600px] p-5 rounded-2xl border mr-3"
                placeholder="admin01의 메시지를 입력하세요"
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              {/* <input
              type="text"
              value={inputMessage2}
              onKeyDown={(e) => handleKeyDown(e, sendMessage2)}
              onChange={(e) => setInputMessage2(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', marginRight: '10px' }}
              placeholder="admin02의 메시지를 입력하세요"
            />
            <button
              onClick={sendMessage2}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Send (jin / 유저 2)
            </button> */}
            </div>
          </div>
        </div>


        <div className="w-full h-full ">
          <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>admin02 Chat Room</h1>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5' }}>
            {messages.map((msg) => (
              <div key={msg.id || `temp-key-${Math.random()}`} style={{
                display: 'flex',
                flexDirection: msg.senderId === '1' ? 'row-reverse' : 'row',
                marginBottom: '10px',
                alignItems: 'flex-start'
              }}>
                {msg.senderId !== '1' && (
                  <Initials
                    initials={getInitials(msg.senderName)}
                    size={40}
                  />
                )}
                <div style={{
                  backgroundColor: msg.senderId === '1' ? '#DCF8C6' : '#FFFFFF',
                  color: '#000000',
                  borderRadius: '10px',
                  padding: '10px',
                  maxWidth: '60%',
                  position: 'relative',
                  marginLeft: msg.senderId === '1' ? '0' : '10px',
                  marginRight: msg.senderId === '1' ? '10px' : '0',
                }}>
                  <p style={{ margin: 0 }}>{msg.message}</p>
                  <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '10px',
                    fontSize: '12px',
                    color: '#888',
                  }}>
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
                {msg.senderId === '1' && (
                  <Initials
                    initials={getInitials(msg.senderName)}
                    size={40}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div  className="fixed bottom-0 w-full flex border-t-1 p-5" >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <input
              type="text"
              value={inputMessage}
              onKeyDown={(e) => handleKeyDown(e, sendMessage)}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', marginRight: '10px' }}
              placeholder="admin01의 메시지를 입력하세요"
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Send (soo / 유저1)
            </button> */}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <input
                type="text"
                value={inputMessage2}
                onKeyDown={(e) => handleKeyDown(e, sendMessage2)}
                onChange={(e) => setInputMessage2(e.target.value)}
                className="flex w-[600px] p-5 rounded-2xl border mr-3"
                placeholder="admin02의 메시지를 입력하세요"
              />
              <button
                onClick={sendMessage2}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;