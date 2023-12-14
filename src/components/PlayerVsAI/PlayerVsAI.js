import React, { useState, useEffect, useContext } from "react";
import classes from "../Chess.module.css";
import { Chessboard } from "react-chessboard";
import { getAvailableSquares, isInCheck } from "../../utils/utilityFunctions";
import { calculateBestMove } from "../../AI/minimax";
import {
  ChessboardRefContext,
  DifficultyContext,
  GameContext,
  ModalContext,
} from "../../Contexts/GameContext";

const PlayerVsAI = ({ boardWidth }) => {
  const chessboardRef = useContext(ChessboardRefContext);
  const { game, setGame } = useContext(GameContext);
  const { difficulty } = useContext(DifficultyContext);
  const { setOpenModal } = useContext(ModalContext);
  const [inCheck, setInCheck] = useState({ element: null, value: false });
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

  const checkWinCondition = () => {
    if (game.in_checkmate()) {
      const message =
        game.turn() === "w"
          ? "Bạn đã được kiểm tra!"
          : "Chúc mừng! Bạn đã thắng!";
      setOpenModal({ message, value: true });
    }
  };

  useEffect(() => {
    checkWinCondition();
  }, [game, setOpenModal]);

  const getRandomSeconds = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const makeAiMove = async () => {  
    let maxTimeInMs;
  
    switch (difficulty) {
      case 1:
        maxTimeInMs = getRandomSeconds(3, 10) * 1000;
        break;
      case 2:
        maxTimeInMs = getRandomSeconds(5, 15) * 1000;
        break;
      case 3:
        maxTimeInMs = getRandomSeconds(5, 999) * 1000;
        break;
      default:
        maxTimeInMs = getRandomSeconds(3, 10) * 1000;
        break;
    }

    try {
      const bestMove = await calculateBestMove(game, difficulty, maxTimeInMs);
      console.log("PlayAI = ", bestMove);
      if (game.game_over() || game.in_draw()) {
        return;
      }
  
      const gameCopy = { ...game };
      gameCopy.move(bestMove);
      setGame(gameCopy);
  
      isInCheck(gameCopy, inCheck, setInCheck, classes);
    } catch (error) {
      console.error("Lỗi trong quá trình tính toán:", error);
    }
  };
  

  function highlightAvailableMoves(piece, sourceSquare) {
    const squares = getAvailableSquares(game, sourceSquare);

    squares.forEach((square) => {
      square.classList.add(classes.highlight);
    });
  }

  function unhighlightAvailableMoves(piece, sourceSquare) {
    const squares = getAvailableSquares(game, sourceSquare);

    squares.forEach((square) => {
      square.classList.remove(classes.highlight);
    });
  }

  // nếu được kiểm tra, thay đổi màu hình vuông
  useEffect(() => {
    if (inCheck.element !== null) {
      if (inCheck.value) {
        inCheck.element.classList.add(classes.inCheck);
      } else {
        inCheck.element.classList.remove(classes.inCheck);
      }
    }
  }, [inCheck.value]);

  function onDrop(sourceSquare, targetSquare) {
    // bỏ đánh dấu sau di chuyển
    unhighlightAvailableMoves(null, sourceSquare);

    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    // vi phạm di chuyển
    if (move === null) return false;

    setGame(gameCopy);
    // nếu có => check
    isInCheck(game, inCheck, setInCheck, classes);

    // Hủy bỏ timeout trước khi tạo một timeout mới
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    // lưu time để undo
    const newTimeout = setTimeout(makeAiMove, 100);
    setCurrentTimeout(newTimeout);
    return true;
  }

  useEffect(() => {
    if (inCheck.element !== null) {
      const { element, value } = inCheck;
      value
        ? element.classList.add(classes.inCheck)
        : element.classList.remove(classes.inCheck);
    }
  }, [inCheck.value]);

  return (
    <div>
      <Chessboard
        id="PlayerVsAI"
        animationDuration={200}
        boardWidth={boardWidth}
        position={game.fen()}
        onPieceDrop={onDrop}
        onPieceDragBegin={highlightAvailableMoves}
        onPieceDragEnd={unhighlightAvailableMoves}
        ref={chessboardRef}
      />
    </div>
  );
};

export default PlayerVsAI;
