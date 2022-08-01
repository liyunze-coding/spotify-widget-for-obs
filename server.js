const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
require("dotenv").config();

// credentials are required
var spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI
});

const scopes = [
	// 'ugc-image-upload',
	'user-read-playback-state',
	// 'user-modify-playback-state',
	'user-read-currently-playing',
	// 'streaming',
	// 'app-remote-control',
	// 'user-read-email',
	// 'user-read-private',
	// 'playlist-read-collaborative',
	// 'playlist-modify-public',
	// 'playlist-read-private',
	// 'playlist-modify-private',
	// 'user-library-modify',
	// 'user-library-read',
	// 'user-top-read',
	// 'user-read-playback-position',
	// 'user-read-recently-played',
	// 'user-follow-read',
	// 'user-follow-modify'
];

  
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/login', (req, res) => {
	res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
	const error = req.query.error;
	const code = req.query.code;
	const state = req.query.state;

	if (error) {
		console.error('Callback Error:', error);
		res.send(`Callback Error: ${error}`);
		return;
	}

	spotifyApi
		.authorizationCodeGrant(code)
		.then(data => {
			const access_token = data.body['access_token'];
			const refresh_token = data.body['refresh_token'];
			const expires_in = data.body['expires_in'];

			spotifyApi.setAccessToken(access_token);
			spotifyApi.setRefreshToken(refresh_token);

			console.log('access_token:', access_token);
			console.log('refresh_token:', refresh_token);

			console.log(
				`Sucessfully retreived access token. Expires in ${expires_in} s.`
			);
			res.send(`Success! You can now close the window.<br><a href='http://localhost:8888/twitch-overlay'>click here!</a>`);
			

			setInterval(async () => {
				const data = await spotifyApi.refreshAccessToken();
				const access_token = data.body['access_token'];

				console.log('The access token has been refreshed!');
				console.log('access_token:', access_token);
				spotifyApi.setAccessToken(access_token);
			}, expires_in / 2 * 1000);
		})
		.catch(error => {
			console.error('Error getting Tokens:', error);
			res.send(`Error getting Tokens: ${error}`);
		});
});

app.get('/twitch-overlay', (req, res) => {
	
	spotifyApi.getMyCurrentPlayingTrack()
	.then(function(data) {
		let song_title = 'Nothing is playing';
		let song_artist = 'RyanPython';
		let album_cover = 'http://localhost:8888/images/empty_album.png';

		if (data.body.item){
			
			song_title = data.body.item.name;
			
			album_cover = data.body.item.album.images[0].url;

			let song_artists = [];
			for (artist of data.body.item.artists){
				song_artists.push(artist.name);
			}
			song_artist = song_artists.join(', ');
		}

		res.render('pages/twitch-overlay',{
			song_title: song_title,
			song_artist: song_artist,
			album_cover: album_cover
		})
	}, function(err) {
		console.log('Something went wrong!', err);
	});
});

app.get('/twitch-overlay/info', function(req, res) {
	spotifyApi.getMyCurrentPlaybackState()
	.then(function(data1) {
		// Output items
		if (data1.body && data1.body.is_playing) {
			spotifyApi.getMyCurrentPlayingTrack()
			.then(function(data) {
				let song_title = 'Spotify overlay';
				let song_artist = 'RyanPython';
				let album_cover = 'http://localhost:8888/images/empty_album.png';

				if (data.body.item){
					song_title = data.body.item.name;
					
					album_cover = data.body.item.album.images[0].url;
		
					let song_artists = [];
					for (artist of data.body.item.artists){
						song_artists.push(artist.name);
					}
					song_artist = song_artists.join(', ');
				}

				res.json({
					song_title: song_title,
					song_artist: song_artist,
					album_cover: album_cover
				});
			}, function(err) {
				console.log('Something went wrong!', err);
			});
		} else {
			let song_title = 'Spotify overlay';
			let song_artist = 'RyanPython';
			let album_cover = 'http://localhost:8888/images/empty_album.png';
			res.json({
				song_title: song_title,
				song_artist: song_artist,
				album_cover: album_cover
			});
		}
	}, function(err) {
		console.log('Something went wrong!', err);
	});
});

app.listen(8888, () => {
	console.log('HTTP Server up. Now go to http://localhost:8888/login in your browser.');
});