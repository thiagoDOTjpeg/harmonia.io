-- Drop a view se já existir
DROP VIEW IF EXISTS "public"."user_summary" CASCADE;

-- Criar a view user_summary
CREATE OR REPLACE VIEW "public"."user_summary" AS
SELECT 
    u.id AS user_id,
    u.email,
    u.name,
    u.created_at AS user_created_at,
    
    -- Conexões de serviços
    EXISTS(
        SELECT 1 FROM services_connections sc 
        WHERE sc.user_id = u.id 
        AND sc.provider = 'spotify'
        AND sc.expires_at > NOW()
    ) AS is_spotify_connected,
    
    EXISTS(
        SELECT 1 FROM services_connections sc 
        WHERE sc.user_id = u.id 
        AND sc.provider = 'google'
        AND sc.expires_at > NOW()
    ) AS is_youtube_connected,
    
    -- Total de playlists
    COALESCE(
        (SELECT COUNT(*) FROM synced_playlists p WHERE p.user_id = u.id),
        0
    ) AS total_playlists,
    
    -- Playlists sincronizadas (que tiveram última sincronização)
    COALESCE(
        (SELECT COUNT(*) 
         FROM synced_playlists p
         WHERE p.user_id = u.id 
         AND p.last_synced_at IS NOT NULL),
        0
    ) AS synced_playlists,
    
    -- Total de músicas únicas
    COALESCE(
        (SELECT COUNT(DISTINCT pt.track_id)
         FROM synced_playlists p
         INNER JOIN playlist_tracks pt ON pt.playlist_id = p.id
         WHERE p.user_id = u.id),
        0
    ) AS total_songs,
    
    -- Músicas sincronizadas (tracks que têm spotify_track_id vinculado)
    COALESCE(
        (SELECT COUNT(DISTINCT t.id)
         FROM synced_playlists p
         INNER JOIN playlist_tracks pt ON pt.playlist_id = p.id
         INNER JOIN tracks t ON t.id = pt.track_id
         WHERE p.user_id = u.id
         AND t.spotify_track_id IS NOT NULL),
        0
    ) AS synced_songs,
    
    -- Última sincronização
    (SELECT MAX(p.last_synced_at)
     FROM synced_playlists p
     WHERE p.user_id = u.id) AS last_sync_at,
    
    -- Últimas 3 playlists sincronizadas (como JSON array) - alinhado com RecentSync
    (SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', p.id,
                'name', COALESCE(p.spotify_title, p.youtube_title),
                'source_platform', 
                    CASE 
                        WHEN p.youtube_playlist_id IS NOT NULL THEN 'youtube'
                        ELSE 'spotify'
                    END,
                'target_platform',
                    CASE 
                        WHEN p.spotify_playlist_id IS NOT NULL THEN 'spotify'
                        ELSE 'youtube'
                    END,
                'songs_count', (
                    SELECT COUNT(*) 
                    FROM playlist_tracks pt 
                    WHERE pt.playlist_id = p.id
                ),
                'last_synced_at', p.last_synced_at,
                'status', p.sync_status
            )
            ORDER BY p.last_synced_at DESC
        ),
        '[]'::json
    )
     FROM (
         SELECT 
             p.id, 
             p.youtube_title,
             p.spotify_title,
             p.youtube_playlist_id,
             p.spotify_playlist_id,
             p.last_synced_at,
             p.sync_status
         FROM synced_playlists p
         WHERE p.user_id = u.id
         AND p.last_synced_at IS NOT NULL
         ORDER BY p.last_synced_at DESC
         LIMIT 3
     ) p
    ) AS recent_syncs
    
FROM users u;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_services_connections_user_provider 
ON services_connections(user_id, provider, expires_at);

CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist 
ON playlist_tracks(playlist_id, track_id);

CREATE INDEX IF NOT EXISTS idx_synced_playlists_user 
ON synced_playlists(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_synced_playlists_last_sync 
ON synced_playlists(user_id, last_synced_at);