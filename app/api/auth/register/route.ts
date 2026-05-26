import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models';
import { connectionPromise } from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectionPromise;

    const body = await request.json();
    const { 
      fullName, 
      sport, 
      position, 
      experienceLevel, 
      email, 
      password,
      bio,
      team,
      trainingFrequency,
      goals,
      age,
      height,
      weight
    } = body;

    if (!fullName || !sport || !position || !experienceLevel || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      fullName,
      sport,
      position,
      experienceLevel,
      email,
      password: hashedPassword,
      bio,
      team,
      trainingFrequency,
      goals,
      age,
      height,
      weight,
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email);

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          fullName: user.fullName,
          sport: user.sport,
          position: user.position,
          experienceLevel: user.experienceLevel,
          email: user.email,
          bio: user.bio,
          team: user.team,
          trainingFrequency: user.trainingFrequency,
          goals: user.goals,
          age: user.age,
          height: user.height,
          weight: user.weight,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
