import { Album } from "../models/album";
import { IAlbumDatabase } from "./IAlbumDatabase";

/** An in-memory database for albums */
export class StubAlbumDatabase implements IAlbumDatabase
{
    static albums: Album[] = [];

    async get(albumId: string): Promise<Album | null> 
    {
        let albums = StubAlbumDatabase.albums.filter(x => x.albumId == albumId);
    
        if (albums == null || albums.length == 0) return null;    
        return albums[0];
    }
    
    async getAll(): Promise<Album[]> 
    {
        return StubAlbumDatabase.albums;
    }
    
    async save(album: Album): Promise<void> 
    {
        StubAlbumDatabase.albums = StubAlbumDatabase.albums.filter(x => x.albumId != album.albumId);    
        StubAlbumDatabase.albums.push(album);
    }

    async delete(albumId: string): Promise<void> {
        StubAlbumDatabase.albums = StubAlbumDatabase.albums.filter(x => x.albumId != albumId);
    }
}