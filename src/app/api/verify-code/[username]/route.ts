import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  await dbConnect();

  try {
    const { code } = await request.json();
    const { username } = params; // 👈 here you get username
    const { success } = verifySchema.safeParse({ code });

    if (!success) {
      return Response.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({username});

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode == code;
    const isCodeNotExpired =
      new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { 
          success: true, 
          message: "User verified successfully",
          user: {
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
          }
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please sign up again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Verification code is invalid!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error checking verification code", error);
    return Response.json(
      { success: false, message: "Error checking verification code" },
      { status: 500 }
    );
  }
}
