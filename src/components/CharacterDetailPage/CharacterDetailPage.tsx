import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
import { Button } from '@mui/material';
import Throne from '../../assets/images/throne.mp4'

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
          const familyName = selectedChar.family

          // Find characters with the same last name (excluding current character)
          const filteredChars = allCharacters.filter(
            (char) => char.family === familyName && char.id !== selectedChar.id && familyName.toLowerCase().includes(char.family.toLowerCase())
          );

          setRelatedCharacters(filteredChars);
        }
      })
      .catch((error) => console.error("Error fetching character details:", error));
  }, [id]);

  if (!character) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px", position: "relative", minHeight: "100vh" }}>
      {/* Go Back Button */}
      <Button
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "#007bff",
          marginBottom: "20px",
        }}
      >
        <FaArrowLeft /> Go Back
      </Button>

      {/* Character Info Layout */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "30px" }}>
        {/* Left: Character Image */}
        <img
          src={character.imageUrl}
          alt={character.fullName}
          style={{ width: "200px", borderRadius: "10px", objectFit: "cover" }}
        />

        {/* Right: Character Details */}
        <div style={{ textAlign: "left" }}>
          <h2>First Name: {character.firstName}</h2>
          <h2>Last Name: {character.lastName}</h2>
          <h2>Full Name: {character.fullName}</h2>
          <h3>Title: {character.title}</h3>
          <h3>Family: {character.family}</h3>
        </div>
      </div>

      {/* Related Characters */}
      <h3>Related Family Member "{character.family}"</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {relatedCharacters.length > 0 ? (
          relatedCharacters.map((char) => (
            <div
              key={char.id}
              onClick={() => navigate(`/characters/${char.id}`)}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <img src={char.imageUrl} alt={char.fullName} style={{ width: "100px" }} />
              <h4>{char.fullName}</h4>
            </div>
          ))
        ) : (
          <p>No related Family Member.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterDetails;
