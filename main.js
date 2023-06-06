import {makeProgram, defineRenderParameters, makeVertexBuffer, draw} from './webgl_boilerplate.js';


const canvas = document.getElementsByTagName("canvas")[0];
const gl = canvas.getContext("webgl2");


function main() {
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	defineRenderParameters(gl);
	const program = makeProgram(gl);

	const glLocations = {
		scale: gl.getUniformLocation(program, 'Scale'),
		camera: gl.getUniformLocation(program, 'Camera'),
		rotation: gl.getUniformLocation(program, 'Rotation'),
		offset: gl.getAttribLocation(program, 'offset'),
		position: gl.getAttribLocation(program, 'position')
	};
	const buffers = {
		triangles: makeTriangles(gl, glLocations.position),
		points: makePoints(gl, glLocations.position)
	}

	renderer(canvas, glLocations, buffers);
}


function renderer(canvas, glLocations, buffers) {
	gl.uniform2fv(glLocations.scale, [1 * 3/4, 1]);


	function render() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		draw(gl, glLocations.position, buffers.triangles, gl.TRIANGLES, 66)
		draw(gl, glLocations.position, buffers.points, gl.POINTS, 16)
	}


	// Webgl uniforms
	let distance = 200;
	let yaw = 3, pitch = 0;
	let direction;

	function setCamera() {
		const cam = Array.from({ length: 3 }, (_, i) =>
			distance * direction[i]
		);
		gl.uniform3fv(glLocations.camera, cam);
	}

	function setRotation(){
		const cy = Math.cos(yaw),
			sy = Math.sin(yaw),
			cp = Math.cos(pitch),
			sp = Math.sin(pitch);

		direction = [
			cy * cp,
			sy * cp,
			sp
		];
		const rotationMatrix = [
			-sy, cy, 0,
			-cy*cp, -sy*cp, -sp,
			-cy*sp, -sy*sp, cp
		];

		gl.uniformMatrix3fv(glLocations.rotation, true, rotationMatrix);
		setCamera()
	}

	setRotation();
	requestAnimationFrame(render);


	// Events for controls
	let mousePos = null;

	canvas.addEventListener('mousedown', evt => {
	if (evt.button === 0) {
		evt.preventDefault();
		mousePos = [evt.clientX, evt.clientY];
	}});

	window.addEventListener('mousemove', evt => {
	if (mousePos) {
		yaw -= (evt.clientX - mousePos[0]) / 100;
		pitch += (evt.clientY - mousePos[1]) / 100;
		yaw = yaw % (2 * Math.PI);
		pitch = clampAngle(pitch, "pitch");

		mousePos = [evt.clientX, evt.clientY];
		setRotation()
		requestAnimationFrame(render);
	}});

	window.addEventListener('mouseup', evt => {
	if (evt.button === 0) {
		evt.preventDefault();
		mousePos = null;
	}});

	canvas.addEventListener("wheel", evt => {
		evt.preventDefault();
		distance += Math.sign(evt.deltaY) * 17;
		distance = Math.max(0, distance);
		setCamera();
		requestAnimationFrame(render);
	});
}


function makeTriangles(gl, glLocation) {
	const positions = new Float32Array([
		29.,  29.,  33.,
		176.,  46.,  38.,
		137.,  50., 184.,
		29.,  29.,  33.,
		249., 128.,  29.,
		176.,  46.,  38.,
		29.,  29.,  33.,
		128., 199.,  31.,
		94., 124.,  22.,
		29.,  29.,  33.,
		94., 124.,  22.,
		249., 128.,  29.,
		29.,  29.,  33.,
		137.,  50., 184.,
		60.,  68., 170.,
		29.,  29.,  33.,
		60.,  68., 170.,
		22., 156., 156.,
		29.,  29.,  33.,
		22., 156., 156.,
		128., 199.,  31.,
		176.,  46.,  38.,
		199.,  78., 189.,
		137.,  50., 184.,
		176.,  46.,  38.,
		249., 128.,  29.,
		199.,  78., 189.,
		94., 124.,  22.,
		128., 199.,  31.,
		249., 128.,  29.,
		60.,  68., 170.,
		137.,  50., 184.,
		58., 179., 218.,
		60.,  68., 170.,
		58., 179., 218.,
		22., 156., 156.,
		137.,  50., 184.,
		249., 255., 254.,
		58., 179., 218.,
		137.,  50., 184.,
		199.,  78., 189.,
		249., 255., 254.,
		22., 156., 156.,
		58., 179., 218.,
		128., 199.,  31.,
		243., 139., 170.,
		199.,  78., 189.,
		249., 128.,  29.,
		243., 139., 170.,
		249., 255., 254.,
		199.,  78., 189.,
		243., 139., 170.,
		249., 128.,  29.,
		249., 255., 254.,
		128., 199.,  31.,
		254., 216.,  61.,
		249., 128.,  29.,
		128., 199.,  31.,
		249., 255., 254.,
		254., 216.,  61.,
		128., 199.,  31.,
		58., 179., 218.,
		249., 255., 254.,
		254., 216.,  61.,
		249., 255., 254.,
		249., 128.,  29.,
	]);

	return makeVertexBuffer(gl, positions, glLocation, gl.STATIC_DRAW, 0);
}

function makePoints(gl, glLocation) {
	const positions = new Float32Array([
		29.,  29.,  33.,
		176.,  46.,  38.,
		94., 124.,  22.,
		131.,  84.,  50.,
		60.,  68., 170.,
		137.,  50., 184.,
		22., 156., 156.,
		157., 157., 151.,
		71.,  79.,  82.,
		243., 139., 170.,
		128., 199.,  31.,
		254., 216.,  61.,
		58., 179., 218.,
		199.,  78., 189.,
		249., 128.,  29.,
		249., 255., 254.,
	]);

	return makeVertexBuffer(gl, positions, glLocation, gl.STATIC_DRAW, 0);
}


function clampAngle(angle, type) {
	const ninty = Math.PI / 2.2;

	if (type == "yaw")
	return Math.max(Math.PI-ninty, Math.min(Math.PI+ninty, angle));

	if (type == "pitch")
	return Math.max(-ninty, Math.min(ninty, angle));
}


main();
// document.getElementById("text").hidden = false;
