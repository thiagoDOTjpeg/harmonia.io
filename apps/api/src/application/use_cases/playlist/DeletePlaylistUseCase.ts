import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { NotFoundError } from "@harmonia/shared";

export class DeletePlaylistUseCase {
  constructor(private readonly playlistRepository: IPlaylistRepository) {}

  async execute(playlistId: string, userId: string): Promise<void> {
    const playlist = this.playlistRepository.findById
      ? await this.playlistRepository.findById(playlistId)
      : await this.playlistRepository.findByIdWithTracks?.(playlistId);

    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundError("Playlist não encontrada");
    }

    await this.playlistRepository.delete(playlistId);
  }
}

