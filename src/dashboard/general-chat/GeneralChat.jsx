import { useEffect, useState } from "react";
import { db } from "@userAuth/firebase"
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";




const GeneralChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const messageCollectionRef = collection(db, "general-chat");
        const messageQuery = query(messageCollectionRef, orderBy('timestamp', 'desc'), limit(100));
      
        const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
          const fetchedMessages = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .reverse();
          setMessages(fetchedMessages);
        });
      
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
      
        return () => {
          unsubscribe();
          authUnsubscribe();
        };
      }, []);


    // Send message function
    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
      
        try {
          const messageCollectionRef = collection(db, "general-chat");
          await addDoc(messageCollectionRef, {
            text: newMessage,
            timestamp: serverTimestamp(),
            userId: currentUser ? currentUser.uid : 'anonymous',
            userName: currentUser ? currentUser.displayName || "Anonymous" : "Anonymous"
          });
          setNewMessage('');
        } catch (error) {
          console.error("Error sending message: ", error);
        }
      };



    return (
<div className="chat-container">
            <div className="messages-container">
                {messages.map((msg) => (
                    <div key={msg.id} className="message">
                        <strong>{msg.userName}: </strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default GeneralChat;