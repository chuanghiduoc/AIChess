export const getAvailableSquares = (game, sourceSquare) => {
    const availableMoves = game.moves({ square: sourceSquare });
  
    const squares = [];
    for (let square of availableMoves) {
      // bỏ qua việc nhập thành phía vua hoặc hoàng hậu
      if (square === "O-O" || square === "O-O-O") {
        continue;
      } else if (square.length === 3 && !square.endsWith("#")) {
        // nếu quân Tốt đưa séc mà không ăn quân
        if (square.endsWith("+")) {
          square = square.substr(0, 2);
        }
        // di chuyển thường xuyên cho các quân cờ không phải là quân tốt
        else {
          square = square.substr(1);
        }
      } else if (
        square.length === 4 &&
        !square.endsWith("#") &&
        !square.includes("=")
      ) {
        // nếu một quân không phải là quân tốt đưa séc mà không bắt được một quân
        if (square.endsWith("+")) {
          square = square.substr(1, 2);
        }
        // nếu một quân có thể bắt được một quân khác
        else {
          square = square.substr(2);
        }
      }
      // nếu một quân có thể kiểm tra bằng cách bắt một quân khác
      else if (
        square.length === 5 &&
        !square.endsWith("#") &&
        !square.includes("=")
      ) {
        square = square.substr(2, 2);
      }
      // nếu con tốt đi đến hàng thứ 8 và đổi thành thứ khác
      else if (square.includes("=")) {
        // console.log(square);
        square = square.split("=")[0].slice(-2);
      }
      // chiếu tướng
      else if (square.endsWith("#")) {
        square = square.slice(-3).substring(0, 2);
      }
  
      // vì lý do nào đó nếu không tìm thấy hình vuông thì hãy bỏ qua nó
      if (!document.querySelector(`[data-square="${square}"]`)) {
        continue;
      }
  
      squares.push(document.querySelector(`[data-square="${square}"]`));
    }
  
    return squares;
  };
  
  // lấy hình vuông nơi có một số phần nhất định
  const getPiecePositions = (game, piece) => {
    return []
      .concat(...game.board())
      .map((p, index) => {
        if (p !== null && p.type === piece.type && p.color === piece.color) {
          return index;
        }
      })
      .filter(Number.isInteger)
      .map((pieceIndex) => {
        const row = "abcdefgh"[pieceIndex % 8];
        const column = Math.ceil((64 - pieceIndex) / 8);
        return row + column;
      });
  };
  
  // nếu vua bị chiếu thì tô màu hình vuông đó
  export const isInCheck = (game, inCheck, setInCheck, classes) => {
    const blackKing = { type: "k", color: "b" };
    const whiteKing = { type: "k", color: "w" };
  
    const kingSquareWhite = getPiecePositions(game, whiteKing)[0];
    const kingSquareBlack = getPiecePositions(game, blackKing)[0];
  
    const squareElementWhiteKing = document.querySelector(
      `[data-square="${kingSquareWhite}"]`
    );
    const squareElementBlackKing = document.querySelector(
      `[data-square="${kingSquareBlack}"]`
    );
  
    const turn = game.turn();
  
    if (game.in_check()) {
      setInCheck({
        ...inCheck,
        element: turn === "b" ? squareElementBlackKing : squareElementWhiteKing,
        value: true,
      });
    } else if (!game.in_check()) {
      const prevCheckSquare = document.querySelector(`.${classes.inCheck}`);
  
      setInCheck({
        ...inCheck,
        element: prevCheckSquare,
        value: false,
      });
    }
  };
  