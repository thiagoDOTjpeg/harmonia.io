import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

const history = [
  {
    id: 1,
    playlist: "Músicas Favoritas 2024",
    date: "2024-01-15 14:30",
    status: "success",
    songs: 45,
    duration: "2m 15s",
  },
  {
    id: 2,
    playlist: "Workout Mix",
    date: "2024-01-14 09:15",
    status: "success",
    songs: 32,
    duration: "1m 45s",
  },
  {
    id: 3,
    playlist: "Chill Vibes",
    date: "2024-01-12 18:20",
    status: "success",
    songs: 28,
    duration: "1m 30s",
  },
  {
    id: 4,
    playlist: "Party Hits",
    date: "2024-01-10 22:45",
    status: "failed",
    songs: 0,
    duration: "0s",
    error: "Playlist não encontrada",
  },
]

export default function HistoricoPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Histórico de Sincronias</h1>
        <p className="text-muted-foreground mt-1">Veja todas as suas sincronizações anteriores</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sincronizações Recentes</CardTitle>
          <CardDescription>Histórico completo das suas sincronizações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.status === "success" ? "bg-primary/10" : "bg-destructive/10"
                    }`}
                  >
                    {item.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.playlist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      {item.status === "success" && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">
                            {item.songs} músicas em {item.duration}
                          </p>
                        </>
                      )}
                      {item.error && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-destructive">{item.error}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant={item.status === "success" ? "default" : "destructive"}>
                  {item.status === "success" ? "Sucesso" : "Falhou"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
