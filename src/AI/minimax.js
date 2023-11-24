import { getPieceValue } from "./boardPositions";

// đánh giá minimax
const evaluateBoard = (board) => {
  let totalEvaluation = 0;
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      totalEvaluation += getPieceValue(piece, i, j);
    });
  });
  return totalEvaluation;
};

const minimax = (game, depth, alpha, beta, isMaximisingPlayer, startTime, maxTimeInMs) => {
  // Kiểm tra thời gian xử lý
  const currentTime = Date.now();
  if (currentTime - startTime >= maxTimeInMs) {
    return -evaluateBoard(game.board());
  }

  if (depth === 0) {
    return -evaluateBoard(game.board());
  }
  console.log("depth = ",depth);
  const possibleNextMoves = game.moves();

  if (isMaximisingPlayer) {
    let bestMove = -Infinity;
    for (const move of possibleNextMoves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, false);
      game.undo();

      bestMove = Math.max(bestMove, score);
      alpha = Math.max(alpha, bestMove);

      if (beta <= alpha) {
        break;
      }
    }
    return bestMove;
  } else {
    let bestMove = Infinity;
    for (const move of possibleNextMoves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, true);
      game.undo();

      bestMove = Math.min(bestMove, score);
      beta = Math.min(beta, bestMove);

      if (beta <= alpha) {
        break;
      }
    }
    return bestMove;
  }
};

// Hàm để trộn mảng ngẫu nhiên => giảm khó
const shuffleArray = (array) => {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateBestMove = (game, minimaxDepth, maxTimeInMs) => {
  console.log("maxTimeInMs = ", maxTimeInMs);
  const startTime = Date.now();
  const possibleNextMoves = game.moves();
  const shuffledMoves = shuffleArray(possibleNextMoves);
  
  let bestMove = -Infinity;
  let bestMoveFound;

  for (const move of shuffledMoves) {
    game.move(move);
    const value = minimax(game, minimaxDepth, -Infinity, Infinity, false, startTime, maxTimeInMs);
    game.undo();

    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = move;
    }

    // Kiểm tra xem đã hết thời gian chưa
    const currentTime = Date.now();
    if (currentTime - startTime >= maxTimeInMs) {
      break;
    }
  }
  return bestMoveFound;
};