import { Sphere, MeshTransmissionMaterial } from "@react-three/drei"
import type { RapierRigidBody } from "@react-three/rapier"
import { RigidBody } from "@react-three/rapier"
import { useRef, useState } from "react"
import * as THREE from "three"

type ObstacleProps = {
  position: [number, number, number]
  radius?: number
  color?: string
  interactable?: boolean
  mass?: number
  restitution?: number
}

const Obstacle = ({
  position,
  radius = 1,
  color = "#964B00",
  interactable = false,
  mass = 10,
  restitution = 0.7,
}: ObstacleProps) => {
  const [isMovable, setIsMovable] = useState(false)
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  const handleInteraction = () => {
    if (interactable && !isMovable) {
      setIsMovable(true)
      // When isMovable is true, the RigidBody type will automatically change to "dynamic"
    }
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      type={isMovable ? "dynamic" : "fixed"}
      position={position}
      colliders="ball"
      mass={isMovable ? mass : undefined}
      restitution={restitution}
      onIntersectionEnter={interactable ? handleInteraction : undefined}
    >
      <Sphere args={[radius]} castShadow onClick={interactable ? handleInteraction : undefined}>
        <MeshTransmissionMaterial
          color={isMovable ? "#6B8E23" : color}
          thickness={0.5}
          roughness={0.2}
          transmission={0.6}
          distortion={0.2}
          temporalDistortion={0.1}
          distortionScale={0.5}
          ior={1.5}
          backside={true}
          background={new THREE.Color(0xffffff)}
          resolution={256}
          samples={10}
          clearcoat={0.1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
        />
      </Sphere>
    </RigidBody>
  )
}

export { Obstacle }
