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

  const generateShareImage = async (): Promise<string> => {
    // Create canvas for image generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !selectedFlower) return '';

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffeef8');
    gradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#e91e63';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🌸 LotusGuess Decision 🌸', canvas.width / 2, 80);

    // Question background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const x = 50;
    const y = 120;
    const width = canvas.width - 100;
    const height = 100;
    const radius = 20;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    // Question text
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.fillText(`"${question}"`, canvas.width / 2, 160);

    // Flower emoji (large)
    ctx.font = '120px Arial';
    ctx.fillText(selectedFlower.name.split(' ')[0], canvas.width / 2, 280);

    // Answer
    ctx.fillStyle = '#e91e63';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`Answer: ${selectedFlower.meaning}`, canvas.width / 2, 340);

    // Flower name and description
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    ctx.fillText(`${selectedFlower.name.split(' ')[1]} - ${selectedFlower.description}`, canvas.width / 2, 380);

    // App info
    ctx.fillStyle = '#999';
    ctx.font = '16px Arial';
    ctx.fillText('Made with LotusGuess - Try it yourself!', canvas.width / 2, 450);

    return canvas.toDataURL('image/png');
  };

  const shareQuestion = async () => {
    if (!selectedFlower) return;
    
    setIsMinting(true);
    try {
      // Generate share image
      const imageDataUrl = await generateShareImage();
      
      // Create share text for Farcaster
      const shareText = `🌸 LotusGuess Decision 🌸\n\n"${question}"\n\nMy answer: ${selectedFlower.meaning}\nFlower: ${selectedFlower.name}\n\nMade my decision with flowers! Try LotusGuess for your choices too! 🌺\n\n${window.location.origin}`;
      
      // Convert image to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Try to share with image using Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'lotusguess-decision.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'lotusguess-decision.png', { type: 'image/png' });
        await navigator.share({
          title: 'My LotusGuess Decision',
          text: shareText,
          files: [file]
        });
      } else {
        // Fallback: open Warpcast compose with text only
        await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`);
      }
      
      setMintedNftUrl('shared'); // Mark as shared
      console.log('Question shared on Farcaster successfully');
    } catch (error) {
      console.error('Farcaster sharing failed:', error);
      // Fallback: copy to clipboard
      try {
        const shareText = `🌸 LotusGuess Decision 🌸\n\n"${question}"\n\nMy answer: ${selectedFlower.meaning}\nFlower: ${selectedFlower.name}\n\nMade my decision with flowers! Try LotusGuess for your choices too! 🌺\n\n${window.location.origin}`;
        await navigator.clipboard.writeText(shareText);
        alert('Decision copied to clipboard! You can paste it anywhere to share! 📋');
        setMintedNftUrl('shared');
      } catch {
        alert('Sharing failed. Please try again.');
      }
    } finally {
      setIsMinting(false);
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
                  <div className={styles.buttonGroup}>
                    <button 
                      className={styles.mintButton} 
                      onClick={shareQuestion}
                      disabled={isMinting}
                    >
                      {isMinting ? '🔄 Sharing...' : '📢 Share Your Question'}
                    </button>
                    <button className={styles.resetButton} onClick={resetGame}>
                      🌱 Ask New Question
                    </button>
                  </div>
                </>
              ) : (
                <>
                <div className={styles.nftSuccess}>
                  <p className={styles.successText}>✅ Decision Shared Successfully!</p>
                </div>
                <button className={styles.resetButton} onClick={resetGame}>
                🔄 Return
              </button>
              </>
              )}
              
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
