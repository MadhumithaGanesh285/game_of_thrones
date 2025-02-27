import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
import { TbRefresh } from "react-icons/tb";
import './CharacterDetial.css';
import ChatBot from "../ChatBot/ChatBot";
interface Character {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  family: string;
  imageUrl: string;
}

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([]);
  const [selectedDeatils, setSelectedDetails] = useState<string>('');

  useEffect(() => {
    axios
      .get<Character[]>("https://thronesapi.com/api/v2/Characters")
      .then((response) => {
        const allCharacters = response.data;

        const selectedChar = allCharacters.find((char) => char.id.toString() === id);

        if (selectedChar) {
          setCharacter(selectedChar);
          setSelectedDetails(selectedChar.fullName);
          const familyName = normalizeFamilyName(selectedChar.family, selectedChar.fullName)

          // Find characters with the same last name (excluding current character)
          const filteredChars = allCharacters.map((char) => ({
            ...char,
            family: normalizeFamilyName(char.family, char.fullName), // Normalize family name
          }))
            .sort((a, b) => a.family.localeCompare(b.family)) // Sort by family to prevent duplicate headers
            .filter(
              (char) => char.family === familyName && char.id !== selectedChar.id && familyName.toLowerCase().includes(char.family.toLowerCase()))

          setRelatedCharacters(filteredChars);
        }
      })
      .catch((error) => console.error("Error fetching character details:", error));
  }, [id]);

  const normalizeFamilyName = (family: string | null, fullName: string) => {
    if (!family || family.trim() === "" || family.toLowerCase() === "none") return fullName;

    const cleanFamily = family.trim().toLowerCase().replace(/^house\s+/, ''); // Trim spaces & lowercase everything

    const familyMappings: Record<string, string> = {
      "stark": "House Stark",

      "lannister": "House Lannister",
      "lanister": "House Lannister",

      "targaryan": "House Targaryen",
      "targaryen": "House Targaryen",

      "baratheon": "House Baratheon",

      "unknown": fullName,
      "unkown": fullName, // Fix typo
      "": fullName,
      "none": fullName,

      "bolton": "House Bolton",

      "greyjoy": "House Greyjoy"

    };

    return familyMappings[cleanFamily] || family
  };

  if (!character) return <h2>Loading...</h2>;

  return (
    <div className="mainDiv">
      {/* Main Card */}
      <div className="mainCard">
        {/* Go Back Button */}
        <button className='backButton' onClick={() => navigate("/")}>
          <FaArrowLeft /> Go Back
        </button>

        {/* Character Name */}
        <h2 className="h2tag">
          {character.fullName}
        </h2>

        {/* Character Details Section */}
        <div className="character-container">
          {/* Right: Character Image */}
          <img
            src={character.imageUrl}
            alt={character.fullName}
            className="character-image"
          />
          {/* Left: Character Details */}
          <div className="character-details">
            <p>First Name: {character.firstName}</p>
            <p>Last Name: {character.lastName}</p>
            <p>Full Name: {character.fullName}</p>
            <p>Title: {character.title}</p>
            <p>Family: {character.family}</p>
          </div>

          <ChatBot characterName={selectedDeatils} />
        </div>

        {/* Related Family Members Header */}
        <div className="family-header">
          {/* Replace the refresh button with the <Refresh /> component */}
          <TbRefresh onClick={() => window.location.reload()} className="refresh-icon" />
          <h3>Family-{character.family}</h3>
          <button disabled className="record-button">
            {relatedCharacters.length} Record{relatedCharacters.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Related Characters */}
        <div className="related-characters">
          {relatedCharacters.length > 0 ? (
            relatedCharacters.map((char) => (
              <div
                key={char.id}
                onClick={() => navigate(`/characters/${char.id}`)}
                className="related-character-card"
              >
                <img src={char.imageUrl} alt={char.fullName} className="related-character-image" />
                <h4>{char.fullName}</h4>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No related family members.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
