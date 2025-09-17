"use client";
import { useState, useEffect } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";

// Flower types and meanings
const FLOWERS = [
  { name: "🌹 Rose", meaning: "Yes", description: "Love and passion" },
  { name: "🌻 Sunflower", meaning: "No", description: "Joy and positivity" },
  { name: "🌸 Cherry Blossom", meaning: "Maybe", description: "Transience and beauty" },
  { name: "🌺 Hibiscus", meaning: "Absolutely", description: "Courage and strength" },
  { name: "🌷 Tulip", meaning: "Later", description: "Perfect love" },
  { name: "🌼 Daisy", meaning: "Not now", description: "Purity and innocence" },
  { name: "💐 Bouquet", meaning: "Try everything", description: "Diversity" },
  { name: "🌿 Leaf", meaning: "Leave it to nature", description: "Growth and renewal" }
];

// Function to analyze question type
function analyzeQuestion(question: string): number {
  const lowerQuestion = question.toLowerCase();
  
  // Yes/No questions get 2 flowers
  if (lowerQuestion.includes('should') || lowerQuestion.includes('will') || 
      lowerQuestion.includes('can') || lowerQuestion.includes('do') ||
      lowerQuestion.includes('yes') || lowerQuestion.includes('no') ||
      lowerQuestion.includes('?') && (lowerQuestion.includes('i ') || lowerQuestion.includes('we '))) {
    return 2;
  }
  
  // Questions with "or" get number based on options
  const orCount = (lowerQuestion.match(/\bor\b/g) || []).length;
  if (orCount > 0) {
    return Math.min(orCount + 1, 6);
  }
  
  // General questions get 3-4 flowers
  return Math.floor(Math.random() * 2) + 3;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [flowers, setFlowers] = useState<typeof FLOWERS>([]);
  const [selectedFlower, setSelectedFlower] = useState<typeof FLOWERS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Call ready() when component mounts to hide splash screen
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
      }
    };
    
    initializeApp();
  }, []);

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    const flowerCount = analyzeQuestion(question);
    const shuffledFlowers = [...FLOWERS].sort(() => Math.random() - 0.5);
    const selectedFlowers = shuffledFlowers.slice(0, flowerCount);
    
    setFlowers(selectedFlowers);
    setSelectedFlower(null);
    setShowResult(false);
  };

  const handleFlowerSelect = (flower: typeof FLOWERS[0]) => {
    setSelectedFlower(flower);
    setShowResult(true);
  };

  const resetGame = () => {
    setQuestion("");
    setFlowers([]);
    setSelectedFlower(null);
    setShowResult(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>🌸 LotusGuess</h1>
        <p className={styles.subtitle}>Enjoy making decisions with flowers</p>

        {!showResult && (
          <>
            <div className={styles.questionSection}>
              <textarea
                className={styles.questionInput}
                placeholder="Write the topic you're undecided about... (e.g., Should I go out today?)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
              />
              <button 
                className={styles.askButton}
                onClick={handleAskQuestion}
                disabled={!question.trim()}
              >
                🌺 Show Flowers
              </button>
            </div>

            {flowers.length > 0 && (
              <div className={styles.flowersSection}>
                <h3 className={styles.flowersTitle}>Which flower appeals to you more?</h3>
                <div className={styles.flowersGrid}>
                  {flowers.map((flower, index) => (
                    <button
                      key={index}
                      className={styles.flowerCard}
                      onClick={() => handleFlowerSelect(flower)}
                    >
                      <div className={styles.flowerIcon}>{flower.name.split(' ')[0]}</div>
                      <div className={styles.flowerName}>{flower.name.split(' ')[1]}</div>
                      <div className={styles.flowerDesc}>{flower.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {showResult && selectedFlower && (
          <div className={styles.resultSection}>
            <div className={styles.resultCard}>
              <div className={styles.resultFlower}>{selectedFlower.name.split(' ')[0]}</div>
              <h3 className={styles.resultTitle}>Your answer: {selectedFlower.meaning}</h3>
              <p className={styles.resultDescription}>
                You chose {selectedFlower.name.split(' ')[1]} - {selectedFlower.description}
              </p>
              <div className={styles.resultQuestion}>
                <strong>Your question:</strong> {question}
              </div>
            </div>
            <button className={styles.resetButton} onClick={resetGame}>
              🌱 Ask New Question
            </button>
          </div>
        )}

        {flowers.length === 0 && !question && (
          <div className={styles.welcomeSection}>
            <p className={styles.welcomeText}>
              When you are struggling to make choices, let flowers guide you! 
              Write your question, pick your flower, and make your decision.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
