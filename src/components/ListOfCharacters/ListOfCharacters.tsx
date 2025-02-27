import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Grid,
  styled,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Container
} from "@mui/material";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../ScrollToTop/ScrollToTop";
import SearchComponent from "../SerachFamilyOrCharacter/SearchFamilyOrCharacter";
import "./ListOfCharacters.css";

interface Character {
  name: string;
  imageUrl: string;
  house: string;
  family: string;
  id: number;
}

// Theme Setup
const theme = createTheme();

// Styled Components
const CharacterCard = styled(Card)(() => ({
  border: "1px solid #ddd",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "250px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  backgroundColor: "#679a9f59",
  borderColor: "#c8c8c8",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
  },
}));

const ImageContainer = styled(Box)({
  width: "100%",
  height: "220px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

const PaginationContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "16px",
  padding: "16px",
});


const ListOfCharacters: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [loading, setLoading] = useState<boolean>(false);
  const [characterData, setCharacters] = useState<Character[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedCharacters, setPaginatedCharacters] = useState<Character[]>(
    []
  );
  const rowsPerPage = isMobile ? 6 : 12;

  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://thronesapi.com/api/v2/Characters`);
      const formattedCharacters = response.data.map((character: any) => ({
        name: character.fullName,
        imageUrl: character.imageUrl,
        house: character.house ? character.house.name : character.fullName,
        id: character.id ? character.id : 0,
        family: normalizeFamilyName(character.family, character.fullName),
      }));

      setCharacters(formattedCharacters);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      setPaginatedCharacters(formattedCharacters.slice(page, rowsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching character data:", error);
      setLoading(false);
    }
  };

  const normalizeFamilyName = (family: string | null, fullName: string) => {
    if (!family || family.toLowerCase() === "none") return fullName;

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

      "greyjoy": "House Greyjoy",

      "lorath": "House Lorathi",
      "lorathi": "House Lorathi"

    };

    return familyMappings[cleanFamily] || family
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWelcome(false);
      fetchCharacters(currentPage);
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedCharacters(characterData.slice(startIndex, endIndex));
  }, [currentPage, characterData]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
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
      <div className="backgroundColor">
        <Box className="mainBox">
          {/* Logo - Centered in mobile, left-aligned in desktop */}
          <Box className="logoBox">
            <h1 className="got-text">Game Of Thrones Families</h1>
          </Box>

          {/* Search Bar - Moves below the logo on mobile */}
          <Box className="searchBox">
            <SearchComponent characterData={characterData} onSearch={handleSearch} />
          </Box>
        </Box>
        {/* Background Image */}
        <div className="backgroundImageDiv"></div>

        {/* Centered Content */}
        <Container maxWidth="lg" className="containerCentered">
          {/* Character Grid */}
          <Box p={2}>
            <Grid container spacing={3} justifyContent="center" className="paginatedMainGrid">
              {loading ? (
                <Typography variant="h5">Loading...</Typography>
              ) : (
                paginatedCharacters.map((character) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={character.id}>
                    <Link to={`/Characters/${character.id}`} className="redirect">
                      <CharacterCard >
                        <CardContent>
                          <ImageContainer>
                            <img
                              src={character.imageUrl}
                              alt={character.name}
                              className="imageContainerImg"
                            />
                          </ImageContainer>
                          <Typography variant="h6" sx={{ color: 'white' }} className="paginatedTypoForName">
                            {character.name}
                          </Typography>
                        </CardContent>
                      </CharacterCard>
                    </Link>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>

          {/* Pagination */}
          <PaginationContainer>
            <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} style={{ backgroundColor: currentPage === 1 ? "#ddd" : "#1976d2" }} disabled={currentPage === 1}>
              Previous
            </Button>
            <Typography variant="h6" sx={{ color: 'white' }}>{currentPage} / {totalPages}</Typography>
            <Button variant="contained" style={{ backgroundColor: currentPage === totalPages ? "#ddd" : "#1976d2" }} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </PaginationContainer>

          <ScrollToTopButton />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default ListOfCharacters;
