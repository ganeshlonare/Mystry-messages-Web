import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(request:Request) {
    await dbConnect()
    try {
        const { searchParams } =new URL(request.url) //this is use to get the url after hitting this api

        const queryParams={
            username:searchParams.get('username') //getting username through the url
        }
        const result=UsernameQuerySchema.safeParse(queryParams)
        console.log(result) 

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            console.log(result)
            return Response.json({
                success:false,
                message:"Invalid username",
            },{status:400})
        }

        const {username} = result.data
        const existingVerifiedUser=await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username already exists",
            })
        }

        return Response.json({
            success:true,
            message:"Username is available",
        })

    } catch (error) {
        console.log("Error while checking username")
        console.log(error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}