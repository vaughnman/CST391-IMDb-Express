import { Album } from "../../models/album";
import { createMock } from "ts-auto-mock";
import { AlbumRouter } from "../../routers/AlbumRouter";
import { expect } from "chai";
import sinon from "sinon";
import { IAlbumDatabase } from "../../Databases/IAlbumDatabase";

describe("getInternal", () => {
    it("Returns album from database", async () => {
        const expectedAlbum = new Album();
        expectedAlbum.albumId = "Some Album Id";

        const albumDatabase = createMock<IAlbumDatabase>({
            get: async (albumId: string) => expectedAlbum
        });

        const albumRouter = new AlbumRouter(albumDatabase, null as any);
        

        const album = await albumRouter.getInternal("Some Album Id");
    

        expect(album).to.eql(expectedAlbum);
    });
});

describe("getAllInternal", () => {
    it("Returns all albums from database", async () => {
        const album1 = { name: "Album 1" } as Album;
        const album2 = { name: "Album 2" } as Album;        
        const expectedAlbums = [ album1, album2 ];

        const albumDatabase = createMock<IAlbumDatabase>({
            getAll: async () => expectedAlbums
        });


        const albumRouter = new AlbumRouter(albumDatabase, null as any);
        const albums = await albumRouter.getAllInternal();
        

        expect(albums).to.eql(expectedAlbums)
    });
});

describe("saveInternal", () => {
    it("Saves album to database", async () => {
        const albumDatabase = { save: sinon.spy() };
        const albumRouter = new AlbumRouter(albumDatabase as any, null as any);
        
        const album = new Album();
        album.name = "Some Name";
        album.albumId = "Some Album Id";


        await albumRouter.saveInternal(album);


        expect(albumDatabase.save.calledWith(album)).to.eql(true);
    });

    it("Throws if album name is not provided", async () => {
        const albumDatabase =  { save: sinon.spy() };
        const albumRouter = new AlbumRouter(albumDatabase as any, null as any);
        
        const album = new Album();
        album.albumId = "Some Album Id";

        await expectThrowsAsync((async () => await albumRouter.saveInternal(album))());
    });

    it("Sets TimestampAddedMs if not provided", async () => {        
        const albumDatabase = { save: sinon.spy() };
        const albumRouter = new AlbumRouter(albumDatabase as any, null as any);
        
        const album = new Album();
        album.albumId = "Some Album Id";
        album.name = "Some Name";

        
        await albumRouter.saveInternal(album);


        const savedTimestamp = albumDatabase.save.firstCall.firstArg.timestampAddedMs;
        expect(Date.now() - savedTimestamp < 1000).to.eql(true);
    });
    
    it("Sets albumid if not provided", async () => {
        const albumDatabase =  { save: sinon.spy() };
        const albumRouter = new AlbumRouter(albumDatabase as any, null as any);
        
        const album = new Album();
        album.name = "Some Name";

        
        await albumRouter.saveInternal(album);


        const albumId = albumDatabase.save.firstCall.firstArg.albumId;
        expect(albumId.length > 1).to.eql(true);
    });
});

describe("deleteInternal", () => {
    it("Deletes an album from the database", async () => {
        const albumDatabase =  { delete: sinon.spy() };
        const albumRouter = new AlbumRouter(albumDatabase as any, { deleteByAlbum: () => {} } as any);
                
        await albumRouter.deleteInternal("Some Album Id");


        expect(albumDatabase.delete.calledWith("Some Album Id")).to.eql(true);
    });
    it("Deletes all reviews for the deleted album", async () => {
        const albumDatabase = { delete: sinon.spy() };
        const reviewDatabase = { deleteByAlbum: sinon.spy() };
        
        const albumRouter = new AlbumRouter(albumDatabase as any, reviewDatabase as any); 
        await albumRouter.deleteInternal("Some Album Id");

        expect(reviewDatabase.deleteByAlbum.calledWith("Some Album Id")).to.eql(true);
    });
});

const expectThrowsAsync = async (method: any, errorMessage?: string) => {
    let error = null;

    try { await method() } 
    catch (err: any) { error = err }
    
    expect(error).to.be.an('Error')
    
    if (errorMessage) expect(error.message).to.equal(errorMessage)
  }