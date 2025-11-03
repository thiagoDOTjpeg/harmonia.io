"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

export default function NovaPage() {
  const [url, setUrl] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const [syncType, setSyncType] = useState("manual")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ url, playlistName, syncType })
    // Simulate sync
    alert("Sincronização iniciada!")
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nova Sincronização</h1>
        <p className="text-muted-foreground mt-1">
          Adicione uma nova playlist do YouTube para sincronizar com o Spotify
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Configurar Sincronização</CardTitle>
          <CardDescription>Cole a URL da playlist do YouTube que você deseja sincronizar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">URL da Playlist do YouTube</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.youtube.com/playlist?list=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">Cole o link completo da playlist pública do YouTube</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome da Playlist no Spotify (opcional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Deixe em branco para usar o nome original"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Tipo de Sincronização</Label>
              <RadioGroup value={syncType} onValueChange={setSyncType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="font-normal cursor-pointer">
                    Manual - Sincronizar apenas quando solicitado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="automatic" id="automatic" />
                  <Label htmlFor="automatic" className="font-normal cursor-pointer">
                    Automática - Sincronizar automaticamente a cada 24 horas
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">
                A sincronização automática está disponível nos planos Pro e Premium
              </p>
            </div>

            <Button type="submit" className="w-full">
              Iniciar Sincronização
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
