import React, { useState, useEffect } from 'react';
import './App.css';

const cardValues = ["1", "2", "3", "4", "5", "1", "2", "3", "4", "5"];

function App() {
  const [cards, setCards] = useState([]);
  const [checkedCards, setCheckedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); // ゲーム開始フラグ
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(60);

  // スタートボタンが押されたらゲーム開始
  const startGame = () => {
    setGameStarted(true);
    setCards(shuffle([...cardValues]));
  }

  // カウントダウンタイマー
  useEffect(() => {
    if(gameStarted && countdown > 0 && !gameOver) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId); // クリーンアップ関数
    } else if (gameStarted && !gameOver && countdown === 0) {
      setGameOver(true);
      setMessage("ゲームオーバー");
    }
  }, [countdown, gameStarted, gameOver]);


  // カードが2枚選択されたときに一致チェック
  useEffect(() => {
    if(checkedCards.length === 2) {
      if(cards[checkedCards[0]] === cards[checkedCards[1]]) {
        setMatchedCards([...matchedCards, ...checkedCards]);
        setMessage("あたり");
        setCheckedCards([]);
      } else {
        setMessage("はずれ");
        setTimeout(() => {
          setCheckedCards([]);
        }, 1000);
      }
    }
  }, [checkedCards]);

  // 全てのカードが一致した場合の処理
  useEffect(() => {
    if(matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
      setMessage(`おめでとう！`);
    }
  }, [matchedCards, cards, countdown]);

  const handleClick = (index) => {
    if(checkedCards.length === 2 || gameOver || !gameStarted || checkedCards.includes(index)) return;
    setCheckedCards([...checkedCards, index]);
  }  

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <div className="App">
      <h1>神経衰弱ゲーム</h1>
      {!gameStarted ? (
        <button onClick={startGame}>スタート</button>
      ) : (
        <>
          <h2>{countdown}秒</h2>
          <h3>{message}</h3>
          <div className="cards">
            {cards.map((value, index) => (
              <div 
                className={`card ${checkedCards.includes(index) ? "checked" : ""} ${matchedCards.includes(index) ? "matched" : ""}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                {(checkedCards.includes(index) || matchedCards.includes(index)) && value}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
