/** A shallow relief of the existing artwork, not a complete character model.
 * Its rounded cross-section supplies depth for small turns without new assets.
 * At zero rotation, inverse projection preserves the source image's placement.
 */
export interface CharacterSurface {
	draw(yaw: number, pitch: number): void;
	dispose(): void;
}

const vertexSource = `#version 300 es
precision highp float;
in vec2 a_uv;
in float a_depth;
in vec2 a_bounds;
uniform vec2 u_viewport;
uniform vec2 u_turn;
uniform float u_side;
out vec2 v_uv;
out vec3 v_position;
flat out float v_side;
out vec2 v_bounds;

void main() {
  v_uv = a_uv;
  v_side = u_side;
  v_bounds = a_bounds;
  float depth = a_depth;

  // 88% registration matches the static cutout beneath the fixed halo.
  vec2 source = vec2(115.2, 94.08) + a_uv * vec2(1689.6, 689.92);
  vec2 anchored = vec2(source.x - 960.0, 440.0 - source.y);
  float camera = 1800.0;
  // Matching front/back surfaces meet at their edges, keeping the silhouette
  // rounded when a turn reveals the far side of the hood or robe.
  vec3 point = vec3(anchored * (1.0 - depth / camera), depth * u_side);

  float cy = cos(u_turn.x), sy = sin(u_turn.x);
  point = vec3(cy * point.x + sy * point.z, point.y, -sy * point.x + cy * point.z);
  float cx = cos(u_turn.y), sx = sin(u_turn.y);
  point = vec3(point.x, cx * point.y - sx * point.z, sx * point.y + cx * point.z);
  v_position = point;

  vec2 projected = point.xy * camera / (camera - point.z);
  float cover = max(u_viewport.x / 1920.0, u_viewport.y / 784.0);
  vec2 clip = (projected + vec2(0.0, -48.0)) * cover * 2.0 / u_viewport;
  gl_Position = vec4(clip, -point.z / 600.0, 1.0);
}`;

const fragmentSource = `#version 300 es
precision highp float;
uniform sampler2D u_art;
in vec2 v_uv;
in vec3 v_position;
flat in float v_side;
in vec2 v_bounds;
out vec4 outColor;

void main() {
  vec4 color = texture(u_art, v_uv);
  if (v_side < 0.0) {
    // Fill the revealed side with nearby cloth rather than sampling the cutout's
    // transparent border. The inferred silhouette bounds keep this surface closed.
    float edge = min(v_uv.x - v_bounds.x, v_bounds.y - v_uv.x);
    if (edge <= 0.0) discard;
    float center = (v_bounds.x + v_bounds.y) * 0.5;
    color = texture(u_art, vec2(mix(center, v_uv.x, 0.9), v_uv.y));
    color.a = smoothstep(0.0, 0.001, edge);
  }
  if (color.a < 0.01) discard;
  vec3 normal = normalize(cross(dFdx(v_position), dFdy(v_position)));
  if (normal.z < 0.0) normal = -normal;
  float light = 0.92 + 0.10 * max(dot(normal, normalize(vec3(-0.35, 0.45, 1.0))), 0.0);
  if (v_side < 0.0) light *= 0.85;
  outColor = vec4(color.rgb * light, color.a);
}`;

