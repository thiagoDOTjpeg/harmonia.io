export class MusicMatchingService {
  static cleanYouTubeTitle(title: string): { title: string; artist?: string } {
    let cleaned = title
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/official\s*(video|audio|music\s*video)/gi, '')
      .replace(/\bhd\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

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

  static normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static similarity(s1: string, s2: string): number {
    const str1 = this.normalize(s1);
    const str2 = this.normalize(s2);

    if (str1 === str2) return 1.0;

    if (str1.includes(str2) || str2.includes(str1)) {
      const longer = Math.max(str1.length, str2.length);
      const shorter = Math.min(str1.length, str2.length);
      return shorter / longer;
    }

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

  static generateSpotifyQuery(youtubeTitle: string, channelTitle: string): string {
    const { title, artist: artistFromTitle } = this.cleanYouTubeTitle(youtubeTitle);

    // 1º CASO: Artista extraído do título (mais confiável)
    if (artistFromTitle) {
      console.log(`[Query] Artista no título: track:"${title}" artist:"${artistFromTitle}"`);
      return `track:"${title}" artist:"${artistFromTitle}"`;
    }

    const topicMatch = channelTitle.match(/^(.+?)\s*-\s*Topic$/i);
    if (topicMatch) {
      const artist = topicMatch[1].trim();
      console.log(`[Query] Canal Topic oficial: track:"${title}" artist:"${artist}"`);
      return `track:"${title}" artist:"${artist}"`;
    }

    const vevoMatch = channelTitle.match(/^(.+?)\s*VEVO$/i);
    if (vevoMatch) {
      const artist = vevoMatch[1].trim();
      console.log(`[Query] Canal VEVO oficial: track:"${title}" artist:"${artist}"`);
      return `track:"${title}" artist:"${artist}"`;
    }

    if (!this.isLikelyDistributor(channelTitle)) {
      console.log(`[Query] Canal do artista: track:"${title}" artist:"${channelTitle}"`);
      return `track:"${title}" artist:"${channelTitle}"`;
    }

    console.log(`[Query] Distribuidora detectada (${channelTitle}), buscando só por: track:"${title}"`);
    return `track:"${title}"`;
  }

  static calculateMatchScore(
    youtubeData: { title: string; channelTitle: string },
    spotifyTrack: { name: string; artists: Array<{ name: string }> }
  ): number {
    const ytCleaned = this.cleanYouTubeTitle(youtubeData.title);
    const spotifyArtists = spotifyTrack.artists.map((a) => a.name).join(' ');

    const titleScore = this.similarity(ytCleaned.title, spotifyTrack.name);

    let potentialYouTubeArtist: string | undefined = ytCleaned.artist;

    if (!potentialYouTubeArtist) {
      const topicMatch = youtubeData.channelTitle.match(/^(.+?)\s*-\s*Topic$/i);
      if (topicMatch) {
        potentialYouTubeArtist = topicMatch[1].trim();
      }
      else {
        const vevoMatch = youtubeData.channelTitle.match(/^(.+?)\s*VEVO$/i);
        if (vevoMatch) {
          potentialYouTubeArtist = vevoMatch[1].trim();
        }
        else if (!this.isLikelyDistributor(youtubeData.channelTitle)) {
          potentialYouTubeArtist = youtubeData.channelTitle;
        }
      }
    }

    if (potentialYouTubeArtist) {
      const artistScore = this.similarity(potentialYouTubeArtist, spotifyArtists);

      console.log(`[Match] Título: ${titleScore.toFixed(2)} | Artista: ${artistScore.toFixed(2)} | Final: ${(titleScore * 0.7 + artistScore * 0.3).toFixed(2)}`);
      console.log(`[Match] YT: "${ytCleaned.title}" by "${potentialYouTubeArtist}" <-> Spotify: "${spotifyTrack.name}" by "${spotifyArtists}"`);

      return titleScore * 0.7 + artistScore * 0.3;
    }

    console.log(`[Match] Só título (distribuidora): ${titleScore.toFixed(2)}`);
    console.log(`[Match] YT: "${ytCleaned.title}" (canal: ${youtubeData.channelTitle}) <-> Spotify: "${spotifyTrack.name}" by "${spotifyArtists}"`);

    return titleScore;
  }

  static isLikelyDistributor(channelTitle: string): boolean {
    const normalized = channelTitle.toLowerCase();

    const distributorTerms = [
      'records',
      'recordings',
      'music',
      'label',
      'entertainment',

      'spinnin',
      'monstercat',
      'proximity',
      'mrsuicidesheep',
      'ultra',
      'armada',
      'revealed',
      'sony music',
      'warner',
      'universal',
      'atlantic',
      'interscope',
      'capitol',
      'columbia',

      'official',
      'official music',
      'official audio',
      'officialvideo',
    ];

    if (/(-\s*topic|vevo)$/i.test(channelTitle)) {
      return false;
    }

    return distributorTerms.some(term => normalized.includes(term));
  }

  static extractArtistFromChannel(channelTitle: string): string | null {
    const topicMatch = channelTitle.match(/^(.+?)\s*-\s*Topic$/i);
    if (topicMatch) {
      return topicMatch[1].trim();
    }

    const vevoMatch = channelTitle.match(/^(.+?)\s*VEVO$/i);
    if (vevoMatch) {
      return vevoMatch[1].trim();
    }

    return null;
  }
}