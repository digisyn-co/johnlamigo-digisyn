(function(){
  "use strict";
  var canvas = document.getElementById('shader-canvas');
  if(!canvas) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if(!gl || reduce){ canvas.style.display='none'; return; }

  function resize(){
    var r = canvas.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  var vsSource = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }";
  var fsSource =
    "precision mediump float;" +
    "uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;" +
    "float noise(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }" +
    "void main(){" +
    "  vec2 uv = gl_FragCoord.xy / u_res.xy;" +
    "  vec2 m = u_mouse / u_res.xy;" +
    "  float d = distance(uv, m);" +
    "  float wave = sin((uv.x+uv.y)*6.0 + u_time*0.35 - d*4.0) * 0.5 + 0.5;" +
    "  vec3 base = mix(vec3(0.02,0.03,0.03), vec3(0.02,0.22,0.16), wave*0.6);" +
    "  base += (0.06/max(d,0.08)) * vec3(0.06,0.35,0.27);" +
    "  gl_FragColor = vec4(base, 1.0);" +
    "}";

  function compile(type, src){
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, vsSource);
  var fs = compile(gl.FRAGMENT_SHADER, fsSource);
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  var posLoc = gl.getAttribLocation(prog,'a_pos');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);

  var uRes = gl.getUniformLocation(prog,'u_res');
  var uTime = gl.getUniformLocation(prog,'u_time');
  var uMouse = gl.getUniformLocation(prog,'u_mouse');
  var mouse = {x:0,y:0};
  window.addEventListener('mousemove', function(e){
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = r.height - (e.clientY - r.top);
  });

  var start = Date.now();
  function frame(){
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (Date.now()-start)/1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES,0,6);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