export async function createCharacterSurface(canvas: HTMLCanvasElement): Promise<CharacterSurface | null> {
	const gl = canvas.getContext('webgl2', {
		alpha: true, antialias: true, premultipliedAlpha: true,
		powerPreference: 'low-power',
	});
	if (!gl) return null;

	const shaders: WebGLShader[] = [];
	const program = gl.createProgram();
	const vertices = gl.createBuffer();
	const indices = gl.createBuffer();
	const texture = gl.createTexture();
	const array = gl.createVertexArray();
	const dispose = () => {
		shaders.forEach(shader => gl.deleteShader(shader));
		gl.deleteProgram(program);
		gl.deleteBuffer(vertices);
		gl.deleteBuffer(indices);
		gl.deleteTexture(texture);
		gl.deleteVertexArray(array);
	};

	try {
		if (!program || !vertices || !indices || !texture || !array) throw new Error('Surface allocation failed');
		for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
			const shader = gl.createShader(type);
			if (!shader) throw new Error('Shader allocation failed');
			shaders.push(shader);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compilation failed');
			gl.attachShader(program, shader);
		}
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Surface linking failed');
		gl.useProgram(program);
		gl.bindVertexArray(array);

		const image = new Image(1920, 784);
		image.src = '/hero-character-v1.webp';
		await image.decode();
		if (gl.isContextLost()) throw new Error('Surface context unavailable');
		// Read the existing alpha silhouette to place depth at the real robe edges.
		// This analyzes the texture; it does not alter or generate another asset.
		const samplingCanvas = document.createElement('canvas');
		samplingCanvas.width = 1920;
		samplingCanvas.height = 784;
		const sampling = samplingCanvas.getContext('2d', { willReadFrequently: true });
		if (!sampling) throw new Error('Silhouette sampling unavailable');
		sampling.drawImage(image, 0, 0, 1920, 784);
		const pixels = sampling.getImageData(0, 0, 1920, 784).data;
		const smooth = (low: number, high: number, value: number) => {
			const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
			return t * t * (3 - 2 * t);
		};
		const columns = 180, rows = 180;
		const uv = new Float32Array((columns + 1) * (rows + 1) * 5);
		const triangles = new Uint16Array(columns * rows * 6);
		let vertex = 0, index = 0;
		for (let row = 0; row <= rows; row++) {
			const y = row / rows;
			const pixelRow = Math.min(783, Math.round(y * 783));
			let left = 1920, right = -1;
			for (let pixel = 0; pixel < 1920; pixel++) {
				if (pixels[(pixelRow * 1920 + pixel) * 4 + 3] > 16) {
					left = Math.min(left, pixel);
					right = pixel;
				}
			}
			const center = (left + right) / 2;
			const radius = Math.max(1, (right - left) / 2);
			const t = Math.max(0, Math.min(1, (y - 0.14) / 0.84));
			const height = (145 - 100 * smooth(0.2, 1, t)) * smooth(0.13, 0.22, y) * (1 - smooth(0.91, 1, y));
			for (let column = 0; column <= columns; column++) {
				// Put vertices exactly on both silhouette edges, where the front and
				// back meet. A rectangular UV grid leaves cracks at the alpha boundary.
				const pixelX = right >= left ? left + column / columns * (right - left) : 959.5;
				uv[vertex++] = (pixelX + 0.5) / 1920;
				uv[vertex++] = y;
				const pixelColumn = Math.min(1919, Math.round(pixelX));
				const across = (pixelX - center) / radius;
				const alpha = pixels[(pixelRow * 1920 + pixelColumn) * 4 + 3] / 255;
				uv[vertex++] = Math.sqrt(Math.max(0, 1 - across * across)) * height * smooth(0, 1, alpha);
				uv[vertex++] = (left + 0.5) / 1920;
				uv[vertex++] = (right + 0.5) / 1920;
				if (row === rows || column === columns) continue;
				const a = row * (columns + 1) + column;
				const b = a + 1, c = a + columns + 1, d = c + 1;
				triangles.set([a, c, b, b, c, d], index);
				index += 6;
			}
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
		gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
		const attribute = gl.getAttribLocation(program, 'a_uv');
		gl.enableVertexAttribArray(attribute);
		gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 20, 0);
		const depthAttribute = gl.getAttribLocation(program, 'a_depth');
		gl.enableVertexAttribArray(depthAttribute);
		gl.vertexAttribPointer(depthAttribute, 1, gl.FLOAT, false, 20, 8);
		const boundsAttribute = gl.getAttribLocation(program, 'a_bounds');
		gl.enableVertexAttribArray(boundsAttribute);
		gl.vertexAttribPointer(boundsAttribute, 2, gl.FLOAT, false, 20, 12);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles, gl.STATIC_DRAW);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(gl.getUniformLocation(program, 'u_art'), 0);
		gl.enable(gl.BLEND);
		gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.DEPTH_TEST);
		gl.clearColor(0, 0, 0, 0);
		const viewport = gl.getUniformLocation(program, 'u_viewport');
		const turn = gl.getUniformLocation(program, 'u_turn');
		const side = gl.getUniformLocation(program, 'u_side');

		return {
			draw(yaw, pitch) {
				if (gl.isContextLost()) return;
				const rect = canvas.getBoundingClientRect();
				const ratio = Math.min(devicePixelRatio || 1, 1.5);
				const width = Math.max(1, Math.round(rect.width * ratio));
				const height = Math.max(1, Math.round(rect.height * ratio));
				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width;
					canvas.height = height;
				}
				gl.viewport(0, 0, width, height);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.uniform2f(viewport, rect.width, rect.height);
				gl.uniform2f(turn, yaw, pitch);
				gl.uniform1f(side, 1);
				gl.drawElements(gl.TRIANGLES, triangles.length, gl.UNSIGNED_SHORT, 0);
				gl.uniform1f(side, -1);
				gl.drawElements(gl.TRIANGLES, triangles.length, gl.UNSIGNED_SHORT, 0);
				canvas.dataset.yaw = yaw.toFixed(4);
				canvas.dataset.pitch = pitch.toFixed(4);
			},
			dispose,
		};
	} catch {
		dispose();
		return null;
	}
}
