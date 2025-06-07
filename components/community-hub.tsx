"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, Send, Heart, Reply, Pin, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  replies: number
  likes: number
  tags: string[]
  pinned?: boolean
}

interface ChatMessage {
  id: string
  author: string
  content: string
  timestamp: string
  type: "message" | "system"
}

export function CommunityHub() {
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "Best practices for wallet flow optimization",
      content: "I've been working on optimizing my wallet flows and wanted to share some insights...",
      author: "SolDev123",
      timestamp: "2 hours ago",
      replies: 12,
      likes: 24,
      tags: ["optimization", "wallet", "best-practices"],
      pinned: true,
    },
    {
      id: "2",
      title: "Groq AI suggestions for memecoin trading",
      content: "Has anyone tried using the Groq AI assistant for memecoin strategies?",
      author: "CryptoTrader",
      timestamp: "4 hours ago",
      replies: 8,
      likes: 15,
      tags: ["groq-ai", "memecoin", "trading"],
    },
    {
      id: "3",
      title: "JSON contract templates for game development",
      content: "Looking for community-created templates for game reward systems...",
      author: "GameBuilder",
      timestamp: "1 day ago",
      replies: 5,
      likes: 9,
      tags: ["json", "contracts", "gaming"],
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      author: "System",
      content: "Welcome to the Solana AI Builder community chat!",
      timestamp: "10:00 AM",
      type: "system",
    },
    {
      id: "2",
      author: "DevMaster",
      content: "Anyone working on arbitrage flows today?",
      timestamp: "10:15 AM",
      type: "message",
    },
    {
      id: "3",
      author: "SolanaFan",
      content: "Just deployed my first automated trading flow! 🚀",
      timestamp: "10:20 AM",
      type: "message",
    },
  ])

  const { toast } = useToast()

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: "You",
      timestamp: "Just now",
      replies: 0,
      likes: 0,
      tags: ["discussion"],
    }

    setForumPosts((prev) => [newPost, ...prev])
    setNewPostTitle("")
    setNewPostContent("")

    toast({
      title: "Post Created",
      description: "Your forum post has been published",
    })
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      author: "You",
      content: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "message",
    }

    setChatMessages((prev) => [...prev, newMessage])
    setChatMessage("")
  }

  const handleLikePost = (postId: string) => {
    setForumPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Community Hub</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              1,247 Online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="forum" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forum" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Forum</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Live Chat</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forum" className="space-y-6">
              {/* Create New Post */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Share your thoughts, questions, or insights..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        discussion
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        help
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        showcase
                      </Badge>
                    </div>
                    <Button onClick={handleCreatePost}>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Forum Posts */}
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <Card key={post.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-2">
                            {post.pinned && <Pin className="h-4 w-4 text-blue-500" />}
                            <h3 className="font-medium text-lg">{post.title}</h3>
                          </div>

                          <p className="text-gray-600">{post.content}</p>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.timestamp}</span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-4">
                              <Button size="sm" variant="outline" onClick={() => handleLikePost(post.id)}>
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button size="sm" variant="outline">
                                <Reply className="h-4 w-4 mr-1" />
                                {post.replies}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Live Community Chat</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${message.type === "system" ? "justify-center" : ""}`}
                      >
                        {message.type === "system" ? (
                          <div className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              {message.content}
                            </Badge>
                          </div>
                        ) : (
                          <>
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {message.author.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{message.author}</span>
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
