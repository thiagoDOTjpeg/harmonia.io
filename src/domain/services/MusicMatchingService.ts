export class MusicMatchingService {
  // Limpar título do YouTube
  static cleanYouTubeTitle(title: string): { title: string; artist?: string } {
    let cleaned = title
      .replace(/\(official.*?\)/gi, '')
      .replace(/\[official.*?\]/gi, '')
      .replace(/official\s+(video|audio|music\s+video)/gi, '')
      .replace(/\(.*?lyric.*?\)/gi, '')
      .replace(/\[.*?lyric.*?\]/gi, '')
      .replace(/\(.*?audio.*?\)/gi, '')
      .replace(/\[.*?audio.*?\]/gi, '')
      .replace(/\(hd\)/gi, '')
      .replace(/\[hd\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Tentar extrair artista - título
    const patterns = [
      /^(.+?)\s*-\s*(.+)$/,  // "Artist - Title"
      /^(.+?)\s*–\s*(.+)$/,  // "Artist – Title" (em dash)
      /^(.+?):\s*(.+)$/,     // "Artist: Title"
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        return {
          artist: match[1].trim(),
          title: match[2].trim(),
        };
      }
    }

    return { title: cleaned };
  }

  // Normalizar string para comparação
  static normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Calcular similaridade entre duas strings (Levenshtein)
  static similarity(s1: string, s2: string): number {
    const str1 = this.normalize(s1);
    const str2 = this.normalize(s2);

    // Match exato
    if (str1 === str2) return 1.0;

    // Uma contém a outra
    if (str1.includes(str2) || str2.includes(str1)) {
      const longer = Math.max(str1.length, str2.length);
      const shorter = Math.min(str1.length, str2.length);
      return shorter / longer;
    }

    // Levenshtein distance
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  }

  // Gerar query de busca para o Spotify
  static generateSpotifyQuery(youtubeTitle: string): string {
    const { title, artist } = this.cleanYouTubeTitle(youtubeTitle);

    if (artist) {
      return `track:${title} artist:${artist}`;
    }

    return `track:${title}`;
  }

  // Calcular score de match entre YouTube e Spotify
  static calculateMatchScore(
    youtubeTitle: string,
    spotifyTrack: { name: string; artists: Array<{ name: string }> }
  ): number {
    const ytCleaned = this.cleanYouTubeTitle(youtubeTitle);
    const spotifyArtists = spotifyTrack.artists.map((a) => a.name).join(' ');

    // Score do título (peso 0.7)
    const titleScore = this.similarity(ytCleaned.title, spotifyTrack.name);

    // Score do artista (peso 0.3)
    let artistScore = 0;
    if (ytCleaned.artist) {
      artistScore = this.similarity(ytCleaned.artist, spotifyArtists);
    }

    // Se não tem artista no YouTube, só considera título
    if (!ytCleaned.artist) {
      return titleScore;
    }

    return titleScore * 0.7 + artistScore * 0.3;
  }
}