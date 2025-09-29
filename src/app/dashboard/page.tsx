"use client"

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Settings, Trash2, Copy, Share2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useProtectedRoute } from "@/hooks/useAuthRedirect";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // Protect this route - redirect if not authenticated
  const { session: protectedSession, status: protectedStatus } = useProtectedRoute();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      console.log('[DASHBOARD] Fetching messages...');
      const response = await axios.get('/api/get-messages');
      console.log('[DASHBOARD] Messages response:', response.data);
      
      const messages = response.data.messages || [];
      setMessages(messages);
      
      console.log(`[DASHBOARD] Set ${messages.length} messages in state`);
    } catch (error: any) {
      console.error("[DASHBOARD] Failed to fetch messages:", error);
      
      // Only show error toast for actual server errors, not for empty message arrays
      if (error.response?.status !== 200) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch messages",
          variant: "destructive",
        });
      }
      // Set empty array as fallback
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchAcceptingStatus = useCallback(async () => {
    try {
      const response = await axios.get('/api/accept-messages');
      setIsAcceptingMessages(response.data.isAcceptingMessages);
    } catch (error) {
      console.error("Failed to fetch accepting status");
    }
  }, []);

  useEffect(() => {
    if (protectedStatus === "loading") return;
    if (!protectedSession) return; // Will be redirected by useProtectedRoute
    
    fetchMessages();
    fetchAcceptingStatus();
  }, [protectedSession, protectedStatus, fetchMessages, fetchAcceptingStatus]);
  
  // Show loading while checking authentication
  if (protectedStatus === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  

  const handleToggleAcceptingMessages = async () => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptMessages: !isAcceptingMessages,
      });
      setIsAcceptingMessages(!isAcceptingMessages);
      toast({
        title: "Settings Updated",
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`/api/delete-message/${messageId}`);
      setMessages(messages.filter(msg => msg._id !== messageId));
      toast({
        title: "Message Deleted",
        description: "Message has been removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setIsRefreshing(false);
  };

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/send?to=${session?.user?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied!",
      description: "Your profile link has been copied to clipboard",
    });
  };

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/send?to=${session?.user?.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Send me an anonymous message',
          text: 'Send me an anonymous message on MysteryMsg',
          url: profileUrl,
        });
      } catch (error) {
        copyProfileLink();
      }
    } else {
      copyProfileLink();
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="flex justify-between items-center p-4 lg:px-8 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/home/mystrymsgs.png" alt="MysteryMsg" width={24} height={24} />
          <span className="text-xl font-bold text-black">MysteryMsg</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className="text-black">Welcome, {session?.user?.username}</span>
          <Link href="/send">
            <Button
              variant="outline"
              className="border-gray-300 text-black hover:bg-gray-100"
            >
              Send Message
            </Button>
          </Link>
          <Button
            onClick={() => router.push('/signout')}
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-100"
          >
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-lg text-gray-700">Manage your anonymous messages and settings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Card className="bg-gray-100 border-gray-200 text-black">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-black" />
                    <span>Total Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">{messages.length}</div>
                  <p className="text-sm text-gray-600">Anonymous messages received</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-gray-100 border-gray-200 text-black">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-black" />
                    <span>Message Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accept Messages</span>
                    <Switch
                      checked={isAcceptingMessages}
                      onCheckedChange={handleToggleAcceptingMessages}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {isAcceptingMessages ? "Currently accepting" : "Not accepting"} new messages
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-gray-100 border-gray-200 text-black">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-black" />
                    <span>Share Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={copyProfileLink}
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 text-black hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={shareProfile}
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 text-black hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-black" />
                <span>Your Messages</span>
              </h2>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="border-gray-300 text-black hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {messages.length === 0 ? (
              <Card className="bg-gray-100 border-gray-200 text-black">
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                  <p className="text-gray-600 mb-6">
                    Share your profile link to start receiving anonymous messages
                  </p>
                  <Button
                    onClick={shareProfile}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Your Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {messages.map((message) => (
                  <div key={message._id}>
                    <Card className="bg-white border-gray-200 text-black">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-gray-700 mb-3 leading-relaxed">
                              {message.content}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteMessage(message._id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-100 ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
