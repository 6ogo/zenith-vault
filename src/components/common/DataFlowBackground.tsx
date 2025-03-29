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
        // Specific color palette as requested
        vec3 primaryColor = vec3(0.0, 0.2, 0.4);     // Deep Blue (#003366)
        vec3 accentColor = vec3(0.0, 0.8, 0.4);      // Bright Green (#00CC66)
        vec3 highlightColor = mix(primaryColor, accentColor, 0.5); // Blend between primary and accent
        vec3 outlineColor = accentColor;             // Bright Green outlines
        vec3 bgColor = vec3(0.94, 0.94, 0.94);       // Light Gray (#F0F0F0)
        
        // Smaller grid size for more detailed data flow visualization
        float gridSize = 32.0;
        
        // More dynamic movement
        float timeScale = 0.12;
        vec2 offset = vec2(sin(uTime * 0.1) * 0.05, uTime * timeScale);
        float horizontalDrift = sin(uTime * 0.2) * 0.05;
        offset.x += horizontalDrift * sin(vPosition.y * 4.0);
        
        vec2 cell = floor((vPosition + offset) * gridSize);
        vec2 cellPos = fract((vPosition + offset) * gridSize) - 0.5;
        
        // Enhanced randomization for more natural data flow
        float rand = random(cell);
        float randSize = random(cell + 0.7) * 0.2 + 0.15;
        
        // Data packet shapes
        float boxWidth = randSize * 0.7;
        float boxHeight = randSize * 0.5;
        float box = smoothStep(-boxWidth, -boxWidth + 0.01, cellPos.x) * 
                   smoothStep(boxWidth - 0.01, boxWidth, -cellPos.x) *
                   smoothStep(-boxHeight, -boxHeight + 0.01, cellPos.y) * 
                   smoothStep(boxHeight - 0.01, boxHeight, -cellPos.y);
        
        // More vibrant animation
        float pulseSpeed = rand * 2.0 + 1.0;
        float pulse = sin(uTime * pulseSpeed + rand * 6.28) * 0.5 + 0.5;
        
        // Enhanced data streams with clearer flow patterns
        float dataStream = step(0.68, random(floor(cell * 0.15))); // Moderate frequency of streams
        float dataActivity = step(0.45, rand) * dataStream; // Active cells
        float streamPulse = sin(uTime * 2.0 + vPosition.y * 12.0) * 0.5 + 0.5;
        
        // More vibrant color blending
        vec3 baseColor = mix(primaryColor, accentColor * 0.6, 0.25);
        vec3 activeColor = mix(accentColor, highlightColor, rand * 0.7 + 0.3);
        
        float activity = dataActivity * streamPulse;
        vec3 finalColor = mix(baseColor, activeColor, min(1.0, activity + pulse * 0.5));
        
        // Enhanced connecting lines for better flow visualization
        float lineWidth = 0.02; // Slightly thicker lines
        float lineOutlineWidth = 0.03; // Width of line outlines
        float lineY = abs(cellPos.y);
        float lineX = abs(cellPos.x);
        float dataLine = 0.0;
        float dataLineOutline = 0.0;
        
        if (dataStream > 0.5) {
            // Main lines
            float horizontalLine = smoothStep(lineWidth, 0.0, lineY) * step(abs(cellPos.x), 0.4);
            float verticalLine = smoothStep(lineWidth, 0.0, lineX) * step(abs(cellPos.y), 0.4);
            dataLine = max(horizontalLine, verticalLine);
            
            // Random pattern for outlines - only about 30% of lines get outlines
            float outlineRandomizer = random(cell * 1.5 + 0.42);
            bool shouldDrawOutline = outlineRandomizer > 0.7;
            
            if (shouldDrawOutline) {
                // Create interesting patterns for the outlines
                float patternType = floor(random(cell + 0.789) * 3.0); // 0, 1, or 2
                
                if (patternType < 1.0) {
                    // Pattern 1: Dashed outlines
                    float dashFreq = 5.0 + random(cell) * 8.0;
                    float dash = step(0.5, sin(cellPos.x * dashFreq) * sin(cellPos.y * dashFreq));
                    float horizontalOutline = smoothStep(lineOutlineWidth, lineWidth, lineY) * step(abs(cellPos.x), 0.42) * dash;
                    float verticalOutline = smoothStep(lineOutlineWidth, lineWidth, lineX) * step(abs(cellPos.y), 0.42) * dash;
                    dataLineOutline = max(horizontalOutline, verticalOutline);
                } else if (patternType < 2.0) {
                    // Pattern 2: Flowing pulse outlines
                    float pulse = sin(uTime * 2.0 + rand * 10.0 + cellPos.x * 5.0 + cellPos.y * 5.0) * 0.5 + 0.5;
                    float flowFactor = smoothStep(0.3, 0.7, pulse);
                    float horizontalOutline = smoothStep(lineOutlineWidth, lineWidth, lineY) * step(abs(cellPos.x), 0.42) * flowFactor;
                    float verticalOutline = smoothStep(lineOutlineWidth, lineWidth, lineX) * step(abs(cellPos.y), 0.42) * flowFactor;
                    dataLineOutline = max(horizontalOutline, verticalOutline);
                } else {
                    // Pattern 3: Corner outlines only
                    float cornerFactor = step(0.25, abs(cellPos.x)) * step(0.25, abs(cellPos.y));
                    float horizontalOutline = smoothStep(lineOutlineWidth, lineWidth, lineY) * step(abs(cellPos.x), 0.42) * cornerFactor;
                    float verticalOutline = smoothStep(lineOutlineWidth, lineWidth, lineX) * step(abs(cellPos.y), 0.42) * cornerFactor;
                    dataLineOutline = max(horizontalOutline, verticalOutline);
                }
            }
            
            // Add random glowing nodes at line intersections (fewer of them)
            float intersection = step(0.975, random(cell * 0.3)) * 
                               step(lineWidth * 1.5, abs(lineY)) * 
                               step(lineWidth * 1.5, abs(lineX)) * 
                               step(abs(cellPos.x), 0.1) * 
                               step(abs(cellPos.y), 0.1);
                               
            dataLineOutline = max(dataLineOutline, intersection * (sin(uTime * 3.0 + rand * 10.0) * 0.5 + 1.5));
        }
        
        // Enhanced edge glow for better visibility
        float edgeThickness = 0.023; // Slightly thicker edges
        float edge = (1.0 - smoothStep(boxWidth - edgeThickness, boxWidth, abs(cellPos.x))) * 
                    (step(-boxWidth, cellPos.x) * step(cellPos.x, boxWidth)) +
                    (1.0 - smoothStep(boxHeight - edgeThickness, boxHeight, abs(cellPos.y))) * 
                    (step(-boxHeight, cellPos.y) * step(cellPos.y, boxHeight));
        edge = min(edge, 1.0);
        
        vec3 edgeColor = mix(highlightColor, vec3(1.0), 0.4) * (1.0 + pulse * 0.5);
        vec3 lineColor = mix(accentColor * 0.8, highlightColor, streamPulse);
        
        // Random bright green outlines on some lines with varied intensity
        float randomOutlineIntensity = random(cell + 0.68) * 2.5;
        vec3 randomOutlineColor = outlineColor;
        
        // Final color composition
        finalColor = mix(finalColor, edgeColor, edge * 0.9);
        finalColor = mix(finalColor, lineColor, dataLine * 0.8);
        finalColor = mix(finalColor, randomOutlineColor, dataLineOutline * randomOutlineIntensity);
        
        // Increased overall opacity for better visibility
        float alpha = max(box * (0.8 + activity * 0.3), max(dataLine * 0.6, dataLineOutline * 0.8) * dataStream);
        
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
    gl.clearColor(0.94, 0.94, 0.94, 0); // Light Gray (#F0F0F0)
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
      className={`absolute top-0 left-0 w-full h-full -z-10 ${className}`}
      aria-hidden="true"
    />
  );
};

export default DataFlowBackground;