import './style.css'
import * as THREE from 'three'
// __controls_import__
// __gui_import__

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import submarineSrc from '/3d-models/submarine/scene.gltf?url'

let gltfLoader = new GLTFLoader()

const submarine = {
	mesh: null,
	elica: null,
	body: [],
	eye: null,
}

gltfLoader.load(submarineSrc, (gltf) => {
	const mesh =
		gltf.scene.children[0].children[0].children[0].children[0].children[1]

	const group = new THREE.Object3D()

	const gold = new MeshStandardNodeMaterial({ color: 'gold' })
	submarine.elica = mesh.children[2]
	mesh.children[4].children[0].material = gold
	mesh.children[6].children[0].material = gold
	mesh.children[7].children[0].material = gold
	submarine.body.push(
		mesh.children[3],
		mesh.children[4],
		mesh.children[7],
		mesh.children[6]
	)
	submarine.eye = mesh.children[5]
	mesh.remove(mesh.children[0])
	mesh.remove(mesh.children[0])
	mesh.scale.setScalar(0.003)

	// const pointLight = new THREE.PointLight(
	// 	0x00ceff,
	// 	100,
	// 	20
	// 	// 0.05
	// )
	// pointLight.position.y = 10
	// pointLight.position.z = 6
	// // pointLight.target.position.set(0, -5, 0)

	// pointLight.castShadow = true
	// pointLight.shadow.blurSamples = 20
	// pointLight.shadow.bias = -0.0005
	mesh.position.set(0, 0, 0)

	group.position.set(0, 6, 6)
	// const spotHelper = new THREE.PointLightHelper(pointLight)
	// scene.add(spotHelper, pointLight)
	group.add(mesh)

	submarine.mesh = group
	// console.log(submarine.mesh)
	scene.add(group)
})

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

/**
 * Debug
 */
// __gui__
const configs = {
	example: 5,
}
const gui = new dat.GUI()
gui.add(configs, 'example', 0, 10, 0.1).onChange((val) => console.log(val))

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2277ab)
scene.fog = new THREE.FogExp2(0x2277ab, 0.03)
// scene.fogNode = rangeFog(vec3(0, 0, 0.05), 0, 50)

// __box__
/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshStandardMaterial({ color: 'coral' })
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y += 1.5
// scene.add(mesh)
// mesh.castShadow = true

import sand from './src/sand'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js'
import {
	MeshStandardNodeMaterial,
	rangeFog,
	vec3,
} from 'three/examples/jsm/nodes/Nodes.js'
import poseidon from './src/poseidon'

for (let i = 0; i < 0; i++) {
	const pose = poseidon.clone()

	const x = Math.random() * 200 - 100
	const z = Math.random() * 200 - 100

	pose.position.set(x, 0, z)
	scene.add(pose)
}

scene.add(sand)

// __floor__
/**
 * Plane
 */

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0, 6, 20)
// camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
// __helper_axes__
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new WebGPURenderer({
	antialias: true,
})
// renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
// __controls__
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// controls.autoRotate = true
controls.autoRotateSpeed = 2
controls.target.set(0, 4, 0)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(3, 10, 7)
// directionalLight.castShadow = true
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.left = -50
directionalLight.shadow.camera.right = 50
directionalLight.shadow.camera.top = 50
directionalLight.shadow.camera.bottom = -50
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.radius = 30
directionalLight.shadow.blurSamples = 20
directionalLight.shadow.bias = -0.005

scene.add(directionalLight, ambientLight)

/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	stats.begin()
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	const time = clock.getElapsedTime()

	// __controls_update__
	controls.update()
	if (submarine.mesh) {
		submarine.elica.rotation.z = Math.PI * time * 4
		submarine.mesh.position.y = 6 + Math.sin(time) * 0.5
	}

	renderer.renderAsync(scene, camera)

	stats.end()

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height

	// camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}
