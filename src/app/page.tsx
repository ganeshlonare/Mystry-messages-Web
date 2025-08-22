"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios'
import MarkdownRenderer from "@/markdown/MarkdownRenderer";

export default function Home() {
  const [value , setValue]=useState("")
  const [response , setResponse]=useState("")
  const [loading , setLoading]=useState(false)
  const handleClick=async ()=>{
    setLoading(true)
    const prompt=value
    const res=await axios.post('/api/suggest-messages', {prompt})
    const message=res.data.text
    console.log(message)
    setResponse(message)
    setLoading(false)
  }
  const handleChange=(e:any)=>{
    setValue(e.target.value)
  }
  return (
    <div className="bg-black text-white h-screen w-screen flex justify-center items-center flex-col gap-6">
      <input onChange={handleChange} value={value} type="text" placeholder="enter your prompt" className="h-fit p-2 rounded text-black"/>
      <Button onClick={handleClick}>{loading ? "Loading..." : "Generate"}</Button>
      <div className="flex flex-col gap-2">
        {
          loading ? <div className="text-center">Loading...</div> : <MarkdownRenderer content={response}/>
        }
      </div>
      
    </div>
  );
}