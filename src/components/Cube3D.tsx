
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Cube3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create cube
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    
    // Create materials for each face of the cube with cana verde color and white
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x4CAF50 }), // Right - green
      new THREE.MeshBasicMaterial({ color: 0x4CAF50 }), // Left - green
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF }), // Top - white
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF }), // Bottom - white
      new THREE.MeshBasicMaterial({ color: 0x4CAF50 }), // Front - green
      new THREE.MeshBasicMaterial({ color: 0x4CAF50 }), // Back - green
    ];
    
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={mountRef} className="w-full h-full"></div>;
};

export default Cube3D;
