interface AlbumTrack {
	title: string;
	url: string;
	duration: string;
	artwork: string;
}

interface Album {
	title: string;
	type: string;
	year: string;
	releaseDate: string;
	description: string;
	summary?: string;
	artwork: string;
	albumUrl: string;
	embedUrl: string;
	spotifyUrl?: string;
	appleMusicUrl?: string;
	tracks: AlbumTrack[];
}

export const albums: Album[] = [
	{
		title: "Anathema",
		type: "Album",
		year: "2026",
		releaseDate: "July 12, 2026",
		summary: "Exile, obsession, survival, devotion. Thirteen songs through ruined battalions, drowned horizons, and the things that remain when certainty begins to collapse.",
		description:
			"Anathema is a collection of songs about exile, obsession, survival, devotion, and the things that remain when faith, identity, and certainty begin to collapse. Moving between intimate piano ballads, dark pop, progressive metal, cosmic horror, mechanical dread, and moments of fragile hope, the album follows a world coming apart from both the inside and the outside. Across ruined battalions, drowned horizons, forbidden gods, fevered signals, and lives lived after the ending, Anathema asks what we become when everything we trusted turns against us, and whether being cast out might be the beginning of something else.",
		artwork: "/anathema.webp",
		albumUrl: "https://soundcloud.com/pneumaris/sets/anathema",
		spotifyUrl: "https://open.spotify.com/album/0QqaNkRcgBQ6wPV9UgecXj",
		appleMusicUrl: "https://music.apple.com/us/album/anathema/6790130743",
		embedUrl:
			"https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pneumaris/sets/anathema&start_track=0&color=%23b89a6a&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false",
		tracks: [
			{
				title: "The Last Restraint",
				url: "https://soundcloud.com/pneumaris/the-last-restraint",
				duration: "5:52",
				artwork: "https://i1.sndcdn.com/artworks-YubI33AQ3lZC9zEi-zzHBIw-t500x500.jpg",
			},
			{
				title: "The Ninth Amen",
				url: "https://soundcloud.com/pneumaris/the-ninth-amen",
				duration: "5:27",
				artwork: "https://i1.sndcdn.com/artworks-l9XU87o8D41FEd2N-bu4E2w-t500x500.jpg",
			},
			{
				title: "Gods of Small Machines",
				url: "https://soundcloud.com/pneumaris/gods-of-small-machines",
				duration: "5:00",
				artwork: "https://i1.sndcdn.com/artworks-NJk1G9gF1GJOLBx5-pnBvZg-t500x500.jpg",
			},
			{
				title: "Emergency Contact",
				url: "https://soundcloud.com/pneumaris/emergency-contact",
				duration: "5:08",
				artwork: "https://i1.sndcdn.com/artworks-NiaBv4Dyy8cJlkfF-r8KPBA-t500x500.jpg",
			},
			{
				title: "The Archive at Zero Light",
				url: "https://soundcloud.com/pneumaris/the-archive-at-zero-light",
				duration: "5:24",
				artwork: "https://i1.sndcdn.com/artworks-Q9RIyWNXwUC1cWfM-zAcH4Q-t500x500.jpg",
			},
			{
				title: "Pretty Little Hex",
				url: "https://soundcloud.com/pneumaris/pretty-little-hex",
				duration: "6:13",
				artwork: "https://i1.sndcdn.com/artworks-01fFnSgNjBEZMSoZ-7uBzYg-t500x500.jpg",
			},
			{
				title: "Cold",
				url: "https://soundcloud.com/pneumaris/cold",
				duration: "0:46",
				artwork: "https://i1.sndcdn.com/artworks-f5xGARtgAxzUBPrz-LrV0UQ-t500x500.jpg",
			},
			{
				title: "The Hollow Battalion",
				url: "https://soundcloud.com/pneumaris/the-hollow-battalion",
				duration: "6:12",
				artwork: "https://i1.sndcdn.com/artworks-lxzkjgwlQvMPPLea-yARVTg-t500x500.jpg",
			},
			{
				title: "The Devil Keeps My Change",
				url: "https://soundcloud.com/pneumaris/the-devil-keeps-my-change",
				duration: "6:04",
				artwork: "https://i1.sndcdn.com/artworks-PCeWXuR7WapTtqBz-fXm8Zw-t500x500.jpg",
			},
			{
				title: "The Drowned Meridian",
				url: "https://soundcloud.com/pneumaris/the-drowned-meridian",
				duration: "6:52",
				artwork: "https://i1.sndcdn.com/artworks-k7y0zI5oYZbKkmAa-10JruA-t500x500.jpg",
			},
			{
				title: "When the Fever Sings",
				url: "https://soundcloud.com/pneumaris/when-the-fever-sings",
				duration: "5:48",
				artwork: "https://i1.sndcdn.com/artworks-0ByxkUCT0GHljqIs-tZyYFw-t500x500.jpg",
			},
			{
				title: "The Life Beside You",
				url: "https://soundcloud.com/pneumaris/the-life-beside-you",
				duration: "4:14",
				artwork: "https://i1.sndcdn.com/artworks-GrkDY3vFqV3nwsPX-OrCzrQ-t500x500.jpg",
			},
			{
				title: "After the Ending",
				url: "https://soundcloud.com/pneumaris/after-the-ending",
				duration: "5:24",
				artwork: "https://i1.sndcdn.com/artworks-ZfsMun3t6uwdWSvw-laUbhw-t500x500.jpg",
			},
		],
	},
	{
		title: "Eidolon",
		type: "Album",
		year: "2026",
		releaseDate: "May 23, 2026",
		description:
			"Eidolon is a haunted transmission from the self that survived and the self that didn't. Across 13 tracks, Pneumaris pulls progressive metal, dark cinematic pop, industrial textures, blues-soaked guitar, piano balladry, bowed-string atmosphere, and experimental rhythmic detours into one shadowed body. Moving through identity, obsession, memory, devotion, artificial creation, and the strange rituals we build to stay intact, the album is dark, melodic, intimate, and massive in turns, an album about echoes: the voices we follow, the ghosts we become, and the shape left behind when something inside us changes.",
		artwork: "https://i1.sndcdn.com/artworks-koC13oEvnjO9T9uh-zpvuYQ-t500x500.jpg",
		albumUrl: "https://soundcloud.com/pneumaris/sets/eidolon",
		spotifyUrl: "https://open.spotify.com/album/4AslLFUqQ4D77DBdPA95nO",
		appleMusicUrl: "https://music.apple.com/us/album/eidolon/6782643086",
		embedUrl:
			"https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pneumaris/sets/eidolon&start_track=0&color=%23b89a6a&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false",
		tracks: [
			{
				title: "Parasite Choir",
				url: "https://soundcloud.com/pneumaris/parasite-choir",
				duration: "5:39",
				artwork: "https://i1.sndcdn.com/artworks-lK7J0WX55ZurQHVK-d1WNQw-t500x500.jpg",
			},
			{
				title: "Fault King",
				url: "https://soundcloud.com/pneumaris/fault-king",
				duration: "5:03",
				artwork: "https://i1.sndcdn.com/artworks-31LF4R56ElZMBWr6-bH7uyA-t500x500.jpg",
			},
			{
				title: "The Low Note Knows",
				url: "https://soundcloud.com/pneumaris/the-low-note-knows",
				duration: "7:08",
				artwork: "https://i1.sndcdn.com/artworks-6VYQe5CyiOzJqwOP-pdmzbw-t500x500.jpg",
			},
			{
				title: "Lacquer and Fever",
				url: "https://soundcloud.com/pneumaris/lacquer-and-fever",
				duration: "6:17",
				artwork: "https://i1.sndcdn.com/artworks-IsOhvjtLYcaO4Qqn-iTkwVQ-t500x500.jpg",
			},
			{
				title: "The Man I Was Following",
				url: "https://soundcloud.com/pneumaris/the-man-i-was-following",
				duration: "6:49",
				artwork: "https://i1.sndcdn.com/artworks-NRxwZ3swaYlbPCbM-ujSS6g-t500x500.jpg",
			},
			{
				title: "Proof of You",
				url: "https://soundcloud.com/pneumaris/proof-of-you",
				duration: "6:04",
				artwork: "https://i1.sndcdn.com/artworks-SnP1w84x0qnY2Tkn-5w7GEw-t500x500.jpg",
			},
			{
				title: "Counterfeit Lungs",
				url: "https://soundcloud.com/pneumaris/counterfeit-lungs",
				duration: "5:34",
				artwork: "https://i1.sndcdn.com/artworks-Ifh75iBdPIbsJT26-JO6tOA-t500x500.jpg",
			},
			{
				title: "Hollow Season",
				url: "https://soundcloud.com/pneumaris/hollow-season",
				duration: "5:34",
				artwork: "https://i1.sndcdn.com/artworks-KkfFOQR9zVLW1o1y-NYebSg-t500x500.jpg",
			},
			{
				title: "Feral Systems",
				url: "https://soundcloud.com/pneumaris/feral-systems",
				duration: "6:01",
				artwork: "https://i1.sndcdn.com/artworks-KsxyADwBa9tR9Ehb-Qb3bdg-t500x500.jpg",
			},
			{
				title: "Ossuary Bloom",
				url: "https://soundcloud.com/pneumaris/ossuary-bloom",
				duration: "6:03",
				artwork: "https://i1.sndcdn.com/artworks-WiCA0IunDpMIehvG-6WGzyg-t500x500.jpg",
			},
			{
				title: "Still Becoming",
				url: "https://soundcloud.com/pneumaris/still-becoming",
				duration: "5:46",
				artwork: "https://i1.sndcdn.com/artworks-puvbAomF3HwwTY9G-3Iq3hQ-t500x500.jpg",
			},
			{
				title: "Litany of the Machine Heart",
				url: "https://soundcloud.com/pneumaris/litany-of-the-machine-heart",
				duration: "5:22",
				artwork: "https://i1.sndcdn.com/artworks-7WygdLpBgGfRs6L2-ZefiUg-t500x500.jpg",
			},
			{
				title: "The Ballroom at the End of Time",
				url: "https://soundcloud.com/pneumaris/the-ballroom-at-the-end-of",
				duration: "6:00",
				artwork: "https://i1.sndcdn.com/artworks-zbsiyZax2TJhfU1W-KzVucg-t500x500.jpg",
			},
		],
	},
	{
		title: "The Black Wake",
		type: "Single",
		year: "2026",
		releaseDate: "May 16, 2026",
		description:
			"The Black Wake is a two-track single from Pneumaris, pairing a gothic progressive metal sea shanty with a haunted ragtime instrumental. The release drifts through cosmic horror, maritime dread, and the strange beauty found beneath dark water.",
		artwork: "https://i1.sndcdn.com/artworks-lvnO03Qb1grNbhcm-2VyPzQ-t500x500.jpg",
		albumUrl: "https://soundcloud.com/pneumaris/sets/the-black-wake",
		spotifyUrl: "https://open.spotify.com/album/1lzphocLKpT5uscfQqLaIt",
		appleMusicUrl: "https://music.apple.com/us/album/the-black-wake-single/6777567916",
		embedUrl:
			"https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pneumaris/sets/the-black-wake&start_track=0&color=%23b89a6a&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false",
		tracks: [
			{
				title: "Salt",
				url: "https://soundcloud.com/pneumaris/salt",
				duration: "1:01",
				artwork: "https://i1.sndcdn.com/artworks-W7LRjlf5Yig3bXQ3-pCyMbA-t500x500.jpg",
			},
			{
				title: "The Black Wake",
				url: "https://soundcloud.com/pneumaris/the-black-wake",
				duration: "5:28",
				artwork: "https://i1.sndcdn.com/artworks-a4IgJF5t8lsYwpwG-zQ1c9w-t500x500.jpg",
			},
		],
	},
	{
		title: "Pleroma",
		type: "Album",
		year: "2026",
		releaseDate: "May 8, 2026",
		description:
			"Pleroma drifts between devotion and collapse, a full-length descent through cosmic longing, fractured identity, ritualistic heaviness, and the quiet violence of becoming. Built from progressive metal, dark pop, ambient horror, and cinematic atmosphere, these songs move through eclipsed cathedrals, black oceans, sacred machinery, and the things we carry just to remain human.",
		artwork: "https://i1.sndcdn.com/artworks-eN97hf5D66N4XleI-FOvo4w-t500x500.jpg",
		albumUrl: "https://soundcloud.com/pneumaris/sets/pleroma",
		spotifyUrl: "https://open.spotify.com/album/0tv6zoZ04743AZbHnQfA34",
		appleMusicUrl: "https://music.apple.com/us/album/pleroma/6782904659",
		embedUrl:
			"https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pneumaris/sets/pleroma&start_track=0&color=%23b89a6a&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false",
		tracks: [
			{
				title: "Hollow Constellations",
				url: "https://soundcloud.com/pneumaris/hollow-constellations",
				duration: "2:30",
				artwork: "https://i1.sndcdn.com/artworks-ibNcDUI0qlWl68IK-oW4COw-t500x500.jpg",
			},
			{
				title: "Louder Than Your Thoughts",
				url: "https://soundcloud.com/pneumaris/louder-than-your-thoughts",
				duration: "2:24",
				artwork: "https://i1.sndcdn.com/artworks-C1NxsXucF8xycZDa-Jsuhjw-t500x500.jpg",
			},
			{
				title: "Devotion in the Low Light",
				url: "https://soundcloud.com/pneumaris/devotion-in-the-low-light",
				duration: "2:24",
				artwork: "https://i1.sndcdn.com/artworks-K3My4HkqhhTrLHDW-zjA5ZA-t500x500.jpg",
			},
			{
				title: "The Shape That Answers",
				url: "https://soundcloud.com/pneumaris/the-shape-that-answers",
				duration: "2:57",
				artwork: "https://i1.sndcdn.com/artworks-1Iqrup3FPO8Gy8xG-Kjbmog-t500x500.jpg",
			},
			{
				title: "Blacklit Gravity",
				url: "https://soundcloud.com/pneumaris/blacklit-gravity",
				duration: "2:16",
				artwork: "https://i1.sndcdn.com/artworks-k4vp9goQyiS6TVPo-weEMcA-t500x500.jpg",
			},
			{
				title: "River",
				url: "https://soundcloud.com/pneumaris/river",
				duration: "0:09",
				artwork: "https://i1.sndcdn.com/artworks-BM7PxQqeDxCmIf72-MXdCsA-t500x500.jpg",
			},
			{
				title: "Where the Road Divides",
				url: "https://soundcloud.com/pneumaris/where-the-road-divides",
				duration: "1:47",
				artwork: "https://i1.sndcdn.com/artworks-jyi4yvybtfzlzY0D-ZOb7AQ-t500x500.jpg",
			},
			{
				title: "What I Become",
				url: "https://soundcloud.com/pneumaris/what-i-become",
				duration: "3:36",
				artwork: "https://i1.sndcdn.com/artworks-2qyQaQQhJIG7E3MU-TZ6sUA-t500x500.jpg",
			},
			{
				title: "A Beautiful Fracture",
				url: "https://soundcloud.com/pneumaris/a-beautiful-fracture",
				duration: "2:20",
				artwork: "https://i1.sndcdn.com/artworks-gLLyhywYr4zsMals-jvwEOw-t500x500.jpg",
			},
			{
				title: "A Soft Cataclysm",
				url: "https://soundcloud.com/pneumaris/a-soft-cataclysm",
				duration: "1:01",
				artwork: "https://i1.sndcdn.com/artworks-swzioCSa9eHOPZ4u-0et5hw-t500x500.jpg",
			},
			{
				title: "Half-Haunted",
				url: "https://soundcloud.com/pneumaris/half-haunted",
				duration: "2:32",
				artwork: "https://i1.sndcdn.com/artworks-iXEQjSJLc8DJr4rj-b7XDpg-t500x500.jpg",
			},
		],
	},
	{
		title: "The Shape",
		type: "EP",
		year: "2026",
		releaseDate: "May 1, 2026",
		description:
			"The Shape is a three-song demo from Pneumaris, blending progressive metal, dark pop, and industrial atmosphere into a moody first glimpse of the project's sound. Heavy, melodic, and emotionally charged, the songs move through shadowy textures, shifting rhythms, and haunting hooks with a gothic edge.",
		artwork: "https://i1.sndcdn.com/artworks-1h7d12BvyGr14Fsx-IzEZ5A-t500x500.jpg",
		albumUrl: "https://soundcloud.com/pneumaris/sets/the-shape",
		spotifyUrl: "https://open.spotify.com/album/4wMdovuOOMvWyYrRZ18erR",
		appleMusicUrl: "https://music.apple.com/us/album/the-shape-single/6767819822",
		embedUrl:
			"https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pneumaris/sets/the-shape&start_track=0&color=%23b89a6a&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false",
		tracks: [
			{
				title: "Static Halo",
				url: "https://soundcloud.com/pneumaris/static-halo",
				duration: "2:28",
				artwork: "https://i1.sndcdn.com/artworks-SzWxu29uGkaenhdQ-DGB1yQ-t500x500.jpg",
			},
			{
				title: "Silk & Silence",
				url: "https://soundcloud.com/pneumaris/silk-silence",
				duration: "2:09",
				artwork: "https://i1.sndcdn.com/artworks-xeySKzCznqgJ0GHa-GvDjjg-t500x500.jpg",
			},
			{
				title: "Velvet Teeth",
				url: "https://soundcloud.com/pneumaris/velvet-teeth",
				duration: "2:02",
				artwork: "https://i1.sndcdn.com/artworks-EHWu6gOTIhWUSefi-j6fQRw-t500x500.jpg",
			},
		],
	},
];
