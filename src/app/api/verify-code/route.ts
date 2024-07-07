import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username,code} =await request.json()
        const {success}=verifySchema.safeParse({code})
        if(!success){
            return Response.json({
                success:false,
                message:"Invalid input"
            }, {status:400})
        }
        const decodedUsername=decodeURIComponent(username)
        // console.log(decodedUsername)

        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        
        const isCodeValid=user.verifyCode==code
        const isCodeNotExpired=new Date(user.VerifyCodeExpiry)>new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()
            return Response.json({
                success:true,
                message:"User verified successfully"
            },{status:200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"verification code is expired. please sign up again"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"verification code is Invalid!"
            },{status:400})
        }

    } catch (error) {
        console.log("Error checking verification code")
        console.log(error)
        return Response.json({
            success:false,
            message:"Error checking verification code"
        },{status:500})
    }
}