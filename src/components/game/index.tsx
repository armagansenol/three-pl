import { Sphere } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { useEffect, useRef, useState } from "react"
import { Group, PointLight, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import type { RapierRigidBody } from "@react-three/rapier"

import { Character } from "../character"
import { Obstacle } from "../obstacle"
import { StarrySky } from "../starry-sky"
import Ground from "../ground"

const Game = () => {
  const { camera, gl } = useThree()
  const worldRef = useRef<Group>(null)
  const moonLightRef = useRef<PointLight>(null)
  const characterRef = useRef<RapierRigidBody>(null)

  // Camera settings
  const cameraOffset = useRef(new Vector3(0, 5, 10))
  const cameraLookAt = useRef(new Vector3(0, 0, 0))
  const rotationAngle = useRef(0)
  const rotationSpeed = 0.005
  const [isDragging, setIsDragging] = useState(false)
  const lastMousePosition = useRef({ x: 0, y: 0 })

  // State to force component updates when rotation changes
  const [, forceUpdate] = useState({})

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    // Add mouse event listeners for camera rotation
    const canvas = gl.domElement

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      lastMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMousePosition.current.x
        rotationAngle.current -= deltaX * rotationSpeed
        lastMousePosition.current = { x: e.clientX, y: e.clientY }

        // Update camera position immediately when mouse moves
        if (characterRef.current) {
          const characterPosition = characterRef.current.translation()

          // Calculate new camera position
          cameraOffset.current.x = Math.sin(rotationAngle.current) * 10
          cameraOffset.current.z = Math.cos(rotationAngle.current) * 10

          // Update camera position
          camera.position.x = characterPosition.x + cameraOffset.current.x
          camera.position.y = characterPosition.y + cameraOffset.current.y
          camera.position.z = characterPosition.z + cameraOffset.current.z

          // Update camera look-at point
          cameraLookAt.current.set(characterPosition.x, characterPosition.y, characterPosition.z)
          camera.lookAt(cameraLookAt.current)
        }

        // Force re-render to update character rotation
        forceUpdate({})
      }
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [camera, gl, isDragging])

  // Update camera to follow character during movement
  useFrame(() => {
    if (characterRef.current) {
      const characterPosition = characterRef.current.translation()

      // Calculate camera position with orbit around character
      cameraOffset.current.x = Math.sin(rotationAngle.current) * 10
      cameraOffset.current.z = Math.cos(rotationAngle.current) * 10

      // Update camera position to follow character
      camera.position.x = characterPosition.x + cameraOffset.current.x
      camera.position.y = characterPosition.y + cameraOffset.current.y
      camera.position.z = characterPosition.z + cameraOffset.current.z

      // Update camera look-at point to center on character
      cameraLookAt.current.set(characterPosition.x, characterPosition.y, characterPosition.z)
      camera.lookAt(cameraLookAt.current)
    }
  })

  return (
    <group>
      {/* Moon with light source */}
      <group position={[15, 20, -15]}>
        <pointLight ref={moonLightRef} intensity={100000} distance={10} color="#b9c5ff" castShadow />
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial emissive="#b9c5ff" emissiveIntensity={0.5} color="#ffffff" />
        </Sphere>
      </group>

      {/* Additional ambient light for better visibility */}
      <ambientLight intensity={1} />

      <StarrySky />

      {/* Physics World */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* Uncomment Debug to see physics colliders */}
        {/* <Debug /> */}

        {/* World */}
        <group ref={worldRef}>
          <Ground />

          <Obstacle position={[-5, 1, -5]} radius={0.3} interactable={true} />
          <Obstacle position={[5, 1, -2]} radius={1.2} interactable={true} />
          <Obstacle position={[0, 1, -8]} radius={1.6} interactable={true} />
          <Obstacle position={[8, 1, -10]} radius={0.8} interactable={true} />
          <Obstacle position={[-8, 1, 5]} radius={2.2} interactable={true} />
        </group>

        {/* Character - with physics */}
        <Character ref={characterRef} rotationAngle={rotationAngle.current} />
      </Physics>
    </group>
  )
}

export { Game }
