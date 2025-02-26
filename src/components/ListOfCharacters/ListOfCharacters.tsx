import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  styled,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ThroneThree from '../../assets/images/ThroneThree.jpg'
import ThroneVideo from '../../assets/images/GOT.mp4';
//import CSS
import './ListOfCharacters.css'

//import icons
import ScrollToTopButton from '../ScrollToTop/ScrollToTop';
import SearchComponent from '../SerachFamilyOrCharacter/SearchFamilyOrCharacter';

// Define the types for your data
interface Character {
  name: string;
  imageUrl: string;
  house: string;
  family: string;
  id: number
}

// Custom styles
const theme = createTheme();

//Added Card for Chracater name, id, and Icon
const CharacterCard = styled(Card)(({ theme }) => ({
  marginBottom: '16px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  width: '150%',
  maxWidth: '250px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  background: theme.palette.background.paper,
  backgroundColor: '#679a9f59',
  borderColor: '#c8c8c8',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
  },
}));

// image inside the card to align center
const CardContentStyled = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '0px',
});

// New style for the image container with dynamic color in round shape
const ImageContainer = styled(Box)({
  width: '250px',
  height: '266px',
  // borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  overflow: 'hidden',
  padding: '0px',
});

//proper alignment to page number button
const PaginationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '16px',
  padding: '16px',
});

const ListOfCharacters: React.FC = () => {

  const welcomeScreenStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: 'justify',
    color: "#fff",
    fontSize: "2rem",
    zIndex: 9999,
    animation: "fadeOut 1s ease-in-out 2.5s forwards",
  };

  const welcomeTextStyle: React.CSSProperties = {
    animation: "rotateZoomIn 2.5s ease-in-out",
  };

  // Add keyframes to the document
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes rotateZoomIn {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
      }
     
      50% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
      }

      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @keyframes fadeOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 1;
      }
    }
  `, styleSheet.cssRules.length);

  const [loading, setLoading] = useState<boolean>(false);
  const [characterData, setCharacters] = useState<Character[]>([]);
  const [showWelcome, setShowWelcome] = useState(true); // New state for animation

  //Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedCharacters, setPaginatedCharacters] = useState<Character[]>([]); // Characters for the current page
  const rowsPerPage = 12;

  //To Fetch Characters
  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://thronesapi.com/api/v2/Characters`);

      console.log(response.data, "see original data")
      // Map character data to include names and image URLs
      const formattedCharacters = response.data.map((character: any) => ({
        name: character.fullName.replace(/fullName/i, '').trim(),
        imageUrl: character.imageUrl,
        house: character.house ? character.house.name : character.fullName,
        id: character.id ? character.id : 0,
        family: normalizeFamilyName(character.family, character.fullName)
      }));
      console.log(formattedCharacters, "see formatted data")
      setCharacters(formattedCharacters);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      setPaginatedCharacters(formattedCharacters.slice(page, rowsPerPage));
      setLoading(false)
    }
    catch (error) {
      console.error("Error fetching character data:", error);
      setLoading(false);
    }
  };

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

    "targaryan":"House Targaryen",
    "targaryen":"House Targaryen",

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
  
  // ---------------------------------------------------------------------UseEffects---------------------------------------------------------------/
  //Trigger everyTime
  useEffect(() => {

    const timeout = setTimeout(() => {
      setShowWelcome(false); // Hide welcome message
      fetchCharacters(currentPage);// Fetch data after animation
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentPage]);

  //Trigger when there is a change in dependency
  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;  // Start index for slicing
    const endIndex = startIndex + rowsPerPage;  // End index for slicing

    setPaginatedCharacters(characterData.slice(startIndex, endIndex));
  }, [currentPage, characterData]);

  // Pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calculate pagination buttons
  const paginationButtons = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    paginationButtons.push(
      <Button
        key={i}
        variant="contained"
        onClick={() => handlePageChange(i)}
        color={currentPage === i ? 'primary' : 'inherit'}
        style={{ marginRight: '8px' }}
      >
        {i}
      </Button>
    );
  }

  const handleSearch = (event: React.SyntheticEvent, value: string) => {
    const searchValue = value.toLowerCase();
    const filtered = characterData
    .filter(character => {
      const lowerSearch = searchValue.toLowerCase();
      return (
        character.name.toLowerCase().includes(lowerSearch) ||
        character.family.toLowerCase().includes(lowerSearch) ||
        character.family.toLowerCase().includes(lowerSearch.replace(/^house\s+/, ''))
      );
    })
    .sort((a, b) => a.family.localeCompare(b.family));
    const startIndex = (currentPage - 1) * rowsPerPage;  // Start index for slicing
    const endIndex = startIndex + rowsPerPage;  // End index for slicing
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    setPaginatedCharacters(filtered.slice(startIndex, endIndex));
  };

  
  return (
    <ThemeProvider theme={theme}>
      <div className='backgroundColor' style={{ display: "flex", width: "100vw", height: "90vh" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 20px' }}>
          <h1 className="got-text" style={{ margin: 0 }}>Game Of Thrones</h1>
          <div style={{ flex: 1, paddingRight: 5 }}></div>
          <div style={{ marginRight: '70px' }}>
          <Box sx={{ marginTop: '20px', width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
          <SearchComponent characterData={characterData} onSearch={handleSearch} />
        </Box>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            flex: "2.5",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${ThroneThree})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover",  // Ensures image covers the area without distortion
            backgroundPosition: 'center',
            backgroundAttachment: "fixed",  // Optional: Keeps background fixed when scrolling
            filter: "brightness(100%)",  // Optional: Darken background image for better readability
            zIndex: -2,
            // objectFit: "cover",  // Ensures the background image is fully covered without distortion
            height: '160vh',
          }}
        ></div>
        {showWelcome && (
          <div style={welcomeScreenStyle}>
          <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100vw",  // Cover the entire viewport width
            height: "100vh", // Cover the entire viewport height
            objectFit: "cover", // Make sure the video fills the screen
            transform: "rotate(0deg)", // Rotate the video horizontally
            transformOrigin: "center", // Center the rotation
            zIndex: -1, // Make sure video stays in the background
          }}
        >
          <source src={ThroneVideo} type="video/mp4" />
        </video>
        <h1 style={welcomeTextStyle}>When you play game of thrones, you win or you die. There is no middle ground!.</h1>
          </div>
        )}
        {!showWelcome && (
          <div>
            <Box className="character-grid">
              {loading ? (
                <div>
                  <img src={"ttt"} alt="Loading..." style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              ) : (
                paginatedCharacters.map((character, index) => {
                  return (
                    <div key={index} className="character-item">
                      <Link to={`/Characters/${character.id}`} style={{ textDecoration: 'none' }}>
                        <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2}>
                          <CharacterCard>
                            <CardContentStyled>
                              <ImageContainer>
                                <img src={character.imageUrl} alt={character.name} style={{ width: '100%', height: '100%' }} />
                              </ImageContainer>
                              <Typography variant="h5" component="div" sx={{ marginTop: '8px', color: 'white' }}>
                                {character.name}
                              </Typography>
                            </CardContentStyled>
                          </CharacterCard>
                        </Box>
                      </Link>
                    </div>
                  );
                })
              )}
            </Box>
            <PaginationContainer>
              <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </Button>
              <Box display="flex" alignItems="center" gap="8px">
                {paginationButtons}
              </Box>
              <Button variant="contained" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </Button>
            </PaginationContainer>
            <ScrollToTopButton />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default ListOfCharacters;
