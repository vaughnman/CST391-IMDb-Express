import { IAlbumDatabase } from "../databases/IAlbumDatabase";
import { Album } from "../models/album";
import { v4 as uuidv4 } from "uuid";
import { IReviewDatabase } from "../databases/IReviewDatabase";
import { Request, Response } from "express";

/** Endpoint for all '/Album' routes */
export class AlbumRouter
{
    private albumDatabase: IAlbumDatabase;
    private reviewDatabase: IReviewDatabase;

    /** 
     * DI Constructor 
     * @param albumDatabase Album database to be used for Album operations
     * @param reviewDatabase Review database used for deleting an album's reviews when an album is deleted 
     */
    constructor(albumDatabase: IAlbumDatabase, reviewDatabase: IReviewDatabase) {
        this.albumDatabase = albumDatabase;
        this.reviewDatabase = reviewDatabase;

        this.get = this.get.bind(this);
        this.getInternal = this.getInternal.bind(this);

        this.getAll = this.getAll.bind(this);
        this.getAllInternal = this.getAllInternal.bind(this);

        this.save = this.save.bind(this);
        this.saveInternal = this.saveInternal.bind(this);
        
        this.delete = this.delete.bind(this);
        this.deleteInternal = this.deleteInternal.bind(this);
    }

    /** Gets album by 'albumId' http query parameters */
    async get(req: Request, res: Response)
    {
        var albumId = req.query.albumId;

        if(!albumId) {
            res.status(400).send("albumId is required");
            return;
        }

        var album = await this.albumDatabase.get(albumId as any);

        if(!album) {
            res.status(204).send(null);
            return;
        }
        
        res.status(200).send(album);
    }

    async getInternal(albumId: string) {
        return await this.albumDatabase.get(albumId);
    }

    /** Returns all albums */
    async getAll(req: Request, res: Response)
    {
        var albums = await this.albumDatabase.getAll();

        if(!albums) res.status(200).send([]);
        
        res.status(200).send(albums);
    }
    
    async getAllInternal() {
        return await this.albumDatabase.getAll();
    }

    /** Creates or updates an album */
    async save(req: Request, res: Response)
    {
        var album = req.body;

        var savedAlbum = await this.saveInternal(album);

        res.status(201).send(savedAlbum.albumId);
    }

    async saveInternal(album: Album) {
        if(!album.name) 
            throw new Error("Album name is required!");
        
        if(!album.timestampAddedMs)
            album.timestampAddedMs = Date.now();

        if(album.albumId == null)
            album.albumId = uuidv4();

        await this.albumDatabase.save(album);
        
        return album;
    }
    
    /** Deletes an album and its reviews */
    async delete(req: Request, res: Response)
    {
        var albumId = req.query.albumId;

        if(!albumId) {
            res.status(400).send("albumId is required");
            return;
        }

        await this.deleteInternal(albumId as any);

        res.status(202).send("Album deleted");
    }

    async deleteInternal(albumId: string) 
    {
        await this.albumDatabase.delete(albumId);
        await this.reviewDatabase.deleteByAlbum(albumId);
    }
}