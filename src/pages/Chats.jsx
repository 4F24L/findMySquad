import { Search, Send } from "lucide-react";
import NavBar from "../components/NavBar";
import { useEffect, useState, useRef } from "react";

export default function Chats() {
    const [users, setUsers] = useState([
        { id: "1", name: "Amit Sharma", avatar: "https://randomuser.me/api/portraits/thumb/men/1.jpg", lastMessage: "Hey! How's it going?" },
        { id: "2", name: "Priya Verma", avatar: "https://randomuser.me/api/portraits/thumb/women/2.jpg", lastMessage: "Long time no see!" },
        { id: "3", name: "Rahul Gupta", avatar: "https://randomuser.me/api/portraits/thumb/men/3.jpg", lastMessage: "Let's catch up soon!" },
        { id: "4", name: "Sneha Iyer", avatar: "https://randomuser.me/api/portraits/thumb/women/4.jpg", lastMessage: "How's your project going?" },
        { id: "5", name: "Vikram Singh", avatar: "https://randomuser.me/api/portraits/thumb/men/5.jpg", lastMessage: "Busy with work these days." },
        { id: "6", name: "Anjali Das", avatar: "https://randomuser.me/api/portraits/thumb/women/6.jpg", lastMessage: "Did you watch the latest movie?" },
        { id: "7", name: "Rohit Mehta", avatar: "https://randomuser.me/api/portraits/thumb/men/7.jpg", lastMessage: "Planning a trip next month!" },
        { id: "8", name: "Kiran Patil", avatar: "https://randomuser.me/api/portraits/thumb/women/8.jpg", lastMessage: "Let's meet for coffee." },
        { id: "9", name: "Arjun Nair", avatar: "https://randomuser.me/api/portraits/thumb/men/9.jpg", lastMessage: "Excited for the weekend!" },
        { id: "10", name: "Neha Kapoor", avatar: "https://randomuser.me/api/portraits/thumb/women/10.jpg", lastMessage: "Work has been hectic!" },
        { id: "11", name: "Manish Tiwari", avatar: "https://randomuser.me/api/portraits/thumb/men/11.jpg", lastMessage: "Enjoying my new hobby!" },
        { id: "12", name: "Pooja Reddy", avatar: "https://randomuser.me/api/portraits/thumb/women/12.jpg", lastMessage: "Have a great day ahead!" },
        { id: "13", name: "Sandeep Joshi", avatar: "https://randomuser.me/api/portraits/thumb/men/13.jpg", lastMessage: "Just finished a workout!" },
        { id: "14", name: "Meera Krishnan", avatar: "https://randomuser.me/api/portraits/thumb/women/14.jpg", lastMessage: "Cooking something delicious today!" },
        { id: "15", name: "Rajesh Kumar", avatar: "https://randomuser.me/api/portraits/thumb/men/15.jpg", lastMessage: "Need some tech advice." }
    ]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            const storedMessages = localStorage.getItem(selectedUser.id);
            setMessages(storedMessages ? JSON.parse(storedMessages) : []);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "" && selectedUser) {
            const updatedMessages = [{ sender: "You", text: newMessage }, ...messages];
            setMessages(updatedMessages);
            localStorage.setItem(selectedUser.id, JSON.stringify(updatedMessages));
            setNewMessage("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <NavBar />
            <div className="flex h-[87vh] bg-gray-100 gap-2 px-2">
                {/* Chat List */}
                <div className="w-full md:w-1/3 p-4 overflow-y-auto bg-white shadow-lg relative rounded-2xl no-scrollbar">
                    <div className="sticky top-0 z-10 bg-white p-4 shadow-2xl rounded-lg">
                        <div className="flex items-center border p-2 rounded-lg bg-gray-50">
                            <Search size={20} className="text-gray-500 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search chats" 
                                className="w-full bg-transparent border-none outline-none" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 mt-4">
                        {filteredUsers.map(user => (
                            <div key={user.id} 
                                className="flex items-center space-x-4 p-3 border border-gray-400 rounded-lg shadow-sm hover:bg-[#e2d9ff] cursor-pointer transition"
                                onClick={() => setSelectedUser(user)}>
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border" />
                                <div>
                                    <p className="font-medium text-gray-600">{user.name}</p>
                                    <p className="text-gray-500 text-sm">{user.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`w-full md:w-2/3 p-4 flex flex-col bg-white shadow-lg ${selectedUser ? '' : 'hidden md:flex'} rounded-2xl`}>
                    {selectedUser ? (
                        <>
                            <div className="border-b pb-2 mb-4 flex items-center space-x-4">
                                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full border" />
                                <h2 className="text-lg font-bold text-gray-800">{selectedUser.name}</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg flex flex-col-reverse">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`px-3 py-1 rounded-lg max-w-xs ${msg.sender === "You" ? "bg-[#a78dfb] text-white self-end" : "bg-gray-300 text-gray-700 self-start"} shadow-md` }>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="mt-4 border-t pt-2 flex items-center bg-gray-50 p-3 rounded-lg">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    className="w-full p-2 border rounded-lg outline-none" 
                                    value={newMessage} 
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button 
                                    className="ml-2 px-4 py-2 bg-[#a78dfb] text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                                    onClick={handleSendMessage}>
                                    <Send size={20} className="mr-1" />
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500 flex-1 md:flex md:items-center md:justify-center">Select a chat to start messaging</p>
                    )}
                </div>
            </div>
        </>
    );
}