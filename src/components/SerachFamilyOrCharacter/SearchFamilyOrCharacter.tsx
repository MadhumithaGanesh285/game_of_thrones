import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

//define interface
interface Character {
  name: string;
  imageUrl: string;
  house: string;
  family: string;
  id: number;
}

interface SearchComponentProps {
  characterData: Character[]; // Pass the character data as prop
  onSearch: (event: React.SyntheticEvent, value: string) => void;
}

//Component
const SearchComponent: React.FC<SearchComponentProps> = ({ characterData, onSearch }) => {
  const [inputValue, setInputValue] = useState<string>('');

  //Handle Input
  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setInputValue(value);
    onSearch(event, value); // Perform search/filtering based on the input value
  };

  //Duplicate Family sorting
  const options = [
    ...characterData
      .map((char) => ({
        ...char,
        family: `House ${char.family.replace(/house /i, '').trim()}`,
      }))
      .sort((a, b) => a.family.localeCompare(b.family)) // Sort by family
      .filter((value, index, self) => // Remove duplicates based on `name`
        index === self.findIndex((t) => t.family === value.family)
      ),
  ];

  //creating a List of Families
  const uniqueFamilies = [...Array.from(new Set(options.map((char) => char.family))),];

  return (
    <Autocomplete
      freeSolo
      options={uniqueFamilies} // Use Family names as options
      inputValue={inputValue.toLowerCase()}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by Family/Character Name"
          variant="outlined"
          fullWidth
          sx={{
            width: 300,
            backgroundColor: 'white', // Ensures input background is always white
            '& .MuiInputLabel-root': {
              fontWeight: 'bold',
              backgroundColor: 'white', // Keeps label background white
              px: 0.5, // Adds padding to avoid overlap
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white', // Ensures input field background is white
            },
            '& .MuiInputLabel-shrink': {
              backgroundColor: 'white', // Keeps floating label white
              px: 0.5,
            },
          }}
        />
      )}
    />
  );
};

export default SearchComponent;
