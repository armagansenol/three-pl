import { useRef, useEffect, forwardRef, useLayoutEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import type { RapierRigidBody } from "@react-three/rapier"
import { Vector3, Mesh } from "three"

interface CharacterProps {
  rotationAngle?: number
}

export const Character = forwardRef<RapierRigidBody, CharacterProps>(({ rotationAngle = 0 }, ref) => {
  const characterRef = useRef<RapierRigidBody>(null)
  const modelRef = useRef<Mesh>(null)
  const velocity = useRef<Vector3>(new Vector3(0, 0, 0))
  const speed = 15 // Increased for better feel with physics
  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const prevRotation = useRef(rotationAngle)

  // Handle ref forwarding by combining local ref with forwarded ref
  const handleRef = (instance: RapierRigidBody | null) => {
    characterRef.current = instance

    // Forward the ref if provided by parent
    if (typeof ref === "function") {
      ref(instance)
    } else if (ref) {
      ref.current = instance
    }
  }

  // Update model rotation immediately when rotationAngle prop changes
  useLayoutEffect(() => {
    if (modelRef.current && prevRotation.current !== rotationAngle) {
      modelRef.current.rotation.y = rotationAngle
      prevRotation.current = rotationAngle
    }
  }, [rotationAngle])

  useEffect(() => {
    // Set up key event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!characterRef.current || !modelRef.current) return

    // Reset velocity
    velocity.current.set(0, 0, 0)

    // Get movement input
    const forward = keysPressed.current["ArrowUp"] || keysPressed.current["w"]
    const backward = keysPressed.current["ArrowDown"] || keysPressed.current["s"]
    const left = keysPressed.current["ArrowLeft"] || keysPressed.current["a"]
    const right = keysPressed.current["ArrowRight"] || keysPressed.current["d"]

    // Apply movement based on camera rotation
    if (forward) {
      velocity.current.z -= speed * Math.cos(rotationAngle)
      velocity.current.x -= speed * Math.sin(rotationAngle)
    }
    if (backward) {
      velocity.current.z += speed * Math.cos(rotationAngle)
      velocity.current.x += speed * Math.sin(rotationAngle)
    }
    if (left) {
      velocity.current.z -= speed * Math.sin(rotationAngle)
      velocity.current.x += speed * Math.cos(rotationAngle)
    }
    if (right) {
      velocity.current.z += speed * Math.sin(rotationAngle)
      velocity.current.x -= speed * Math.cos(rotationAngle)
    }

    // Jump when space is pressed
    if (keysPressed.current[" "] && Math.abs(characterRef.current.linvel().y) < 0.1) {
      characterRef.current.applyImpulse({ x: 0, y: 5, z: 0 }, true)
    }

    // Apply velocity to character through physics impulse
    characterRef.current.setLinvel(
      {
        x: velocity.current.x,
        y: characterRef.current.linvel().y, // Keep existing Y velocity (for gravity/jumping)
        z: velocity.current.z,
      },
      true
    )

    // Prevent the character from rotating via physics
    characterRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

    // Update visual model rotation to match camera angle
    if (prevRotation.current !== rotationAngle) {
      modelRef.current.rotation.y = rotationAngle
      prevRotation.current = rotationAngle
    }
  })

  return (
    <RigidBody
      ref={handleRef}
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]} // Lock rotations
      lockRotations={true}
      mass={1}
      colliders={false} // We'll define our own collider
      friction={0.5}
    >
      <Box ref={modelRef} args={[1, 2, 1]} castShadow>
        <meshStandardMaterial color="#4287f5" />
      </Box>
      <CuboidCollider args={[0.5, 1, 0.5]} /> {/* Custom collider slightly smaller than visual model */}
    </RigidBody>
  )
})

export default Character
