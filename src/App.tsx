// Build single Square
// Build the board
import { create } from 'zustand'
import { combine} from 'zustand/middleware'

function Square({ value, onSquareClick }: { value: string; onSquareClick?: () => void }) {
  return (
    <button
      className="inline-flex items-center justify-center p-0 bg-white border border-gray-500 outline-0 rounded-none text-base font-bold"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

const useGameStore = create(
  combine({ squares: Array(9).fill(null), xIsNext: true}, (set) => {
    return {
      setSquares: (nextSquares: any) => {
        set((state: { squares: any[] }) => {
          return {
            squares:
              typeof nextSquares === 'function'
                ? nextSquares(state.squares)
                : nextSquares,
          }
        })
      },
      setXIsNext: (nextXIsNext: Function) => {
        set((state: {squares: any[], xIsNext: boolean}) => {
            return {
              xIsNext:
                typeof nextXIsNext === 'function'
                  ? nextXIsNext(state.xIsNext)
                  : nextXIsNext,
            }
          })
      }
    }
  })
)

function calculateWinner(squares: any[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateTurns(squares: any) {
  return squares.filter((square: any) => square === null).length;
}

function calculateStatus(winner: number | null, turns: number | null, player: string) {
  if (!winner && !turns) return 'Draw';
  if (winner) return `Winner: ${winner}`;
  return `Next player: ${player}`;
}

export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext);
  const setXIsNext = useGameStore((state) => state.setXIsNext);
  const squares = useGameStore((state) => state.squares);
  const setSquares = useGameStore((state) => state.setSquares);
  const player = xIsNext ? "X" : "O";
  const winner = calculateWinner(squares);
  const turns = calculateTurns(squares);
  const status = calculateStatus(winner, turns, player);

  function handleClick(i: number) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = player;
    setSquares(nextSquares);
    setXIsNext((xIsNext: boolean) => !xIsNext);
  }
  return (
    <>
      <div className="text-center text-2xl font-bold">{status}</div>
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="grid grid-cols-3 grid-rows-3 w-[7.5rem] h-[7.5rem] border border-gray-500">
          {squares.map((square, squareIndex) => (
            <Square key={squareIndex} value={square} onSquareClick={() => handleClick(squareIndex)} />
          ))}
        </div>
      </div>
    </>
  )
}

function nextXIsNext(xIsNext: any) {
  throw new Error('Function not implemented.');
}
