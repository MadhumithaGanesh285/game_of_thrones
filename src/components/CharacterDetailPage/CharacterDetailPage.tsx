import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
import './CharacterDetial.css';
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

        const selectedChar = allCharacters.find((char) => char.id.toString() === id);

        if (selectedChar) {
          setCharacter(selectedChar);
          const familyName = normalizeFamilyName(selectedChar.family, selectedChar.fullName)

          // Find characters with the same last name (excluding current character)
          const filteredChars = allCharacters.map((char) => ({
            ...char,
            family: normalizeFamilyName(char.family, char.fullName), // Normalize family name
          }))
            .sort((a, b) => a.family.localeCompare(b.family)) // Sort by family to prevent duplicate headers
            .filter(
              (char) => char.family === familyName && char.id !== selectedChar.id && familyName.toLowerCase().includes(char.family.toLowerCase())
            );

          setRelatedCharacters(filteredChars);
        }
      })
      .catch((error) => console.error("Error fetching character details:", error));
  }, [id]);

  const normalizeFamilyName = (family: string | null, fullName: string) => {
    if (!family || family.trim() === "" || family.toLowerCase() === "none") return fullName;

    const cleanFamily = family.trim().toLowerCase().replace(/^house\s+/, ''); // Trim spaces & lowercase everything

    const familyMappings: Record<string, string> = {
      "Stark": "House Stark",
      "stark": "House Stark",

      "Lannister": "House Lannister",
      "lannister": "House Lannister",
      "Lanister": "House Lannister",
      "lanister": "House Lannister",
      "House Lanister": "House Lannister",
      "House Lannister": "lanister",

      "targaryan": "House Targaryen",
      "targaryen": "House Targaryen",

      "Baratheon": "House Baratheon",

      "unknown": fullName,
      "unkown": fullName, // Fix typo
      "": fullName,
      "none": fullName,

      "bolton": "House Bolton",

      "Greyjoy": "House Greyjoy",
      "greyjoy": "House Greyjoy"

    };

    return familyMappings[cleanFamily] || family
  };

  if (!character) return <h2>Loading...</h2>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "95vh", padding: "20px" }}>

      {/* Main Card */}
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        {/* Go Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <FaArrowLeft /> Go Back
        </button>

        {/* Character Name */}
        <h2 style={{ textAlign: "center", fontWeight: "bold", padding: "15px 0", borderBottom: "2px solid #ddd" }}>
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
          <button onClick={() => window.location.reload()} className="refresh-button">
            🔄
          </button>
          <h3 style={{whiteSpace:'nowrap',padding:'10px'}}>Family-{character.family}</h3>
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

      {/* CSS Styles */}
      <style>
        {`
          /* Character Details Section */
          .character-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
          }

          .character-details {
            flex: 1;
            font-weight: bold;
            text-align: left;
          }

          .character-image {
            width: 200px;
            height: 270px;
            border-radius: 10px;
            object-fit: cover;
          }

          /* Mobile View: Stack image & details */
          @media (max-width: 768px) {
            .character-container {
              flex-direction: column;
              text-align: center;
            }

            .character-image {
              width: 100%;
              height: auto;
            }
          }

          /* Related Family Members Section */
          .family-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
            padding: 0 20px;
          }

          .refresh-button {
            padding: 8px 15px;
            font-size: 14px;
            background-color: rgb(0 166 237);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .record-button {
            padding: 5px 15px;
            font-size: 14px;
            background-color: #ddd;
            color: #555;
            border: none;
            border-radius: 5px;
            cursor: not-allowed;
          }

          /* Related Characters */
          .related-characters {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            margin-top: 20px;
            padding: 0 10px;
          }

          .related-character-card {
            cursor: pointer;
            text-align: center;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            background-color: #fff;
          }

          .related-character-image {
            width: 100%;
            height: 80%;
            border-radius: 10px;
            object-fit: cover;
          }
        `}
      </style>
    </div>
  );
};

export default CharacterDetails;
