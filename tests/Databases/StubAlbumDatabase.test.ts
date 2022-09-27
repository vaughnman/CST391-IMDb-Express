import { StubAlbumDatabase } from "../../databases/StubAlbumDatabase";
import { expect } from "chai";
import { Album } from "../../models/album";

it("Returns null if no album exists for the album id", async () => {
    let albumDatabase = new StubAlbumDatabase();
    
    let album = await albumDatabase.get("Nonexistent Album Id");

    expect(album).to.be.null;
});

it("Can save and retrieve album", async () => {
    let album = { albumId: "Album 2" } as Album;
    let albumDatabase = new StubAlbumDatabase();
    
    await albumDatabase.save(album);
    let retrievedAlbum = await albumDatabase.get("Album 2");

    expect(retrievedAlbum).to.eql(album);
});

it("Saving album overwrites existing album", async () => {
    let album1 = { albumId: "Album 3", name: "Album Name" } as Album;
    let album2 = { albumId: "Album 3", name: "Overwritten Name" } as Album;
    let albumDatabase = new StubAlbumDatabase();
    
    await albumDatabase.save(album1);
    await albumDatabase.save(album2);
    let retrievedAlbum = await albumDatabase.get("Album 3");

    expect(retrievedAlbum?.name).to.eql(album2.name);
});

it("Can retrieve all albums", async () => {
    let album1 = { albumId: "Album 4" } as Album;
    let album2 = { albumId: "Album 5" } as Album;

    let albumDatabase = new StubAlbumDatabase();

    await albumDatabase.save(album1);
    await albumDatabase.save(album2);

    let albums = await albumDatabase.getAll();

    expect(albums).to.contain(album1);
    expect(albums).to.contain(album2);
});

it("Can delete album", async () => {
    let album = { albumId: "Album 6" } as Album;
    let albumDatabase = new StubAlbumDatabase();
    
    await albumDatabase.save(album);
    await albumDatabase.delete("Album 6");
    let retrievedAlbum = await albumDatabase.get("Album 6");

    expect(retrievedAlbum).to.be.null;
});