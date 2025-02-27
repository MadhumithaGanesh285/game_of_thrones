import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

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

const SearchComponent: React.FC<SearchComponentProps> = ({ characterData, onSearch }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setInputValue(value);
    onSearch(event, value); // Perform search/filtering based on the input value
  };

  const options = [
    ...characterData
      .map((char) => ({
        ...char,
        family: `House ${char.family.replace(/house /i, '').trim()}`, // Normalize family names
      }))
      .sort((a, b) => a.family.localeCompare(b.family)) // Sort by family
      .filter((value, index, self) => // Remove duplicates based on `name`
        index === self.findIndex((t) => t.family === value.family)
      ),
  ];
  console.log(options, "seeOptions")

  const uniqueFamilies = [...Array.from(new Set(options.map((char) => char.family))),];

  return (
    <Autocomplete
      freeSolo
      options={uniqueFamilies} // Use character names as options
      inputValue={inputValue.toLowerCase()}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by name"
          variant="outlined"
          fullWidth
          sx={{ width: 300, backgroundColor: 'white', fontWeight:'bold' }}
        />
      )}
    />
  );
};

export default SearchComponent;
