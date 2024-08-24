'use client'
import ChatLayout from "@/app/component/layout/chatLayout";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WhiteBox } from "@/app/common/box/whiteBox";
import { AdminIcon } from "@/app/common/icons/adminIcon";
import { useChatAction, useChatStack } from "@/app/store/chat.store";
import { sendChatApi } from "@/app/service/chat/chat.api";
import { extractTokenId, extractTokenUsername } from "@/app/component/util/jwtDecode";
import { useChatRoom, useChatting } from "@/app/hooks/chat.hook";
import { useIsChatOpenAction, useIsChatOpenStack } from "@/app/store/chatOpen.store";
import { useYourChatStack } from "@/app/store/yourChat.store";
import { chatDummy } from "@/app/common/dummy/chat.dummy";
import { useRouter } from "next/navigation";
import Initials from "@/app/common/icons/initials";

export default function ChatRoom() {
    const [isOpen, setIsOpen] = useState(false);

    const handleIsChatOpen = useIsChatOpenAction();
    const isChatOpen = useIsChatOpenStack();

    const actionChat = useChatAction();
    const chat = useChatStack();

    const router = useRouter();

    const { data: chatRoom } = useChatRoom();

    const enterCahtRoom = (chatRoom: IChat) => {
        if (chatRoom != undefined) {
            actionChat.update(chatRoom);
            console.log('enterCahtRoom : ' + JSON.stringify(chat))
            // refetch();
            handleIsChatOpen(true)
        }
    }

    const { data: chatting } = useChatting(Number(chat.id));

    const sendChat = async () => await sendChatApi(chat)


    const submitChat = (e: any) => {
        try {
            if (e.key === "Enter") {
                e.preventDefault();
                actionChat.chatMessage(e.target.value);
                actionChat.setUsername(extractTokenUsername() + '');
                // console.log('submitChat : ' + JSON.stringify(chat))
                sendChat()
                    .then((res: IChat | { status: number; }) => {
                        actionChat.chatMessage('')
                    })
                    .catch((error) => {
                        console.log("sendChat page err: ", error)
                    })
            }
            // refetch();
        } catch (error) {
            console.error('Error submitChat message:', error);
        }
    }

    const enterTestChat = () => {
        setIsOpen(false)
        handleIsChatOpen(false)
        console.error('Error submitChat enterChat:', isOpen, isChatOpen);
        router.push(`/chatting/enterChat`)
    }

    const myid = '1';

    interface Message {
        id: string | null;
        roomId: string;
        message: string;
        senderId: string;
        senderName: string;
        createdAt: string;
    }

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [inputMessage2, setInputMessage2] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [tempIdCounter, setTempIdCounter] = useState<number>(1);


    useEffect(() => {
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/alarms/chats/receive/1`);

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
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alarms/chats/send`, {
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
        if (inputMessage.trim()) {
            const message = {
                id: null, // ID는 null로 설정
                roomId: "1",
                message: inputMessage,
                senderId: "2",
                senderName: "jin",
                createdAt: new Date().toISOString()
            };
            console.log("Sending message:", message);
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alarms/chats/send`, {
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

    const handleKeyDown = (e: any, sendMessageFunction: () => void) => {
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
        <div className="w-full h-full">
            <button className="fixed right-3 bottom-3" onClick={() => { setIsOpen(!isOpen), handleIsChatOpen(false) }}>
                <Image src="/imgs/chatroom.png" width="50" height="50" alt="채팅방" priority />
                <span className="bg-red-500 h-4 w-4 rounded-full text-xs text-white absolute top-0 right-0">{chatRoom?.length}</span>
            </button>

            <div className={`w-full h-full transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {isChatOpen == true ?
                    <ChatLayout>

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
                            <div className="fixed bottom-8 w-auto flex border-t-1 p-5" >
                                <div className="flex ">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onKeyDown={(e) => handleKeyDown(e, sendMessage)}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        className="flex w-[350px] p-5 rounded-2xl border mr-3"
                                        placeholder="admin01의 메시지를 입력하세요"
                                    />
                                    <div className="w-[100px] border bg-blue-400 rounded-lg text-white grid grid-cols-2">
                                        <button onClick={sendMessage} className=" text-right">se</button>
                                        <button onClick={sendMessage2} className=" text-left">nd</button>
                                    </div>
                                    {/* <button
                onClick={sendMessage}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  cursor: 'pointer'
                }}> 
                Send
              </button>*/}
                                </div>
                                {/* <div  className="fixed top-0 left-10 w-auto flex border-t-1 p-5" >
              <input
              type="text"
              value={inputMessage2}
              onKeyDown={(e) => handleKeyDown(e, sendMessage2)}
              onChange={(e) => setInputMessage2(e.target.value)}
             className="flex w-[350px] p-5 rounded-2xl border mr-3"
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
            </button>
            </div> */}
                            </div>
                        </div>


                    </ChatLayout>
                    :
                    <ChatLayout>
                        {chatRoom && chatRoom.map((v: IChat, i: number) =>
                            v && (
                                <div className="py-1" key={i}>
                                    <button key={i + 2} className="w-full text-left" name="roomId" onClick={() => enterCahtRoom(v)}>
                                        <WhiteBox style="white hover:bg-pebble-400 grid grid-cols-3 h-[60px] content-center" >
                                            <div className="text-sm truncate col-span-2">chatroom {v.id}</div>
                                        </WhiteBox>
                                    </button>
                                </div>
                            ))}
                        {/* <div className="py-1" >
                                    <button className="w-full text-left" name="roomId" onClick={() => router.push(`/chatting/enterChat`)}>
                                        <WhiteBox style="white hover:bg-pebble-400 grid grid-cols-3 h-[60px] content-center" >
                                            <div className="text-sm truncate col-span-2">Enter the chat</div>
                                        </WhiteBox>
                                    </button>
                                </div> */}
                    </ChatLayout>
                }
            </div >
        </div >
    )
};