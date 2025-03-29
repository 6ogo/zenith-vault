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
        // Enhanced color palette with more vibrant colors
        vec3 primaryColor = vec3(0.0, 0.2, 0.4);     // Deep Blue (#003366)
        vec3 accentColor = vec3(0.0, 0.8, 0.4);      // Bright Green (#00CC66)
        vec3 secondaryAccent = vec3(0.0, 0.5, 0.8);  // Sky Blue (#0080CC)
        vec3 tertiaryAccent = vec3(0.8, 0.3, 0.0);   // Orange Accent (#CC5000)
        vec3 highlightColor = mix(primaryColor, accentColor, 0.6); // Enhanced blend
        vec3 outlineColor = accentColor;             // Bright Green outlines
        vec3 bgColor = vec3(0.94, 0.94, 0.94);       // Light Gray (#F0F0F0)
        
        // Smaller grid size for higher quality visualization
        float gridSize = 24.0; // Reduced from 32 for larger squares
        
        // More dynamic movement
        float timeScale = 0.12;
        vec2 offset = vec2(sin(uTime * 0.1) * 0.05, uTime * timeScale);
        float horizontalDrift = sin(uTime * 0.2) * 0.05;
        offset.x += horizontalDrift * sin(vPosition.y * 4.0);
        
        vec2 cell = floor((vPosition + offset) * gridSize);
        vec2 cellPos = fract((vPosition + offset) * gridSize) - 0.5;
        
        // Enhanced randomization for more natural data flow
        float rand = random(cell);
        float randSize = random(cell + 0.7) * 0.25 + 0.2; // Increased size by ~25%
        
        // Data packet shapes - larger squares
        float boxWidth = randSize * 0.8;  // Increased from 0.7
        float boxHeight = randSize * 0.6; // Increased from 0.5
        float box = smoothStep(-boxWidth, -boxWidth + 0.01, cellPos.x) * 
                   smoothStep(boxWidth - 0.01, boxWidth, -cellPos.x) *
                   smoothStep(-boxHeight, -boxHeight + 0.01, cellPos.y) * 
                   smoothStep(boxHeight - 0.01, boxHeight, -cellPos.y);
        
        // More vibrant animation
        float pulseSpeed = rand * 2.0 + 1.0;
        float pulse = sin(uTime * pulseSpeed + rand * 6.28) * 0.5 + 0.5;
        
        // Enhanced data streams with clearer flow patterns
        float dataStream = step(0.65, random(floor(cell * 0.15))); // Slightly increased frequency
        float dataActivity = step(0.42, rand) * dataStream; // More active cells
        float streamPulse = sin(uTime * 2.0 + vPosition.y * 12.0) * 0.5 + 0.5;
        
        // More vibrant color blending
        vec3 baseColor = mix(primaryColor, accentColor * 0.6, 0.3);
        
        // Add color variation based on position and random values
        float colorVariation = random(cell * 0.5 + uTime * 0.01);
        vec3 activeColor;
        
        if (colorVariation < 0.33) {
            activeColor = mix(accentColor, secondaryAccent, rand * 0.8);
        } else if (colorVariation < 0.66) {
            activeColor = mix(secondaryAccent, highlightColor, rand * 0.7);
        } else {
            // Occasionally add orange highlights for contrast
            activeColor = mix(accentColor, tertiaryAccent, rand * 0.5);
        }
        
        float activity = dataActivity * streamPulse;
        vec3 finalColor = mix(baseColor, activeColor, min(1.0, activity + pulse * 0.6));
        
        // Enhanced connecting lines for better flow visualization
        float lineWidth = 0.025; // Thicker lines
        float lineOutlineWidth = 0.035; // Width of line outlines
        float lineY = abs(cellPos.y);
        float lineX = abs(cellPos.x);
        float dataLine = 0.0;
        float dataLineOutline = 0.0;
        
        if (dataStream > 0.5) {
            // Main lines
            float horizontalLine = smoothStep(lineWidth, 0.0, lineY) * step(abs(cellPos.x), 0.4);
            float verticalLine = smoothStep(lineWidth, 0.0, lineX) * step(abs(cellPos.y), 0.4);
            dataLine = max(horizontalLine, verticalLine);
            
            // Random pattern for outlines - increased to 40% of lines get outlines
            float outlineRandomizer = random(cell * 1.5 + 0.42);
            bool shouldDrawOutline = outlineRandomizer > 0.6; // Changed from 0.7
            
            if (shouldDrawOutline) {
                // Create interesting patterns for the outlines
                float patternType = floor(random(cell + 0.789) * 4.0); // 0, 1, 2, or 3 (added one more pattern)
                
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
                } else if (patternType < 3.0) {
                    // Pattern 3: Corner outlines only
                    float cornerFactor = step(0.25, abs(cellPos.x)) * step(0.25, abs(cellPos.y));
                    float horizontalOutline = smoothStep(lineOutlineWidth, lineWidth, lineY) * step(abs(cellPos.x), 0.42) * cornerFactor;
                    float verticalOutline = smoothStep(lineOutlineWidth, lineWidth, lineX) * step(abs(cellPos.y), 0.42) * cornerFactor;
                    dataLineOutline = max(horizontalOutline, verticalOutline);
                } else {
                    // Pattern 4: Rainbow pulse effect (new)
                    float rainbowPulse = sin(uTime * 3.0 + cellPos.x * 3.0 - cellPos.y * 3.0) * 0.5 + 0.5;
                    float horizontalOutline = smoothStep(lineOutlineWidth, lineWidth, lineY) * step(abs(cellPos.x), 0.45);
                    float verticalOutline = smoothStep(lineOutlineWidth, lineWidth, lineX) * step(abs(cellPos.y), 0.45);
                    dataLineOutline = max(horizontalOutline, verticalOutline) * rainbowPulse;
                    
                    // For this pattern, use more varied colors
                    randomOutlineColor = mix(secondaryAccent, tertiaryAccent, rainbowPulse);
                }
            }
            
            // Add random glowing nodes at line intersections (slightly more of them)
            float intersection = step(0.96, random(cell * 0.3)) * 
                               step(lineWidth * 1.5, abs(lineY)) * 
                               step(lineWidth * 1.5, abs(lineX)) * 
                               step(abs(cellPos.x), 0.12) * 
                               step(abs(cellPos.y), 0.12);
                               
            dataLineOutline = max(dataLineOutline, intersection * (sin(uTime * 3.0 + rand * 10.0) * 0.5 + 1.8));
        }
        
        // Enhanced edge glow for better visibility
        float edgeThickness = 0.026; // Thicker edges
        float edge = (1.0 - smoothStep(boxWidth - edgeThickness, boxWidth, abs(cellPos.x))) * 
                    (step(-boxWidth, cellPos.x) * step(cellPos.x, boxWidth)) +
                    (1.0 - smoothStep(boxHeight - edgeThickness, boxHeight, abs(cellPos.y))) * 
                    (step(-boxHeight, cellPos.y) * step(cellPos.y, boxHeight));
        edge = min(edge, 1.0);
        
        // Dynamic edge colors based on position
        vec3 edgeColor;
        float edgeColorSelector = random(cell + 0.31 + uTime * 0.01);
        
        if (edgeColorSelector < 0.4) {
            edgeColor = mix(highlightColor, vec3(1.0), 0.4) * (1.0 + pulse * 0.5);
        } else if (edgeColorSelector < 0.7) {
            edgeColor = mix(secondaryAccent, vec3(1.0), 0.3) * (1.0 + pulse * 0.5);
        } else {
            edgeColor = mix(tertiaryAccent, vec3(1.0), 0.3) * (1.0 + pulse * 0.5);
        }
        
        vec3 lineColor = mix(accentColor * 0.8, highlightColor, streamPulse);
        
        // Random outlines on lines with varied intensity and colors
        float randomOutlineIntensity = random(cell + 0.68) * 3.0; // Increased intensity
        vec3 randomOutlineColor = outlineColor;
        
        // Occasionally use different colors for outlines
        float outlineColorSelector = random(cell + 0.5);
        if (outlineColorSelector > 0.7) {
            randomOutlineColor = secondaryAccent;
        } else if (outlineColorSelector > 0.4) {
            randomOutlineColor = mix(outlineColor, secondaryAccent, 0.5);
        }
        
        // Final color composition
        finalColor = mix(finalColor, edgeColor, edge * 0.9);
        finalColor = mix(finalColor, lineColor, dataLine * 0.8);
        finalColor = mix(finalColor, randomOutlineColor, dataLineOutline * randomOutlineIntensity);
        
        // Increased overall opacity for better visibility
        float alpha = max(box * (0.85 + activity * 0.35), max(dataLine * 0.7, dataLineOutline * 0.9) * dataStream);
        
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