import mysql from "mysql2";
import { Album } from "../models/album";
import { IAlbumDatabase } from "./IAlbumDatabase";

/** Database for albums */
export class AlbumDatabase implements IAlbumDatabase
{
    connection: mysql.Pool;
    
    /** Constructor */
    constructor()
    {
        let connectionString = process.env.DATABASE_CONNECTION_STRING;
        if(!connectionString) throw new Error("DATABASE_CONNECTION_STRING is missing from environment variables!");
        
        var parts = connectionString.split(";");
        var keyValues = parts.map(x => ({key: x.split("=")[0], value: x.split("=")[1]}));

        var config: any = {
            host: keyValues.find(x => x.key == "server")?.value,
            user: keyValues.find(x => x.key == "uid" || x.key == "")?.value,
            password: keyValues.find(x => x.key == "password")?.value,
            database: keyValues.find(x => x.key == "database")?.value,
        };

        this.connection = mysql.createPool(config);
    }

    /** Get album by id */
    async get(albumId: string): Promise<Album | null> {
        var album = null;
        
        const [rows, fields] = await this.connection.promise()
            .execute("SELECT * FROM albums WHERE AlbumId = ?", [albumId]);

        if(!rows || (rows as any).length == 0) return null;

        album = (rows as any)[0];

        return this.toCamelCase(album);
    }

    /** Get all albums */
    async getAll(): Promise<Album[]> 
    {
        const [rows, fields] = await this.connection.promise()
            .execute("SELECT * FROM albums");
        
        if(!rows) return [];

        let albums: Album[] = (rows as any).map((x: any) => this.toCamelCase(x));

        return albums;
    }

    /** Creates or updates an album */
    async save(album: Album): Promise<void> 
    {
        await this.connection.promise()
            .query(
                "REPLACE albums (`AlbumId`,`Name`,`Band`,`ImageUrl`,`ReleaseDate`,`TimestampAddedMs`) " +
                "VALUES (?, ?, ?, ?, ?, ?)",
                [album.albumId, album.name, album.band, album.imageUrl, album.releaseDate, album.timestampAddedMs]
            );
    }

    /** Deletes an album by id */
    async delete(albumId: string): Promise<void> 
    {
        await this.connection.promise()
            .execute("DELETE FROM albums WHERE AlbumId = ?", [albumId]);
    }
    
    /** Converts a pascal case database row to camel case */
    toCamelCase(object: any) {
        var newObject: any = {};

        for(var key in object) {
            var newKey = key.charAt(0).toLocaleLowerCase() + key.slice(1);
            if(object[key])
                newObject[newKey] = object[key];
        }

        return newObject;
    }
}