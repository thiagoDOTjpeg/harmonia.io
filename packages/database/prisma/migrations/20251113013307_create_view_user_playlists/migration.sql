DROP VIEW IF EXISTS "public"."user_playlists" CASCADE;

CREATE OR REPLACE VIEW "public"."user_playlists" AS
SELECT 
    p.id,
    p.user_id,
    p.youtube_playlist_id,
    p.youtube_title,
    p.spotify_playlist_id,
    p.spotify_title,
    p.sync_status,
    p.last_synced_at,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT ps.id) as songs
FROM 
    synced_playlists p
LEFT JOIN 
    playlist_tracks ps ON p.id = ps.playlist_id
GROUP BY 
    p.id,
    p.user_id,
    p.youtube_playlist_id,
    p.youtube_title,
    p.spotify_playlist_id,
    p.spotify_title,
    p.sync_status,
    p.last_synced_at,
    p.created_at,
    p.updated_at;