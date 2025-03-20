import { Plane, Box } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

export default function Ground() {
  const groundSize = 50
  const wallHeight = 5
  const wallThickness = 1

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} args={[groundSize, groundSize]} receiveShadow>
          <meshStandardMaterial color="#3a7e4c" />
        </Plane>
      </RigidBody>

      {/* North Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          position={[0, wallHeight / 2, -groundSize / 2]}
          args={[groundSize, wallHeight, wallThickness]}
          receiveShadow
        >
          <meshStandardMaterial color="#2a5e3c" />
        </Box>
      </RigidBody>

      {/* South Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          position={[0, wallHeight / 2, groundSize / 2]}
          args={[groundSize, wallHeight, wallThickness]}
          receiveShadow
        >
          <meshStandardMaterial color="#2a5e3c" />
        </Box>
      </RigidBody>

      {/* East Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          position={[groundSize / 2, wallHeight / 2, 0]}
          args={[wallThickness, wallHeight, groundSize]}
          receiveShadow
        >
          <meshStandardMaterial color="#2a5e3c" />
        </Box>
      </RigidBody>

      {/* West Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          position={[-groundSize / 2, wallHeight / 2, 0]}
          args={[wallThickness, wallHeight, groundSize]}
          receiveShadow
        >
          <meshStandardMaterial color="#2a5e3c" />
        </Box>
      </RigidBody>
    </>
  )
}
