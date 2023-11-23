import React, { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DifficultyContext, OpponentContext } from "../../Contexts/GameContext";

export default function Dropdown({ label }) {
  const { opponent, setOpponent } = useContext(OpponentContext);
  const { difficulty, setDifficulty } = useContext(DifficultyContext);

  // Đặt đối thủ mặc định là "Máy" (AI)
  useEffect(() => {
    setOpponent("AI");
  }, []);

  const handleOpponentChange = (event) => {
    setOpponent(event.target.value);

    if (event.target.value === "Human") {
      setDifficulty("");
    }
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  let select = null;

  if (label === "opponent") {
    select = (
      <Select
        labelId="opponent-dropDown"
        id="demo-simple-select-opponent"
        value={opponent}
        label="Opponent"
        onChange={handleOpponentChange}
      >
        <MenuItem value="AI">Máy</MenuItem>
        {/* <MenuItem value="Human">Người</MenuItem> */}
      </Select>
    );
  } else {
    select = (
      <Select
        labelId="difficulty-dropDown"
        id="demo-simple-select-difficulty"
        value={difficulty}
        label="Difficulty"
        onChange={handleDifficultyChange}
        disabled={opponent === "người"}
      >
        <MenuItem value={1}>Dễ</MenuItem>
        <MenuItem value={2}>Trung bình</MenuItem>
        <MenuItem value={3}>Khó</MenuItem>
      </Select>
    );
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {label === "opponent" ? "Đối thủ" : "Độ khó"}
        </InputLabel>
        {select}
      </FormControl>
    </Box>
  );
}

