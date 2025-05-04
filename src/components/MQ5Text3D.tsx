
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const MQ5Text3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 10;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);
    
    // Load font
    const fontLoader = new FontLoader();
    
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      // Create text geometry
      const textGeometry = new TextGeometry('MQ5', {
        font: font,
        size: 3,
        height: 0.8,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
      });
      
      // Center the text
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
      textGeometry.translate(-textWidth / 2, -1.5, 0);
      
      // Create materials
      const materials = [
        new THREE.MeshPhongMaterial({ color: 0x4CAF50, shininess: 100 }), // Front face - green
        new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 })  // Side face - white
      ];
      
      // Create mesh with materials
      const textMesh = new THREE.Mesh(textGeometry, materials);
      scene.add(textMesh);
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        textMesh.rotation.x += 0.01;
        textMesh.rotation.y += 0.01;
        
        renderer.render(scene, camera);
      };
      
      animate();
    });
    
    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={mountRef} className="w-full h-full"></div>;
};

export default MQ5Text3D;
