import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import "./App.css"
import { Game } from "./components/game"

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <Game />
      </Canvas>
    </div>
  )
}

export default App
