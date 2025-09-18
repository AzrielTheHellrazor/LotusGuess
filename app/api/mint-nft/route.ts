import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, flower, description, userAddress, timestamp } = body;

    // Validate required fields
    if (!question || !answer || !flower || !userAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate NFT metadata
    const metadata = {
      name: `LotusGuess Decision: ${answer}`,
      description: `A decision made with flowers 🌸\n\nQuestion: ${question}\nAnswer: ${answer}\nChosen Flower: ${flower}\nMeaning: ${description}`,
      image: generateNFTImageUrl({ question, answer, flower, description }),
      attributes: [
        {
          trait_type: "Question",
          value: question
        },
        {
          trait_type: "Answer", 
          value: answer
        },
        {
          trait_type: "Flower",
          value: flower
        },
        {
          trait_type: "Flower Meaning",
          value: description
        },
        {
          trait_type: "Decision Date",
          value: new Date(timestamp).toLocaleDateString()
        }
      ],
      external_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}`,
      created_by: "LotusGuess",
      created_at: timestamp
    };

    // TODO: Integrate with NFTFactory contract
    // For now, return mock response
    const mockTokenId = Math.floor(Math.random() * 1000000);
    const tokenUri = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/nft-metadata/${mockTokenId}`;

    // Store metadata temporarily (in production, use proper storage)
    // This would be replaced with actual contract minting

    return NextResponse.json({
      success: true,
      tokenId: mockTokenId,
      tokenUri,
      metadata,
      transactionHash: "0x" + Math.random().toString(16).substring(2, 66), // Mock hash
      message: "NFT minted successfully!"
    });

  } catch (error) {
    console.error("NFT minting error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Generate NFT image URL (this would create an actual image in production)
function generateNFTImageUrl({ question, answer, flower, description }: {
  question: string;
  answer: string;
  flower: string;
  description: string;
}) {
  // This would generate an actual image with the question and answer
  // For now, return a placeholder that includes the data
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    question: question.substring(0, 100),
    answer,
    flower,
    description
  });
  
  return `${baseUrl}/api/generate-nft-image?${params.toString()}`;
}
