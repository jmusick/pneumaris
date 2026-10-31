interface Widget {
	bind(event: string, listener: (event?: { currentPosition: number }) => void): void;
	load(url: string, options: Record<string, unknown>): void;
	play(): void;
	pause(): void;
	seekTo(position: number): void;
	getDuration(callback: (duration: number) => void): void;
}

interface WidgetFactory {
	(iframe: HTMLIFrameElement): Widget;
	Events: Record<string, string>;
}

declare global {
	interface Window { SC?: { Widget: WidgetFactory }; }
}

export function initializeTrackPlayer() {
	const player = document.getElementById("track-player");
	if (!player) return;
	const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-track-url]"));
	const title = document.getElementById("player-title")!;
	const artwork = document.getElementById("player-artwork") as HTMLImageElement;
	const source = document.getElementById("player-source") as HTMLAnchorElement;
	const toggle = document.getElementById("player-toggle") as HTMLButtonElement;
	const seek = document.getElementById("player-seek") as HTMLInputElement;
	const time = document.getElementById("player-time")!;
	const status = document.getElementById("player-status")!;
	const embed = document.getElementById("player-embed")!;
	const nativeToggle = document.getElementById("player-native-toggle")!;
	let active: HTMLButtonElement | null = null;
	let widget: Widget | null = null;
	let ready: Promise<Widget> | null = null;
	let apiPromise: Promise<WidgetFactory> | null = null;
	let loadedUrl = "";
	let playing = false;
	let loading = false;
	let failed = false;
	let duration = 0;
	let position = 0;
	let seeking = false;
	let request = 0;
	let generation = 0;
	let cancelReady: (() => void) | null = null;
	let startupTimer: ReturnType<typeof setTimeout> | undefined;

	const formatTime = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
	};
	const render = () => {
		player.dataset.playing = String(playing);
		toggle.disabled = loading;
		toggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${active?.dataset.trackTitle || "track"}`);
		seek.disabled = loading || failed || !duration;
		seek.max = String(duration || 1);
		seek.value = String(position);
		seek.setAttribute("aria-valuetext", `${formatTime(position)} of ${formatTime(duration)}`);
		time.textContent = `${formatTime(position)} / ${formatTime(duration)}`;
		buttons.forEach((button) => {
			const isPlaying = button === active && playing;
			button.setAttribute("aria-pressed", String(isPlaying));
			button.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${button.dataset.trackTitle}`);
			button.setAttribute("aria-busy", String(button === active && loading));
			const label = button.querySelector(".track-play-label");
			if (label) label.textContent = isPlaying ? "Pause" : "Play";
		});
	};
	const fail = () => {
		clearTimeout(startupTimer);
		loading = false;
		playing = false;
		failed = true;
		status.textContent = "Playback could not start. Try Play again, use SoundCloud controls, or open the track on SoundCloud.";
		render();
	};
	const loadApi = (): Promise<WidgetFactory> => {
		if (window.SC?.Widget) return Promise.resolve(window.SC.Widget);
		if (apiPromise) return apiPromise;
		apiPromise = new Promise<WidgetFactory>((resolve, reject) => {
			const script = document.createElement("script");
			const timer = setTimeout(() => { script.remove(); reject(new Error("SoundCloud API timed out")); }, 12000);
			script.src = "https://w.soundcloud.com/player/api.js";
			script.async = true;
			script.addEventListener("load", () => {
				clearTimeout(timer);
				if (window.SC?.Widget) resolve(window.SC.Widget);
				else { script.remove(); reject(new Error("SoundCloud API unavailable")); }
			});
			script.addEventListener("error", () => {
				clearTimeout(timer);
				script.remove();
				reject(new Error("SoundCloud API blocked"));
			});
			document.head.appendChild(script);
		}).catch((error) => { apiPromise = null; throw error; });
		return apiPromise;
	};
	const createIframe = (url: string) => {
		const iframe = document.createElement("iframe");
		iframe.title = "SoundCloud playback controls";
		iframe.allow = "autoplay";
		iframe.referrerPolicy = "strict-origin-when-cross-origin";
		const visible = embed.dataset.visible === "true";
		iframe.tabIndex = visible ? 0 : -1;
		iframe.setAttribute("aria-hidden", String(!visible));
		const params = new URLSearchParams({ url, auto_play: "false", color: "#b89a6a", show_comments: "false", show_artwork: "true", visual: "false" });
		iframe.src = `https://w.soundcloud.com/player/?${params}`;
		embed.replaceChildren(iframe);
		return iframe;
	};
	const ensureWidget = (url: string): Promise<Widget> => {
		if (ready) return ready;
		const epoch = generation;
		ready = loadApi().then((factory) => new Promise<Widget>((resolve, reject) => {
			if (epoch !== generation) { reject(new Error("Player closed")); return; }
			const iframe = createIframe(url);
			const instance = factory(iframe);
			widget = instance;
			loadedUrl = url;
			const events = factory.Events;
			const timer = setTimeout(() => reject(new Error("SoundCloud player timed out")), 12000);
			cancelReady = () => { clearTimeout(timer); reject(new Error("Player closed")); };
			instance.bind(events.READY, () => {
				clearTimeout(timer);
				if (epoch !== generation || widget !== instance) return;
				cancelReady = null;
				resolve(instance);
			});
			instance.bind(events.ERROR, () => {
				clearTimeout(timer);
				reject(new Error("SoundCloud track unavailable"));
				if (widget === instance && active) fail();
			});
			instance.bind(events.PLAY, () => {
				if (widget !== instance || loading || !active) return;
				clearTimeout(startupTimer);
				playing = true;
				failed = false;
				status.textContent = "";
				render();
			});
			instance.bind(events.PAUSE, () => {
				if (widget !== instance || loading) return;
				playing = false;
				render();
			});
			instance.bind(events.PLAY_PROGRESS, (event) => {
				if (widget !== instance || loading || !event) return;
				position = event.currentPosition;
				// Progress updates must not overwrite a seek while the visitor drags it.
				if (seeking) return;
				seek.value = String(position);
				seek.setAttribute("aria-valuetext", `${formatTime(position)} of ${formatTime(duration)}`);
				time.textContent = `${formatTime(position)} / ${formatTime(duration)}`;
			});
			instance.bind(events.FINISH, () => {
				if (widget !== instance || !active) return;
				const next = buttons[buttons.indexOf(active) + 1];
				if (next?.dataset.trackAlbum === active.dataset.trackAlbum) void playTrack(next);
				else { playing = false; position = 0; status.textContent = "End of release."; render(); }
			});
		})).catch((error) => { if (epoch === generation) ready = null; throw error; });
		return ready;
	};
	const start = (instance: Widget, version: number) => {
		if (request !== version || !active) return;
		loading = false;
		instance.getDuration((value) => { if (request === version) { duration = value; render(); } });
		status.textContent = "Press Play if playback does not start.";
		render();
		instance.play();
		clearTimeout(startupTimer);
		startupTimer = setTimeout(() => {
			if (request === version && !playing) status.textContent = "Press Play or use SoundCloud controls to start playback.";
		}, 4000);
	};
	async function playTrack(button: HTMLButtonElement) {
		if (button === active && loading) return;
		if (button === active && widget && !failed) {
			if (playing) widget.pause();
			else widget.play();
			return;
		}
		const version = ++request;
		if (failed) loadedUrl = "";
		widget?.pause();
		clearTimeout(startupTimer);
		active = button;
		loading = true;
		playing = false;
		failed = false;
		seeking = false;
		duration = position = 0;
		player.hidden = false;
		document.body.classList.add("has-track-player");
		title.textContent = button.dataset.trackTitle || "";
		artwork.src = button.dataset.trackArtwork || "";
		source.href = button.dataset.trackUrl!;
		status.textContent = "Loading from SoundCloud…";
		render();
		try {
			const instance = await ensureWidget(button.dataset.trackUrl!);
			if (request !== version) return;
			if (loadedUrl === button.dataset.trackUrl) start(instance, version);
			else {
				loadedUrl = button.dataset.trackUrl!;
				startupTimer = setTimeout(() => { if (request === version) fail(); }, 12000);
				instance.load(loadedUrl, { auto_play: false, show_comments: false, callback: () => {
					if (request !== version) return;
					clearTimeout(startupTimer);
					start(instance, version);
				} });
			}
		} catch {
			if (request === version) fail();
		}
	}
	buttons.forEach((button) => button.addEventListener("click", () => { void playTrack(button); }));
	toggle.addEventListener("click", () => { if (active) void playTrack(active); });
	seek.addEventListener("pointerdown", () => { seeking = true; });
	seek.addEventListener("pointercancel", () => { seeking = false; });
	seek.addEventListener("blur", () => { seeking = false; });
	seek.addEventListener("input", () => {
		seeking = true;
		position = Number(seek.value);
		seek.setAttribute("aria-valuetext", `${formatTime(position)} of ${formatTime(duration)}`);
		time.textContent = `${formatTime(position)} / ${formatTime(duration)}`;
	});
	seek.addEventListener("change", () => {
		seeking = false;
		widget?.seekTo(Number(seek.value));
	});
	nativeToggle.addEventListener("click", () => {
		const visible = embed.dataset.visible !== "true";
		embed.dataset.visible = String(visible);
		if (visible && !embed.querySelector("iframe") && active) createIframe(active.dataset.trackUrl!);
		document.body.classList[visible ? "add" : "remove"]("has-native-player");
		nativeToggle.setAttribute("aria-expanded", String(visible));
		const iframe = embed.querySelector("iframe");
		iframe?.setAttribute("aria-hidden", String(!visible));
		if (iframe) iframe.tabIndex = visible ? 0 : -1;
	});
	document.getElementById("player-close")!.addEventListener("click", () => {
		request++;
		generation++;
		cancelReady?.();
		cancelReady = null;
		clearTimeout(startupTimer);
		widget?.pause();
		widget = null;
		ready = null;
		loadedUrl = "";
		playing = loading = seeking = false;
		embed.replaceChildren();
		embed.dataset.visible = "false";
		nativeToggle.setAttribute("aria-expanded", "false");
		player.hidden = true;
		document.body.classList.remove("has-track-player");
		document.body.classList.remove("has-native-player");
		active?.focus();
		active = null;
		render();
	});
}
