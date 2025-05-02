
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ProductViewerProps {
  modelType: string;
}

const ProductViewer = ({ modelType }: ProductViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);
    
    // Create geometry based on modelType
    let geometry;
    let material;
    let mesh;
    
    switch(modelType) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(2, 32, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x4CAF50,
          shininess: 100
        });
        mesh = new THREE.Mesh(geometry, material);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x4CAF50,
          shininess: 100
        });
        mesh = new THREE.Mesh(geometry, material);
        break;
      default:
        // Default cube
        geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x4CAF50,
          shininess: 100
        });
        mesh = new THREE.Mesh(geometry, material);
    }
    
    scene.add(mesh);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelType]);
  
  return (
    <div ref={mountRef} className="w-full h-full bg-gradient-to-br from-secondary to-background"></div>
  );
};

export default ProductViewer;
