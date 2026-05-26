import { NextRequest, NextResponse } from 'next/server';
import { Session, User } from '@/lib/models';
import { connectionPromise } from '@/lib/mongodb';
import { analyzeImage } from '@/lib/gemini';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectionPromise;

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Get user context
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Analyze with Gemini
    const feedback = await analyzeImage(base64, {
      sport: user.sport,
      position: user.position,
      experienceLevel: user.experienceLevel,
    });

    // Create thumbnail (same image for now, in production would resize)
    const thumbnail = base64;

    // Save session
    const session = new Session({
      userId: user._id,
      imageUrl: `data:${imageFile.type};base64,${base64}`,
      thumbnail: `data:${imageFile.type};base64,${thumbnail}`,
      feedback: {
        overallScore: feedback.overallScore,
        strengths: feedback.strengths,
        areasToImprove: feedback.areasToImprove,
        priorityFix: feedback.priorityFix,
        drillSuggestion: feedback.drillSuggestion,
        confidenceLevel: feedback.confidenceLevel,
      },
    });

    await session.save();

    return NextResponse.json({
      session: {
        _id: session._id,
        imageUrl: session.imageUrl,
        thumbnail: session.thumbnail,
        feedback: session.feedback,
        uploadedAt: session.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
