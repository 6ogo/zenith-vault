import React, { useEffect, useRef } from "react";

interface DataFlowBackgroundProps {
  className?: string;
}

const DataFlowBackground: React.FC<DataFlowBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        if (gl) {
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
      }
    };

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL 2 not supported');
      return;
    }

    const vss = `#version 300 es
    in vec2 position;
    out vec2 vPosition;

    void main() {
      vPosition = position;
      gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    const fss = `#version 300 es
    precision highp float;
    out vec4 outColor;
    in vec2 vPosition;
    uniform float uTime;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Improved smoothing function
    float smoothStep(float edge0, float edge1, float x) {
        float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    }

    void main() {
        // Refined color scheme
        vec3 primaryColor = vec3(0.0, 0.2, 0.4);    // Deep Blue
        vec3 accentColor = vec3(0.0, 0.8, 0.4);     // Bright Green
        vec3 bgColor = vec3(0.94, 0.94, 0.94);      // Light Gray
        
        // Refined grid size for clearer visuals
        float gridSize = 24.0;
        
        // Smoother movement
        float timeScale = 0.08;
        vec2 offset = vec2(0.0, uTime * timeScale);
        float horizontalDrift = sin(uTime * 0.15) * 0.03;
        offset.x += horizontalDrift * sin(vPosition.y * 3.0);
        
        vec2 cell = floor((vPosition + offset) * gridSize);
        vec2 cellPos = fract((vPosition + offset) * gridSize) - 0.5;
        
        // Controlled randomization
        float rand = random(cell);
        float randSize = random(cell + 0.7) * 0.2 + 0.1;
        
        // Cleaner box shapes
        float boxWidth = randSize * 0.8;
        float boxHeight = randSize * 0.6;
        float box = smoothStep(-boxWidth, -boxWidth + 0.01, cellPos.x) * 
                   smoothStep(boxWidth - 0.01, boxWidth, -cellPos.x) *
                   smoothStep(-boxHeight, -boxHeight + 0.01, cellPos.y) * 
                   smoothStep(boxHeight - 0.01, boxHeight, -cellPos.y);
        
        // Refined animation
        float pulseSpeed = rand * 1.5 + 0.5;
        float pulse = sin(uTime * pulseSpeed + rand * 6.28) * 0.5 + 0.5;
        
        // More organized data streams
        float dataStream = step(0.85, random(floor(cell * 0.2)));
        float dataActivity = step(0.6, rand) * dataStream;
        float streamPulse = sin(uTime * 1.5 + vPosition.y * 8.0) * 0.5 + 0.5;
        
        // Enhanced color blending
        vec3 baseColor = mix(primaryColor, accentColor * 0.4, 0.15);
        vec3 activeColor = mix(primaryColor, accentColor, rand * 0.6 + 0.2);
        
        float activity = dataActivity * streamPulse;
        vec3 finalColor = mix(baseColor, activeColor, min(1.0, activity + pulse * 0.3));
        
        // Refined connecting lines
        float lineWidth = 0.01;
        float lineY = abs(cellPos.y);
        float lineX = abs(cellPos.x);
        float dataLine = 0.0;
        
        if (dataStream > 0.5) {
            float horizontalLine = smoothStep(lineWidth, 0.0, lineY) * step(abs(cellPos.x), 0.3);
            float verticalLine = smoothStep(lineWidth, 0.0, lineX) * step(abs(cellPos.y), 0.3);
            dataLine = max(horizontalLine, verticalLine);
        }
        
        // Enhanced edge glow
        float edgeThickness = 0.015;
        float edge = (1.0 - smoothStep(boxWidth - edgeThickness, boxWidth, abs(cellPos.x))) * 
                    (step(-boxWidth, cellPos.x) * step(cellPos.x, boxWidth)) +
                    (1.0 - smoothStep(boxHeight - edgeThickness, boxHeight, abs(cellPos.y))) * 
                    (step(-boxHeight, cellPos.y) * step(cellPos.y, boxHeight));
        edge = min(edge, 1.0);
        
        vec3 edgeColor = mix(accentColor, vec3(1.0), 0.3) * (0.8 + pulse * 0.4);
        vec3 lineColor = mix(accentColor * 0.6, accentColor, streamPulse);
        
        // Final color composition
        finalColor = mix(finalColor, edgeColor, edge * 0.7);
        finalColor = mix(finalColor, lineColor, dataLine * 0.6);
        
        // Refined transparency
        float alpha = max(box * (0.5 + activity * 0.4), dataLine * 0.3 * dataStream);
        alpha *= 0.8; // Slightly reduce overall opacity
        
        outColor = vec4(finalColor, alpha);
    }
    `;

    const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
      const program = gl.createProgram();
      if (!program) return null;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
      }
      
      return program;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vss);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fss);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    const timeUniformLocation = gl.getUniformLocation(program, "uTime");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    resizeCanvas();
    gl.clearColor(0.94, 0.94, 0.94, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const startTime = Date.now();

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      
      gl.uniform1f(timeUniformLocation, currentTime);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full -z-10 opacity-40 ${className}`}
      aria-hidden="true"
    />
  );
};

export default DataFlowBackground;