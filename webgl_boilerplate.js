const vsSource = await fetch("vertex.shader").then(response => response.text());
const fsSource = await fetch("fragment.shader").then(response => response.text());


export function makeProgram(gl) {
	const program = gl.createProgram();

	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	gl.attachShader(program, vertexShader);

	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
		return null;
	}

	gl.useProgram(program);
	return program;
}


function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}


export function defineRenderParameters(gl) {
	gl.clearColor(0.97, 0.97, 1.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	// gl.enable(gl.CULL_FACE);
	// gl.frontFace(gl.CCW);
}


export function makeVertexBuffer(gl, floatArray, glLocation, drawMethod, divisor){
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, floatArray, drawMethod);
	gl.vertexAttribPointer(glLocation, 3, gl.FLOAT, false, 0, 0);
	gl.vertexAttribDivisor(glLocation, divisor);
	gl.enableVertexAttribArray(glLocation);

	return buffer;
}


export function makeIndexBuffer(gl, indices){
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}


export function draw(gl, glLocation, buffer, type, count) {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.enableVertexAttribArray(glLocation);
	gl.vertexAttribPointer(glLocation, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(type, 0, count);
}
