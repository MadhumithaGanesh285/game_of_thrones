import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Box,
  styled,
  ThemeProvider,
  createTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import logoOne from '../../assets/images/logoOne.jpg';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

//import image
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Throne from '../../assets/images/throne.mp4';
import Searchgif from '../../assets/images/searchGif.gif';
import GOT from '../../assets/images/GOT.mp4';

//import CSS
import './ListOfCharacters.css'

//import icons
import FilterListIcon from '@mui/icons-material/FilterList';
import ScrollToTopButton from '../ScrollToTop/ScrollToTop';

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
});

// New style for the image container with dynamic color in round shape
const ImageContainer = styled(Box)({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  overflow: 'hidden',
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

  const imageStyle: React.CSSProperties = {
    display: 'block',
    margin: '0 auto',
    height: '60px',
    width: 'auto'
  };

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [characterData, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchAndFilterCharacters, setSearchAndFilterCharacters] = useState<Character[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string>("All");

  //Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedCharacters, setPaginatedCharacters] = useState<Character[]>([]); // Characters for the current page
  const rowsPerPage = 8;

  //To Fetch Characters
  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://thronesapi.com/api/v2/Characters`);

      // Map character data to include names and image URLs
      const formattedCharacters = response.data.map((character: any) => ({
        name: character.fullName,
        imageUrl: character.imageUrl,
        house: character.house ? character.house.name : character.fullName,
        id: character.id ? character.id : 0,
        family: normalizeFamilyName(character.family, character.fullName)
      }));

      console.log(response.data,"fetched")
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


  // Filter characters based on search input or by selecting Filter Checkbox
  const filterCharacters = () => {
    debugger
    console.log(searchTerm, "ddd")
    const lowerCaseSearch = searchTerm.toLowerCase();

    const results = characterData.filter((char) =>
      (char.name.toLowerCase().includes(lowerCaseSearch) || char.family.toLowerCase().includes(lowerCaseSearch)) &&
      (selectedFamily === "All" ? uniqueFamilies : selectedFamily.includes(char.family))
    );

    setSearchAndFilterCharacters(results);
    setTotalPages(Math.ceil(results.length / rowsPerPage));
    // setCurrentPage(1); // Reset to page 1 when filtering
    const startIndex = (1 - 1) * rowsPerPage;  // Start index for slicing
    const endIndex = startIndex + rowsPerPage;  // End index for slicing

    setPaginatedCharacters(results.slice(startIndex, endIndex));

  };

  // Get unique family names for the filter options
  const uniqueFamilies = ["All",...Array.from(new Set( characterData.map((char) => char.family))),];

  // ---------------------------------------------------------------------UseEffects---------------------------------------------------------------/
  //Trigger everyTime
  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  //Trigger when there is a change in dependency
  useEffect(() => {
    filterCharacters();
  }, [searchTerm, selectedFamily]);

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

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle "Previous" button click
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Redirecting to Details Page
  const handleRedirect = (characterId: number) => {
    navigate(`/characters/${characterId}`);
  };


  const handleSearchData = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(event?.target.value)
  }

  const normalizeFamilyName = (family: string | null, fullName: string) => {
    if (!family || family.trim() === "" || family.toLowerCase() === "none") return fullName;
  
    const cleanFamily = family.trim().toLowerCase(); // Trim spaces & lowercase everything
  
    
    const familyMappings: Record<string, string> = {
    "House Stark": "House Stark",
    "house stark": "House Stark",
    "Stark": "House Stark",
    "stark": "House Stark",
  
    "House Lannister": "House Lannister",
    "house lannister": "House Lannister",
    "Lannister": "House Lannister",
    "lannister": "House Lannister",
    "House Lanister": "Lannister",
    
  
    "House Targaryen": "House Targaryen",
    "Targaryan":"House Targaryen",

    "Baratheon": "House Baratheon",
    "House Baratheon": "House Baratheon",

    "unknown": fullName,
    "unkown": fullName, // Fix typo
    "": fullName,
    "none": fullName,

    "Greyjoy": "House Greyjoy",
    "House Greyjoy": "House Greyjoy"


    };
    console.log(familyMappings[cleanFamily], "UN")
  
    return familyMappings[cleanFamily] || family 
  };
  

  return (
    <ThemeProvider theme={theme}>
      <div className='backgroundColor' style={{ position: "relative", minHeight: "90vh" }}>
        
              {/* Background Image */}
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
                  // transform: "rotate(-90deg)", // Rotate the video horizontally
                  transformOrigin: "center", // Center the rotation
                  zIndex: -1, // Make sure video stays in the background
                }}
              >
                <source src={GOT} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
        <div style={{ marginBottom: '5px' }}>
          <img src={logoOne} alt="Game Of Thrones App" style={imageStyle} />
        </div>
        <Box className='searchBarBox' sx={{ background: 'linear-gradient(90deg, rgb(169 140 140 / 23%) 0%, rgb(219 219 195 / 26%) 100%)' }}>
          <TextField className='searchBarTextField'
            label="Search Family / Character"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchData}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src={Searchgif} alt="Search" style={{ width: '30px', height: '30px' }} />
                </InputAdornment>
              )
            }}
          />
          {!showFilters ?
            <FilterListIcon onClick={() => setShowFilters(!showFilters)} style={{color:'white'}}/>
            :
            <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
            }}
          >
            {uniqueFamilies.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
          }
        </Box>
        <Box className="character-grid">
          {loading ? (
            <div>
              <img src={"ttt"} alt="Loading..." style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          ) : (
            paginatedCharacters.map((character, index) => {
              return (
                <div key={index} className="character-item">
                  <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2}>
                    <CharacterCard>
                      <CardContentStyled>
                        <ImageContainer>
                          <img src={character.imageUrl} alt={character.name} style={{ width: '100%', height: '100%' }} />
                        </ImageContainer>
                        <Typography variant="h6" component="div" sx={{ marginTop: '8px' }}>
                          {character.name}
                        </Typography>
                      </CardContentStyled>

                      {/* making id and more Button in same line */}
                      <CardActions>
                        <Box className='idButton'>
                          <Typography sx={{ marginTop: '10px' }}>#{character.id}</Typography>
                          <Tooltip title="More Details">
                            <IconButton onClick={() => handleRedirect(character.id)}>
                              <MoreHorizIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </CharacterCard>
                  </Box>
                </div>
              );
            })
          )}
        </Box>
        <PaginationContainer>
          <Button variant="contained" onClick={() => handleNext} disabled={currentPage === 1}>
            Previous
          </Button>
          <Box display="flex" alignItems="center" gap="8px">
            {paginationButtons}
          </Box>
          <Button variant="contained" onClick={() => handlePrevious} disabled={currentPage === totalPages}>
            Next
          </Button>
        </PaginationContainer>
        {/* <ScrollToTopButton /> */}
      </div>
    </ThemeProvider>
  );
}

export default ListOfCharacters;
