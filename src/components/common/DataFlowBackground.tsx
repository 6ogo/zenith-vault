
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

    // Set canvas size to match container
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
    
    // Initialize WebGL context
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL 2 not supported');
      return;
    }

    // Vertex shader - simple pass-through
    const vss = `#version 300 es
    in vec2 position;
    out vec2 vPosition;

    void main() {
      vPosition = position;
      gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    // Fragment shader - creates animated data flow boxes without mouse interaction
    const fss = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec2 vPosition;
    uniform float uTime;

    // Simple pseudo-random function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
        // Color scheme from company branding
        vec3 primaryColor = vec3(0.0, 0.2, 0.4); // #003366 Deep Blue
        vec3 accentColor = vec3(0.0, 0.8, 0.4);  // #00CC66 Bright Green
        vec3 bgColor = vec3(0.94, 0.94, 0.94);   // #F0F0F0 Light Gray
        
        // Calculate grid size and position - increased for smaller boxes
        float gridSize = 36.0; // Increased from 18.0 for smaller boxes
        
        // Add dataflow movement
        vec2 offset = vec2(0.0, uTime * 0.1); // Data flows downward
        
        // Add some horizontal drift for certain data blocks
        float horizontalDrift = sin(uTime * 0.2) * 0.05;
        offset.x += horizontalDrift * sin(vPosition.y * 5.0);
        
        vec2 cell = floor((vPosition + offset) * gridSize);
        vec2 cellPos = fract((vPosition + offset) * gridSize) - 0.5;
        
        // Generate random values for this cell
        float rand = random(cell);
        float randSize = random(cell + 0.7) * 0.25 + 0.05; // Box size varies - reduced for smaller boxes
        
        // Create data packet shapes with clear edges
        float boxWidth = randSize * 0.8;
        float boxHeight = randSize * 0.7; // Slightly rectangular for data packet look
        float box = step(-boxWidth, cellPos.x) * step(cellPos.x, boxWidth) * 
                    step(-boxHeight, cellPos.y) * step(cellPos.y, boxHeight);
        
        // Time-based animation with data packet pulses
        float pulseSpeed = rand * 2.0 + 0.5;
        float pulse = sin(uTime * pulseSpeed + rand * 10.0) * 0.5 + 0.5;
        
        // Create data streams - increased grid density for more defined pattern
        float dataStream = step(0.7, random(floor(cell * 0.15))); 
        float dataActivity = step(0.5, rand) * dataStream;
        float streamPulse = sin(uTime * 2.0 + vPosition.y * 10.0) * 0.5 + 0.5;
        
        // Color calculation - increase green presence
        vec3 baseColor = mix(primaryColor * 0.8, accentColor * 0.3, 0.2); // Add some green to base
        vec3 activeColor = mix(
            primaryColor,
            accentColor,
            rand * 0.9 + 0.1 // Increased from rand * 0.7 to ensure more green
        );
        
        // Apply different colors based on data activity - boost green influence
        float activity = dataActivity * streamPulse;
        vec3 finalColor = mix(baseColor, activeColor, min(1.0, (activity + pulse * 0.4) * 0.9)); // Increased mix
        
        // Add connecting lines between data blocks - thinner for sharper look
        float lineWidth = 0.015; // Reduced for sharper appearance
        float lineY = abs(cellPos.y);
        float lineX = abs(cellPos.x);
        float dataLine = 0.0;
        
        // Only draw lines for cells that are part of data streams
        if (dataStream > 0.5) {
            if (lineY < lineWidth && abs(cellPos.x) < 0.4) dataLine = 1.0; // Horizontal lines
            if (lineX < lineWidth && abs(cellPos.y) < 0.4) dataLine = 1.0; // Vertical lines
        }
        
        // Add edge glow with more green
        float edgeThickness = 0.025; // Reduced for sharper edges
        float edge = (1.0 - step(boxWidth - edgeThickness, abs(cellPos.x))) * 
                     (step(-boxWidth, cellPos.x) * step(cellPos.x, boxWidth)) +
                     (1.0 - step(boxHeight - edgeThickness, abs(cellPos.y))) * 
                     (step(-boxHeight, cellPos.y) * step(cellPos.y, boxHeight));
        edge = min(edge, 1.0);
        
        float edgeBrightness = 0.9 + pulse * 0.5; // Increased brightness for more definition
        vec3 edgeColor = accentColor * edgeBrightness;
        vec3 lineColor = mix(accentColor * 0.8, accentColor, streamPulse); // More green in lines
        
        // Combine box fill, edge and lines
        finalColor = mix(finalColor, edgeColor, edge * 0.9); // Increased edge intensity
        finalColor = mix(finalColor, lineColor, dataLine * 0.8); // Increased line intensity
        
        // Only draw where the box or lines are - increased alpha for better visibility
        float alpha = max(box * (0.6 + activity * 0.5), dataLine * 0.5 * dataStream);
        
        outColor = vec4(finalColor, alpha);
    }
    `;

    // Create shader helper function
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

    // Create program helper function
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

    // Compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vss);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fss);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    const timeUniformLocation = gl.getUniformLocation(program, "uTime");

    // Create buffer for a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Two triangles that cover the entire clip space
    const positions = [
      -1, -1,  // bottom left
      1, -1,   // bottom right
      -1, 1,   // top left
      1, 1     // top right
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Set up vertex array object
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2,          // 2 components per iteration
      gl.FLOAT,   // the data is 32bit floats
      false,      // don't normalize the data
      0,          // 0 = move forward size * sizeof(type) each iteration
      0           // start at the beginning of the buffer
    );

    // Set up WebGL state
    resizeCanvas();
    gl.clearColor(0.94, 0.94, 0.94, 0); // Transparent background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const startTime = Date.now();

    // Render function
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      
      gl.uniform1f(timeUniformLocation, currentTime);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    };

    // Start the animation
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
      className={`absolute top-0 left-0 w-full h-full -z-10 ${className}`}
      aria-hidden="true"
    />
  );
};

export default DataFlowBackground;
