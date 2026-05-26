import { NextRequest, NextResponse } from 'next/server';
import { Chat, Session, User } from '@/lib/models';
import { connectionPromise } from '@/lib/mongodb';
import { chatAboutSession } from '@/lib/gemini';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectionPromise;

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Session ID and message required' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const session = await Session.findOne({
      _id: sessionId,
      userId: decoded.userId,
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get or create chat document
    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = new Chat({
        sessionId,
        userId: decoded.userId,
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get user context
    const user = await User.findById(decoded.userId);

    // Get AI response
    const aiResponse = await chatAboutSession(message, {
      sport: user?.sport || 'General',
      position: user?.position || 'Player',
      experienceLevel: user?.experienceLevel || 'Intermediate',
    }, session.feedback, chat.messages);

    // Add assistant message
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    chat.updatedAt = new Date();
    await chat.save();

    return NextResponse.json({
      message: aiResponse,
      history: chat.messages,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
