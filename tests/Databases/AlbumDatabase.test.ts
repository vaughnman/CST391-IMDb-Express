import { expect } from "chai";
import { Album } from "../../models/album";
import { AlbumDatabase } from "../../databases/AlbumDatabase";

const hasConnectionString = process.env.DATABASE_CONNECTION_STRING !== undefined;

if(!hasConnectionString) console.log("Skipping AlbumDatabase tests, no connection string found!");

const It = hasConnectionString ? it : it.skip;


It("Returns null if no album exists for the album id", async () => {
    let albumDatabase = new AlbumDatabase();
    
    let album = await albumDatabase.get("Nonexistent Album Id");

    expect(album).to.be.null;
});

It("Can save and retrieve album", async () => {
    let album = { albumId: "Album 2" } as Album;
    let albumDatabase = new AlbumDatabase();
    
    await albumDatabase.save(album);
    let retrievedAlbum = await albumDatabase.get("Album 2");

    expect(retrievedAlbum).to.eql(album);

    await tryCleanupAlbum("Album 2");
});

It("Saving album overwrites existing album", async () => {
    let album1 = { albumId: "Album 3", name: "Album Name" } as Album;
    let album2 = { albumId: "Album 3", name: "Overwritten Name" } as Album;
    let albumDatabase = new AlbumDatabase();
    
    await albumDatabase.save(album1);
    await albumDatabase.save(album2);
    let retrievedAlbum = await albumDatabase.get("Album 3");

    expect(retrievedAlbum?.name).to.eql(album2.name);
    await tryCleanupAlbum("Album 3");
});

It("Can retrieve all albums", async () => {
    let album1 = { albumId: "Album 4" } as Album;
    let album2 = { albumId: "Album 5" } as Album;

    let albumDatabase = new AlbumDatabase();

    await albumDatabase.save(album1);
    await albumDatabase.save(album2);

    await sleep(150);

    let albums = await albumDatabase.getAll();

    expect(albums.find(x => x.albumId == "Album 4")).to.not.be.undefined;
    expect(albums.find(x => x.albumId == "Album 5")).to.not.be.undefined;

    await tryCleanupAlbum("Album 4");
    await tryCleanupAlbum("Album 5");
});

It("Can delete album", async () => {
    let album = { albumId: "Album 6" } as Album;
    let albumDatabase = new AlbumDatabase();
    
    await albumDatabase.save(album);
    await albumDatabase.delete("Album 6");

    await sleep(150);

    let retrievedAlbum = await albumDatabase.get("Album 6");

    expect(retrievedAlbum).to.be.null;
});

async function tryCleanupAlbum(albumId: string) {
    try {
    let albumDatabase = new AlbumDatabase();
    await albumDatabase.delete(albumId);
    } catch {}
}

function sleep(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}