import React, { useState } from "react";
import "../styles/index.css";

interface AutoCompleteProps {
  label?: string;
  options: { id: string; label: string }[];
  onSelect: (selectedItem: { id: string; label: string } | null) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter options based on user input
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
  };

  const handleOptionSelect = (option: { id: string; label: string } | null) => {
    setSelectedItem(option);
    onSelect(option);
    setInputValue(option ? option.label : "");
    setFilteredOptions([]);
  };

  return (
    <div className="autocomplete-container">
      <span>{label}</span>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type to search..."
        className="autocomplete-input"
      />
      <ul className="autocomplete-options">
        {filteredOptions.map((option) => (
          <li
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            className="autocomplete-option"
          >
            {option.label}
          </li>
        ))}
      </ul>
      {selectedItem && (
        <div className="selected-item">
          Selected Item: {selectedItem.label} (ID: {selectedItem.id})
        </div>
      )}
    </div>
  );
};
