require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
    res.render('index')
})

app.get("/artist-search", (req, res) => {
    const {
        artist
    } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(artistFound => {
            const ArtistFoundData = artistFound.body.artists.items;
            // res.json(artistFound.body.artists)
            // console.log(ArtistFoundData)
            res.render('artist-search', {
                ArtistFoundData
            });

            // const ArtistFoundData = res.json(artistFound.body.artists.items);
            // console.log(artistNameFound)
            // res.json(ArtistNameFound);
            // res.render('artist', data)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(idFound => {
            const idFoundData = idFound.body.items;
            console.log(idFoundData)
            //  res.json(idFound.body)
            res.render('albums', 
                {idFoundData}
            )
        })
})

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(albumIdFound => {
            const albumIdFoundData = albumIdFound.body.items;
            console.log(albumIdFoundData)
            //  res.json(albumIdFoundData)
            res.render('tracks', {
                albumIdFoundData
            })
        })
})

app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));