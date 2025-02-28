import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

//import icons
import { FaArrowLeft } from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";

//import CSS
import './CharacterDetial.css';

//import Components
import { normalizeFamilyName } from "../../utils/familyUtils";

//define interface
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

  useEffect(() => {
    axios
      .get<Character[]>("https://thronesapi.com/api/v2/Characters")
      .then((response) => {
        const allCharacters = response.data;

        // Find the selected character
        const selectedChar = allCharacters.find((char) => char.id.toString() === id);
        if (!selectedChar) return;

        setCharacter(selectedChar);
        // Normalize the family name
        const familyName = normalizeFamilyName(selectedChar.family, selectedChar.fullName);

        // Find characters with the same family name 
        const filteredChars = allCharacters
          .filter((char) => {
            const normalizedFamily = normalizeFamilyName(char.family, char.fullName);
            return normalizedFamily === familyName && char.id !== selectedChar.id;
          })
          .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sort by full name

        setRelatedCharacters(filteredChars);
      })
      .catch((error) => console.error("Error fetching character details:", error));
  }, [id]);


  if (!character) return <h2>Loading...</h2>;

  return (
    <div className="mainDiv">
      {/* Main Card */}
      <div className="mainCard">
        {/* Go Back Button */}
        <button className='backButton' onClick={() => navigate("/")}>
          <FaArrowLeft /> Go Back
        </button>

        {/* Character Name as heading*/}
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
        </div>

        {/* Related Family Members Header */}
        <div className="family-header">
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
