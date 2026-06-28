import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function AuthScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#090B14', 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 1;
    camera.position.x = 2;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const updateSize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    updateSize();
    mountRef.current.appendChild(renderer.domElement);
    window.addEventListener('resize', updateSize);

    // 4. Create Particles (The Network)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25; // Spread particles over a 25 unit cube
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: '#6D5DFB',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 5. Create Core Geometry (The "Idea" or "Project")
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const icosahedronMaterial = new THREE.MeshBasicMaterial({ 
      color: '#6D5DFB', 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    scene.add(icosahedron);

    // Inner glowing core
    const coreGeometry = new THREE.IcosahedronGeometry(1.1, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: '#8B7CF8',
        roughness: 0.2,
        metalness: 0.8,
        emissive: '#1c155c',
        emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Orbiting rings
    const ringGeometry = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: '#6D5DFB', 
        transparent: true, 
        opacity: 0.3 
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring2);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#6D5DFB', 6, 20);
    pointLight.position.set(3, 3, 4);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight('#10B981', 4, 20); // Adding a subtle green hue
    pointLight2.position.set(-3, -3, -4);
    scene.add(pointLight2);

    // 7. GSAP Animations
    // Continuous rotations
    gsap.to(particlesMesh.rotation, {
      y: Math.PI * 2,
      duration: 80,
      repeat: -1,
      ease: "none"
    });

    gsap.to(icosahedron.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 30,
      repeat: -1,
      ease: "none"
    });

    gsap.to(core.rotation, {
      x: -Math.PI * 2,
      y: -Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    gsap.to(ring1.rotation, {
        z: Math.PI * 2,
        duration: 15,
        repeat: -1,
        ease: "none"
    });

    gsap.to(ring2.rotation, {
        x: Math.PI * 2,
        duration: 25,
        repeat: -1,
        ease: "none"
    });
    
    // Initial camera entrance animation
    gsap.from(camera.position, {
        z: 15,
        y: 5,
        x: 5,
        duration: 2.5,
        ease: "power3.out"
    });

    // 8. Mouse interaction (Parallax)
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 9. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      const floatOffset = Math.sin(elapsedTime * 0.8) * 0.15;
      icosahedron.position.y = floatOffset;
      core.position.y = floatOffset;
      ring1.position.y = floatOffset;
      ring2.position.y = floatOffset;
      
      // Parallax effect with mouse
      const targetX = mouseX * 0.8;
      const targetY = mouseY * 0.8;
      
      camera.position.x += (targetX - camera.position.x + 2) * 0.05;
      camera.position.y += (targetY - camera.position.y + 1) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      icosahedronGeometry.dispose();
      icosahedronMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full absolute inset-0 bg-[#090B14]" />;
}
