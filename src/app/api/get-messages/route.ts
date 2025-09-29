import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]/options';


export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    console.log(`[GET-MESSAGES] Fetching messages for user: ${userId}`);
    
    // First check if user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      console.log(`[GET-MESSAGES] User not found: ${userId}`);
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    console.log(`[GET-MESSAGES] User found: ${userExists.username}, messages count: ${userExists.messages?.length || 0}`);

    // Get user with messages, handling empty messages array properly
    const user = await UserModel.findById(userId).select('messages username');
    
    // Sort messages by createdAt in descending order (newest first)
    const messages = user?.messages || [];
    messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[GET-MESSAGES] Returning ${messages.length} messages for user: ${user?.username}`);

    return Response.json(
      { 
        messages: messages,
        success: true,
        debug: {
          userId: userId.toString(),
          username: user?.username,
          messageCount: messages.length
        }
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}