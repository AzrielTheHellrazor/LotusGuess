"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
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
  const [isMounted, setIsMounted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNftUrl, setMintedNftUrl] = useState<string | null>(null);
  
  // Wagmi hooks for wallet connection
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  
  // Debug wallet state
  useEffect(() => {
    console.log('Wallet state:', { isConnected, address, connectors: connectors.length });
  }, [isConnected, address, connectors]);

  // Call ready() when component mounts to hide splash screen
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await sdk.actions.ready();
        
        // Auto-connect wallet immediately
        try {
          if (connectors.length > 0 && !isConnected) {
            console.log('Auto-connecting wallet...');
            connect({ connector: connectors[0] });
          }
        } catch (error) {
          console.log('Auto-connect failed:', error);
        }
        
        setIsMounted(true);
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        setIsMounted(true);
      }
    };
    
    initializeApp();
  }, []);
  
  // Auto-connect when connectors become available
  useEffect(() => {
    if (connectors.length > 0 && !isConnected && isMounted) {
      console.log('Connectors available, auto-connecting...');
      connect({ connector: connectors[0] });
    }
  }, [connectors, isConnected, isMounted, connect]);

  // Error handler for wallet connection errors
  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      console.error("Wallet connection error:", event);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
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
    setMintedNftUrl(null);
  };

  const mintAsNFT = async () => {
    if (!selectedFlower || !address) return;
    
    setIsMinting(true);
    try {
      // Generate NFT metadata
      const nftData = {
        question,
        answer: selectedFlower.meaning,
        flower: selectedFlower.name,
        description: selectedFlower.description,
        userAddress: address,
        timestamp: new Date().toISOString()
      };

      // Call API to mint NFT
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nftData),
      });

      if (response.ok) {
        const result = await response.json();
        setMintedNftUrl(result.tokenUri);
        console.log('NFT minted successfully:', result);
      } else {
        throw new Error('Minting failed');
      }
    } catch (error) {
      console.error('NFT minting failed:', error);
      alert('NFT minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const shareOnFarcaster = () => {
    if (!mintedNftUrl) return;
    
    const shareText = `I just made a decision with flowers! 🌸\n\nQuestion: ${question}\nAnswer: ${selectedFlower?.meaning}\n\nMinted as NFT: ${mintedNftUrl}`;
    
    // Use Farcaster SDK to share
    try {
      sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`);
    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        {!isMounted ? (
          <div className={styles.connectBtn}>Loading...</div>
        ) : (
          <div className={styles.appInfo}>
            {isConnected && address && (
              <span className={styles.walletStatus}>
                💎 {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </div>
        )}
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
            <div className={styles.actionButtons}>
              {!mintedNftUrl ? (
                <>
                  <button 
                    className={styles.mintButton} 
                    onClick={mintAsNFT}
                    disabled={isMinting || !isConnected}
                  >
                    {isMinting ? '🔄 Minting...' : '🎨 Mint as NFT'}
                  </button>
                  {!isConnected && (
                    <p className={styles.connectHint}>Connect wallet to mint NFT</p>
                  )}
                </>
              ) : (
                <div className={styles.nftSuccess}>
                  <p className={styles.successText}>✅ NFT Minted Successfully!</p>
                  <button 
                    className={styles.shareButton}
                    onClick={shareOnFarcaster}
                  >
                    📢 Share on Farcaster
                  </button>
                </div>
              )}
              <button className={styles.resetButton} onClick={resetGame}>
                🌱 Ask New Question
              </button>
            </div>
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
