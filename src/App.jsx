import { languages } from "./languages"
import LanguageChip from "./LanguageChip"
import { useState, useEffect } from "react"
import clsx from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"
export default function App() {
  //state values
  const [currentWord, setCurrentWord] = useState(getRandomWord)
  const [guessedLetters, setGuessedLetters] = useState([])


  //derived static values

  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  const numGuessesLeft = (languages.length - 1) - wrongGuessCount
  const alphabets = "abcdefghijklmnopqrstuvwxyz"
  const languageChipElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const className = clsx("language-chip", isLanguageLost && "lost")
    return (
      <LanguageChip
        key={lang.name}
        name={lang.name}
        backgroundColor={lang.backgroundColor}
        color={lang.color}
        className={className}
      />
    )

  })

  const wordElement = Array.from(currentWord).map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClass = clsx(
      "letter",
      {
        "not-guessed": isGameLost && !guessedLetters.includes(letter)
      }
    )
    return (
      <span className={letterClass} key={index}>
        {shouldRevealLetter && letter.toUpperCase()}
      </span>
    )
  })



  const keyboardButtons = alphabets.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        className={className}
        key={letter}
        onClick={() => addToGuesses(letter)}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >{letter.toUpperCase()}</button>
    )
  })

  function addToGuesses(letter) {
    setGuessedLetters(currLetters => (
      currLetters.includes(letter) ?
        currLetters :
        [...currLetters, letter]
    ))
  }
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function startNewGame() {
    setCurrentWord(getRandomWord)
    setGuessedLetters([])
  }
  return (
    <main>
      {isGameWon &&
      <Confetti 
      width={window.innerWidth}
      height={window.innerHeight}
      />}
      <header>
        <h1 className="game-title">Assembly: Endgame</h1>
        <p className="game-instructions">Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section
        className={gameStatusClass}
        aria-live="polite"
        role="status"
      >
        {isGameWon &&
          <>
            <h2>You Win!</h2>
            <p>Well Done! 🎉</p>
          </>}
        {isGameLost &&
          <>
            <h2>Game Over!</h2>
            <p>You lose! Better start learning Assembly 😭</p>
          </>
        }
        {!isGameOver && isLastGuessIncorrect &&
          <p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
        }
      </section>
      <section className="languages-container">
        {languageChipElements}
      </section>
      <section className="word-display">
        {wordElement}
      </section>
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuessedLetter) ?
            `Correct the letter ${lastGuessedLetter} is in the word` :
            `Sorry, the letter ${lastGuessedLetter} is not in the word`
          }
          You have {numGuessesLeft} attempts left
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank."
        ).join(" ")}</p>
      </section>
      <section className="keyboard">
        {keyboardButtons}
      </section>
      {isGameOver &&
        <button
          className="new-game"
          onClick={startNewGame}
        >New Game</button>}

    </main>
  )
}


