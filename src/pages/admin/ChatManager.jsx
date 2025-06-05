import React, { useState, useEffect, useRef, useCallback } from "react";
import {Layout, List, Input, Button, Typography, Pagination, Avatar} from "antd";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { get_all_messages, get_all_users } from "../../Redux/actions/MessageThunk";
import {
    CloseOutlined,
    ExclamationCircleOutlined,
    LoadingOutlined,
    MessageOutlined,
    SendOutlined, SmileOutlined,
    UserOutlined
} from "@ant-design/icons";
import {  Badge } from 'antd';

// Destructure Text từ Typography
const { Text } = Typography;
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ChatAdmin = () => {
    const dispatch = useDispatch();
    const [activeUser, setActiveUser] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const totalElements = useSelector((state) => state.MessageReducer.totalElements || 0);
    const listUsers = useSelector((state) => state.MessageReducer.users);
    const [users, setUsers] = useState([]);
    const [pageSize, setPageSize] = useState(8);
    const messagesFromStore = useSelector((state) => state.MessageReducer.messages);
    const totalPages = useSelector((state) => state.MessageReducer.totalPages || []);
    const [messages, setMessages] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const chatContentRef = useRef(null);
    const lastScrollHeight = useRef(0);
    const userScrolling = useRef(false);
    const [userPage, setUserPage] = useState(1);
    useEffect(() => {
        const socket = new SockJS("http://localhost:8081/ws");
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/user/1/queue/messages`, (message) => {
                const chatMessage = JSON.parse(message.body);
                console.log(message.body);

                if (chatMessage.senderId === activeUser || chatMessage.receiverId === activeUser) {
                    setMessages((prev) => [...prev, chatMessage]);
                    if (!userScrolling.current) {
                        scrollToBottom(true);
                    }

                } else {
                    setUsers((prevUsers) => {
                        let updatedUsers = [...prevUsers];

                        const existingUserIndex = updatedUsers.findIndex(user => user.id === chatMessage.senderId);

                        if (existingUserIndex !== -1) {
                            // Nếu user đã tồn tại, cập nhật trạng thái `hasNewMessage`
                            updatedUsers[existingUserIndex] = {
                                ...updatedUsers[existingUserIndex],
                                hasNewMessage: true,
                            };

                            // Đưa user có tin nhắn mới lên đầu danh sách
                            const updatedUser = updatedUsers.splice(existingUserIndex, 1)[0];
                            updatedUsers = [updatedUser, ...updatedUsers];

                        } else {
                            if (updatedUsers.length >= pageSize) {
                                updatedUsers.pop(); // Xóa user cuối nếu danh sách quá dài
                            }

                            // Thêm user mới vào đầu danh sách
                            updatedUsers = [
                                {
                                    id: chatMessage.senderId,
                                    nameUser: chatMessage.userName,
                                    hasNewMessage: true,
                                    statusMessage: "UNREAD"
                                },
                                ...updatedUsers
                            ];
                        }

                        return updatedUsers;
                    });
                }
            });
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [activeUser, pageSize]);


    useEffect(() => {
        dispatch(get_all_users(userPage - 1, pageSize));
    }, [userPage, dispatch, pageSize]);

    useEffect(() => {
        if (messagesFromStore.length > 0) {
            setMessages((prevMessages) => {
                const mergedMessages = [...prevMessages, ...messagesFromStore];
                const uniqueMessages = Array.from(new Map(mergedMessages.map(m => [m.id, m])).values());
                return uniqueMessages;
            });
            if (!userScrolling.current) {
                scrollToBottom(false);
            }
        }
    }, [messagesFromStore]);



    useEffect(() => {
        if (activeUser) {
            dispatch(get_all_messages(currentPage, pageSize, activeUser, 1));
        }
    }, [activeUser, currentPage, pageSize, dispatch]);
    useEffect(() => {
        if (listUsers.length > 0) {
            setUsers(listUsers);
            console.log(users);
        }
    }, [listUsers]);
    useEffect(() => {
        if (users.length > 0 && !activeUser) {
            setActiveUser(users[0].id);
        }
    }, [users, activeUser]);

    const selectUser = useCallback((userId) => {
        setMessages(messagesFromStore);
        setActiveUser(userId);

        setUsers((prevUsers) =>
            prevUsers.map(user =>
                user.id === userId ? {...user, hasNewMessage: false} : user
            )
        );
    }, [messagesFromStore]);


    const sendMessage = useCallback(() => {
        if (!messageInput.trim()) return;
        if (!stompClient || !stompClient.connected) {
            console.error("WebSocket chưa kết nối. Không thể gửi tin nhắn.");
            return;
        }
        if (!activeUser) return;

        const message = {
            senderId: 1,
            receiverId: activeUser,
            content: messageInput,
            messageType: 1,
            createdAt: new Date().toISOString(),
            createdBy: "admin",
            status: 0
        };

        stompClient.publish({
            destination: "/app/sendMessage",
            body: JSON.stringify(message),
        });

        setMessages((prev) => [...prev, message]);

        setUsers((prevUsers) =>
            prevUsers.map(user =>
                user.id === activeUser
                    ? { ...user, hasNewMessage: false, statusMessage: "READ" }
                    : user
            )
        );

        setCurrentPage(0);
        setHasMore(true);
        setMessageInput("");
        scrollToBottom(true);
    }, [messageInput, stompClient, activeUser]);

    const handlePageChange = useCallback((page) => {
        setUserPage(page);
    }, []);

    const fetchOldMessages = useCallback(async () => {
        if (!hasMore || !activeUser) return;
        if (hasMore) {
            setCurrentPage(currentPage + 1);
        } else {
            console.log("het r");

        }
    }, [currentPage, hasMore, activeUser, dispatch]);


    const handleScroll = () => {
        const chatBox = chatContentRef.current;
        if (!chatBox) return;

        // Nếu cuộn lên trên cùng, tải tin nhắn cũ
        if (chatBox.scrollTop === 0 && hasMore) {
            lastScrollHeight.current = chatBox.scrollHeight;
            userScrolling.current = true;
            fetchOldMessages().then(() => {
                setTimeout(() => {
                    if (chatBox) {
                        chatBox.scrollTo({top: chatBox.scrollHeight - lastScrollHeight.current, behavior: "auto"});
                    }
                }, 200);
            });
        }

        // Nếu cuộn xuống dưới cùng, tải tin nhắn mới nhất
        if (chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 50) {
            userScrolling.current = false;
            fetchNewMessages();
        }
    };
    const fetchNewMessages = useCallback(async () => {
        if (!activeUser || currentPage <= 0) return;
        try {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            scrollToBottom(true);

        } catch (error) {
            console.error("❌ Lỗi tải tin nhắn mới:", error);
        }
    }, [currentPage, activeUser, dispatch]);

    const scrollToBottom = (smooth) => {
        if (chatContentRef.current) {
            setTimeout(() => {
                chatContentRef.current.scrollTo({
                    top: chatContentRef.current.scrollHeight,
                    behavior: smooth ? "smooth" : "auto",
                });
            }, 100);
        }
    };

    return (
        <section id="content" className="content" style={{ background: '#f8fafc' }}>
            <div className="content__header content__boxed rounded-0">
                <div className="content__wrap">
                    <div className="mt-auto">
                        <div className="row">
                            <div className="col-md-12">
                                <Layout style={{
                                    height: "85vh",
                                    border: "none",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    display: "flex",
                                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                                    background: "#fff"
                                }}>
                                    {/* Sidebar - User List */}
                                    <Sider width={320} style={{
                                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                        borderRight: "1px solid #e2e8f0",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "0",
                                        boxShadow: "2px 0 8px 0 rgba(0,0,0,0.03)"
                                    }}>
                                        <div style={{
                                            padding: "24px 20px 18px",
                                            borderBottom: "1px solid #f1f5f9",
                                            background: "#fff",
                                            boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)"
                                        }}>
                                            <Title level={4} style={{
                                                margin: 0,
                                                fontWeight: "700",
                                                color: "#1e293b",
                                                fontSize: "18px",
                                                lineHeight: "1.4"
                                            }}>
                                                Danh sách người dùng
                                            </Title>
                                            <Text type="secondary" style={{
                                                fontSize: "13px",
                                                color: "#64748b",
                                                display: "block",
                                                marginTop: "4px"
                                            }}>
                                                {totalElements} người dùng
                                            </Text>
                                        </div>

                                        <div style={{
                                            flex: 1,
                                            overflowY: "auto",
                                            padding: "16px 12px",
                                            background: "transparent"
                                        }}>
                                            <List
                                                dataSource={users}
                                                renderItem={(user) => (
                                                    <List.Item
                                                        style={{
                                                            cursor: "pointer",
                                                            background: activeUser === user.id ? "#f0fdfa" : "#fff",
                                                            borderLeft: activeUser === user.id ? "4px solid #0d9488" : "4px solid transparent",
                                                            padding: "12px 16px",
                                                            borderRadius: "8px",
                                                            margin: "8px 0",
                                                            transition: "all 0.2s ease",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "12px",
                                                            border: "1px solid #f1f5f9",
                                                            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                                                            ':hover': {
                                                                background: activeUser === user.id ? "#e0f2f1" : "#f8fafc",
                                                                transform: "translateY(-1px)"
                                                            }
                                                        }}
                                                        onClick={() => selectUser(user.id)}
                                                    >
                                                        <Avatar
                                                            style={{
                                                                backgroundColor: activeUser === user.id ? '#0d9488' : '#7c3aed',
                                                                color: '#fff',
                                                                fontWeight: "600",
                                                                flexShrink: 0
                                                            }}
                                                            size="default"
                                                        >
                                                            {user.userName.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <div style={{
                                                            flex: 1,
                                                            overflow: "hidden",
                                                            minWidth: 0
                                                        }}>
                                                            <div style={{
                                                                fontWeight: user.hasNewMessage ? "600" : "500",
                                                                color: activeUser === user.id ? "#0f766e" : "#1e293b",
                                                                whiteSpace: "nowrap",
                                                                textOverflow: "ellipsis",
                                                                overflow: "hidden",
                                                                fontSize: "14px",
                                                                lineHeight: "1.4"
                                                            }}>
                                                                {user.userName}
                                                            </div>
                                                            <div style={{
                                                                fontSize: "12px",
                                                                color: activeUser === user.id ? "#475569" : "#64748b",
                                                                marginTop: "4px",
                                                                whiteSpace: "nowrap",
                                                                textOverflow: "ellipsis",
                                                                overflow: "hidden"
                                                            }}>
                                                                {user.lastMessageTime || "Chưa có tin nhắn"}
                                                            </div>
                                                        </div>
                                                        {user.hasNewMessage && (
                                                            <Badge
                                                                count={user.unreadCount || 1}
                                                                style={{
                                                                    backgroundColor: '#ef4444',
                                                                    boxShadow: 'none',
                                                                    fontSize: '10px',
                                                                    fontWeight: 600,
                                                                    flexShrink: 0
                                                                }}
                                                            />
                                                        )}
                                                    </List.Item>
                                                )}
                                            />
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "24px",
                                                padding: "16px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#fafafa",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                                            }}
                                        >
                                            <Pagination
                                                current={userPage}
                                                pageSize={pageSize}
                                                onChange={handlePageChange}
                                                total={totalElements}
                                                showSizeChanger={false}
                                                simple
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            />
                                        </div>

                                    </Sider>

                                    {/* Main Chat Area */}
                                    <Layout style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        background: "#fff"
                                    }}>
                                        {/* Chat Header */}
                                        <Header style={{
                                            background: "#fff",
                                            padding: "0 24px",
                                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                                            height: "72px",
                                            display: "flex",
                                            alignItems: "center",
                                            boxShadow: "0 1px 3px 0 rgba(0,0,0,0.03)"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                                width: "100%"
                                            }}>
                                                <Avatar
                                                    size="large"
                                                    style={{
                                                        backgroundColor: '#9f7aea',
                                                        color: '#fff',
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    {activeUser ? users.find(u => u.id === activeUser)?.userName.charAt(0).toUpperCase() : "C"}
                                                </Avatar>
                                                <div>
                                                    <Title level={4} style={{
                                                        margin: 0,
                                                        color: "#2d3748",
                                                        fontSize: "16px",
                                                        fontWeight: "600"
                                                    }}>
                                                        {activeUser ? users.find(u => u.id === activeUser)?.userName : "Chọn người dùng"}
                                                    </Title>
                                                    <Text type="secondary" style={{
                                                        fontSize: "13px",
                                                        color: "#718096"
                                                    }}>
                                                        {activeUser ? "Đang hoạt động" : "Chưa chọn người dùng"}
                                                    </Text>
                                                </div>
                                            </div>
                                        </Header>

                                        {/* Chat Content */}
                                        <Content style={{
                                            flex: 1,
                                            padding: "0",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            background: "#f8fafc"
                                        }}>
                                            {/* Welcome Message */}
                                            {!activeUser && (
                                                <div style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    textAlign: "center",
                                                    padding: "40px"
                                                }}>
                                                    <MessageOutlined style={{
                                                        fontSize: "48px",
                                                        color: "#cbd5e0",
                                                        marginBottom: "20px"
                                                    }} />
                                                    <Title level={4} style={{
                                                        color: "#718096",
                                                        fontWeight: "500",
                                                        marginBottom: "12px"
                                                    }}>
                                                        Chọn người dùng để bắt đầu trò chuyện
                                                    </Title>
                                                    <Text style={{
                                                        color: "#a0aec0",
                                                        maxWidth: "400px"
                                                    }}>
                                                        Vui lòng chọn một người dùng từ danh sách bên trái để xem và gửi tin nhắn
                                                    </Text>
                                                </div>
                                            )}

                                            {activeUser && (
                                                <>
                                                    <div style={{
                                                        background: "#fff",
                                                        padding: "16px 24px",
                                                        textAlign: "center",
                                                        borderBottom: "1px solid rgba(0,0,0,0.05)"
                                                    }}>
                                                        <Text style={{
                                                            color: "#718096",
                                                            fontSize: "13px"
                                                        }}>
                                                            <SmileOutlined style={{
                                                                marginRight: "8px",
                                                                color: "#48bb78"
                                                            }}/>
                                                            Hãy thật thân thiện và niềm nở với khách hàng!
                                                        </Text>
                                                    </div>

                                                    {/* Messages Container */}
                                                    <div
                                                        ref={chatContentRef}
                                                        onScroll={handleScroll}
                                                        style={{
                                                            flex: 1,
                                                            overflowY: "auto",
                                                            padding: "24px",
                                                            background: "transparent"
                                                        }}
                                                    >
                                                        {hasMore && currentPage < totalPages - 1 && (
                                                            <div style={{
                                                                textAlign: "center",
                                                                padding: "12px",
                                                                marginBottom: "16px"
                                                            }}>
                                                                <Button
                                                                    type="text"
                                                                    icon={<LoadingOutlined/>}
                                                                    loading
                                                                    style={{
                                                                        color: "#718096",
                                                                        fontSize: "13px"
                                                                    }}
                                                                >
                                                                    Đang tải tin nhắn cũ...
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {messages.map((msg, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    marginBottom: "16px",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: msg.senderId !== activeUser ? "flex-end" : "flex-start"
                                                                }}
                                                            >
                                                                <div style={{
                                                                    maxWidth: "75%",
                                                                    padding: "14px 18px",
                                                                    borderRadius: msg.senderId !== activeUser
                                                                        ? "18px 18px 0 18px"
                                                                        : "18px 18px 18px 0",
                                                                    background: msg.senderId !== activeUser
                                                                        ? "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
                                                                        : "#fff",
                                                                    color: msg.senderId !== activeUser ? "#fff" : "#2d3748",
                                                                    boxShadow: msg.senderId !== activeUser
                                                                        ? "0 2px 4px rgba(66, 153, 225, 0.2)"
                                                                        : "0 2px 4px rgba(0,0,0,0.05)",
                                                                    position: "relative",
                                                                    border: msg.senderId === activeUser
                                                                        ? "1px solid rgba(0,0,0,0.05)"
                                                                        : "none"
                                                                }}>
                                                                    <div style={{
                                                                        fontWeight: "500",
                                                                        marginBottom: "6px",
                                                                        fontSize: "13px",
                                                                        color: msg.senderId !== activeUser
                                                                            ? "rgba(255,255,255,0.8)"
                                                                            : "#718096"
                                                                    }}>
                                                                        {msg.senderId !== activeUser ? "Hỗ trợ viên" : "Khách hàng"}
                                                                    </div>
                                                                    <div style={{
                                                                        wordBreak: "break-word",
                                                                        fontSize: "15px",
                                                                        lineHeight: "1.5"
                                                                    }}>
                                                                        {msg.content}
                                                                    </div>
                                                                    <div style={{
                                                                        fontSize: "11px",
                                                                        textAlign: "right",
                                                                        marginTop: "8px",
                                                                        color: msg.senderId !== activeUser
                                                                            ? "rgba(255,255,255,0.7)"
                                                                            : "rgba(113, 128, 150, 0.6)"
                                                                    }}>
                                                                        {new Date(msg.createdAt).toLocaleString("en-US", {
                                                                            timeZone: "Asia/Bangkok",
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </Content>

                                        {/* Message Input */}
                                        {activeUser && (
                                            <div style={{
                                                padding: "20px 24px",
                                                background: "#fff",
                                                borderTop: "1px solid rgba(0,0,0,0.05)",
                                                boxShadow: "0 -1px 3px 0 rgba(0,0,0,0.02)"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    alignItems: "center"
                                                }}>
                                                    <Input.TextArea
                                                        value={messageInput}
                                                        onChange={(e) => setMessageInput(e.target.value)}
                                                        placeholder="Nhập tin nhắn..."
                                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: "12px",
                                                            padding: "12px 16px",
                                                            resize: "none",
                                                            border: "1px solid rgba(0,0,0,0.08)",
                                                            fontSize: "15px",
                                                            transition: "all 0.2s",
                                                            boxShadow: "none"
                                                        }}
                                                        onPressEnter={(e) => {
                                                            if (!e.shiftKey) {
                                                                e.preventDefault();
                                                                sendMessage();
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        icon={<SendOutlined />}
                                                        onClick={sendMessage}
                                                        style={{
                                                            width: "48px",
                                                            height: "48px",
                                                            background: "#4299e1",
                                                            border: "none",
                                                            boxShadow: "0 2px 4px rgba(66, 153, 225, 0.3)"
                                                        }}
                                                        disabled={!messageInput.trim()}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Layout>
                                </Layout>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatAdmin;