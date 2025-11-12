import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music2, Play, Pause, Trash2, Settings } from "lucide-react"

const playlists = [
  {
    id: 1,
    name: "Músicas Favoritas 2024",
    songs: 45,
    status: "active",
    lastSync: "2 horas atrás",
    syncType: "Automática",
  },
  {
    id: 2,
    name: "Workout Mix",
    songs: 32,
    status: "active",
    lastSync: "1 dia atrás",
    syncType: "Automática",
  },
  {
    id: 3,
    name: "Chill Vibes",
    songs: 28,
    status: "paused",
    lastSync: "3 dias atrás",
    syncType: "Manual",
  },
]

export default function PlaylistsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Playlists</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas playlists sincronizadas</p>
        </div>
        <Button>
          <Music2 className="mr-2 h-4 w-4" />
          Nova Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Music2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{playlist.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {playlist.songs} músicas • Última sincronização: {playlist.lastSync}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={playlist.status === "active" ? "default" : "secondary"}>
                        {playlist.status === "active" ? "Ativa" : "Pausada"}
                      </Badge>
                      <Badge variant="outline">{playlist.syncType}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    {playlist.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
