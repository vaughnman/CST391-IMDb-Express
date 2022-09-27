import { Album } from "../models/album";

/** Album Database interface */
export interface IAlbumDatabase
{
    /** Get album by id */
    get(albumId: string): Promise<Album | null>;
    /** Get all albums */
    getAll(): Promise<Album[]>;

    /** Creates or updates album in database */
    save(album: Album): Promise<void>;
    /** Deletes album from database */
    delete(albumId: string): Promise<void>;
}