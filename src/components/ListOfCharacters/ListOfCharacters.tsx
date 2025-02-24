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
  IconButton
} from '@mui/material';
import logo from '../../assets/images/logo.jpg';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

//import image
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//import CSS
import './ListOfCharacters.css'

// Define the types for your data
interface Character {
  name: string;
  imageUrl: string;
  house: string;
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
    height: '154px',
    width: 'auto'
  };

  const navigate = useNavigate();

  const [characterData, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  //Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedCharacters, setPaginatedCharacters] = useState<Character[]>([]); // Characters for the current page
  const rowsPerPage = 12;

  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://thronesapi.com/api/v2/Characters`);

      // Map character data to include names and image URLs
      const formattedCharacters = response.data.map((character: any) => ({
        name: character.fullName,
        imageUrl: character.imageUrl,
        house: character.house ? character.house.name : "Unknown",
        id: character.id ? character.id : 0
      }));

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


  useEffect(() => {
    fetchCharacters(currentPage);
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;  // Start index for slicing
    const endIndex = startIndex + rowsPerPage;  // End index for slicing

    setPaginatedCharacters(characterData.slice(startIndex, endIndex)); // Slice the correct page data
  }, [currentPage, characterData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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

  const handleRedirect = (characterId: number) => {
    navigate(`/characters/${characterId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='backgroundColor'>
        <div style={{ marginBottom: '5px' }}>
          <img src={logo} alt="Game Of Thrones App" style={imageStyle} />
        </div>
        <Box className='searchBarBox' sx={{ background: 'linear-gradient(90deg, rgb(169 140 140 / 23%) 0%, rgb(219 219 195 / 26%) 100%)' }}>
          <TextField className='searchBarTextField'
            label="Search Family / Character"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
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
      </div>
    </ThemeProvider>
  );
}

export default ListOfCharacters;
