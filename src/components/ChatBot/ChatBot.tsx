import React, { useState, useEffect } from "react";
import axios from "axios";
import { htmlToText } from "html-to-text";
import './ChatBot.css';

interface ChatMessage {
  sender: string;
  message: string;
}

interface detailsOfCharacter {
  characterName: string;
}
const ChatBot: React.FC<detailsOfCharacter> = ({ characterName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>(characterName); // Default input (character name)

    // Automatically fetch information for the default character when component mounts
    useEffect(() => {
      console.log(characterName,userInput, "changeData")
      fetchCharacterDetails(characterName);
    }, [characterName, userInput]); // Empty dependency array to run only once when the component mounts
  
    // Function to fetch character details from Wikipedia
    const fetchCharacterDetails = async (characterName: string) => {
      try {
        // Format the name for Wikipedia API
        const formattedName = characterName.trim().replace(/\s+/g, "_");
  
        // API call to fetch character details from Wikipedia
        const response = await axios.get(`http://localhost:5000/https://en.wikipedia.org/w/api.php`, {
          params: {
            action: "query",
            format: "json",
            prop: "extracts",
            exintro: true,
            titles: formattedName, // Character name
          },
        });
  
        // Check the response data
        const page = response.data.query.pages;
        const pageId = Object.keys(page)[0];
  
        if (pageId && page[pageId].extract) {
          const extract = page[pageId].extract;
          const cleanText = htmlToText(extract);
          const botMessage = `Here's some information about ${characterName}:\n\n${cleanText}`;
  
          // Add bot's response to the messages state
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", message: botMessage },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", message: "Sorry, I couldn't find any information for that character." },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data from Wikipedia:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", message: "Sorry, I couldn't fetch the data. Please try again later." },
        ]);
      }
    };
  
    return (
      <div className="chatbot-container">
        {/* Chat window */}
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h3>Wikepedia Of {characterName}</h3>
          </div>
  
          {/* Messages Section */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender}>
                <div className="message-bubble">
                  <strong>{msg.sender === "bot" ? "Bot" : "You"}: </strong>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
  
          {/* Chatbot Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={characterName}
              disabled
              placeholder="Ask about a character..." // No need for user input
            />
          </div>
        </div>
      </div>
    );
};

export default ChatBot;
