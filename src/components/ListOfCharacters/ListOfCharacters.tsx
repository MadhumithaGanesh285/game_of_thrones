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

//import CSS
import "./ListOfCharacters.css";

//import Components
import SearchComponent from "../SerachFamilyOrCharacter/SearchFamilyOrCharacter";
import { normalizeFamilyName } from "../../utils/familyUtils";


//define Interface
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


//Component
const ListOfCharacters: React.FC = () => {
  const [itemsToShow, setItemsToShow] = useState<number>(8); // Default to 8 items

  // Media queries for different screen conditions
  const isWidthGreaterThanOrEqualTo1021 = useMediaQuery("(min-width:1021px)"); // Width >= 1021px
  const isWidthLessThanOrEqualTo768 = useMediaQuery("(max-width:768px)"); // Width <= 768px
  const isHeightLessThanOrEqualTo600 = useMediaQuery("(max-height:600px)"); // Height <= 600px
  const isHeightLessThanOrEqualTo740 = useMediaQuery("(max-height:740px)"); // Height <= 650px
  const isWidthGreaterThanOrEqualTo860 = useMediaQuery("(max-width:860px)"); // Width >= 860px
  const isHeightGreaterThanOrEqualTo1024 = useMediaQuery("(min-height:1024px)"); // Width >= 1024px
  const isHeightGreaterThanOrEqualTo1280 = useMediaQuery("(max-height:1280px)"); // Height <= 1280px

  const [loading, setLoading] = useState<boolean>(false);
  const [characterData, setCharacters] = useState<Character[]>([]);

  //Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedCharacters, setPaginatedCharacters] = useState<Character[]>([]);
  const rowsPerPage = itemsToShow

  //Function to fetch Data
  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://thronesapi.com/api/v2/Characters`);
      const formattedCharacters = response.data.map((character: any) => ({
        name: character.fullName,
        imageUrl: character.imageUrl,
        house: character.house ? character.house.name : character.fullName,
        id: character.id ? character.id : 0,
        family: normalizeFamilyName(character.family,character.fullName)
      }));

      setCharacters(formattedCharacters);
      handlePaginationData(page, formattedCharacters)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching character data:", error);
      setLoading(false);
    }
  };

  const handlePaginationData = (currentPage:number, updatedData:Character[]) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setTotalPages(Math.ceil(updatedData.length / rowsPerPage));
    setPaginatedCharacters(updatedData.slice(startIndex, endIndex));
  }

  // Update the number of items to show based on screen width and height
  useEffect(() => {
    if (isWidthGreaterThanOrEqualTo1021 && isHeightLessThanOrEqualTo600) {
      setItemsToShow(3); // Width >= 1021px and Height <= 600px
    } else if (isWidthLessThanOrEqualTo768 && (isHeightLessThanOrEqualTo740 || isHeightGreaterThanOrEqualTo1024)) {
      setItemsToShow(4); // Width <= 540px and Height <= 740px
    } else if (isWidthGreaterThanOrEqualTo860 && isHeightGreaterThanOrEqualTo1280) {
      setItemsToShow(6); // Width >= 860px and Height >= 1280px
    } else {
      setItemsToShow(8); // Default to 8 items in all other cases
    }
  }, [
    isWidthGreaterThanOrEqualTo1021,
    isWidthLessThanOrEqualTo768,
    isHeightLessThanOrEqualTo600,
    isHeightLessThanOrEqualTo740,
    isWidthGreaterThanOrEqualTo860,
    isHeightGreaterThanOrEqualTo1280,
  ]);
  //this load intially and when we change a page
  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);


  useEffect(() => {
    handlePaginationData(currentPage, characterData)
  }, [currentPage, characterData]);


  //Setting new page number
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  //Searching Values
  const handleSearch = (event: React.SyntheticEvent, value: string) => {
    const searchValue = value.toLowerCase();

    //It search for Character, Family Name and Grouping duplicate Family Name Search
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
      //setting current page to one 
      handlePaginationData(1, filtered)
  };

  //return 
  return (
    <ThemeProvider theme={theme}>
      <div className="MainDivForCharacterList">
        <Box className="mainBox">
          {/* Logo - Centered in mobile, left-aligned in desktop */}
          <Box className="logoBox">
            <h1 className="logo-text">Game Of Thrones Families</h1>
          </Box>
          {/* Search Bar - Moves below the logo on mobile */}
          <Box className="searchBox">
            <SearchComponent characterData={characterData} onSearch={handleSearch} />
          </Box>
        </Box>
        {/* Background Image */}
        <div className="backgroundImageDiv"></div>
        {/* Centered Content */}
        <Container maxWidth="lg" className="contentCentered">
          {/* Character Grid */}
          <Box p={1}>
            <Grid container spacing={3} className="paginatedMainGrid">
              {loading ? (
                <Typography variant="h5">Loading...</Typography>
              ) : (
                //this where api data render
                paginatedCharacters.map((character) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={character.id}>
                    <Link to={`/Characters/${character.id}`} className="redirect">
                      <CharacterCard className="characterCardExternal">
                        <CardContent>
                          <ImageContainer className="imageContained">
                            <img
                              src={character.imageUrl}
                              alt={character.name}
                              className="imageContainerImg"
                            />
                          </ImageContainer>
                          <Typography variant="h6" sx={{ color: 'white', fontSize: { xs: 10, md: 22 } }} className="paginatedTypoForName">
                            {character.name}
                          </Typography>
                        </CardContent>
                      </CharacterCard>
                    </Link>
                  </Grid>
                ))
              )}
            </Grid>
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
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default ListOfCharacters;
