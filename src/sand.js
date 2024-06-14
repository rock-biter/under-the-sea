import { Mesh, PlaneGeometry } from 'three'
import {
	MeshStandardNodeMaterial,
	mx_worley_noise_float,
	positionWorld,
	output,
	vec4,
	vec3,
	mx_noise_vec3,
	positionLocal,
	sin,
	modelWorldMatrix,
	timerGlobal,
	smoothstep,
	mix,
	mx_noise_float,
	mul,
	abs,
	tslFn,
	modelNormalMatrix,
	cameraPosition,
} from 'three/examples/jsm/nodes/Nodes.js'
import { mx_perlin_noise_float } from 'three/examples/jsm/nodes/materialx/lib/mx_noise.js'

const material = new MeshStandardNodeMaterial({
	color: 'white',
	// wireframe: true,
	// flatShading: true,
})
const geometry = new PlaneGeometry(500, 500, 200, 200)
geometry.rotateX(-Math.PI * 0.5)
const sand = new Mesh(geometry, material)

console.log(positionWorld)
const distance = positionWorld.sub(cameraPosition).length()

const time = timerGlobal(0.2)

const getElevation = tslFn(([position]) => {
	let noiseInput
	let elevation

	noiseInput = mul(position, 1)
	elevation = mx_perlin_noise_float(noiseInput.xz).mul(0.15).abs().mul(-1)

	noiseInput = mul(position, 2)
	elevation = mx_perlin_noise_float(noiseInput.xz)
		.mul(0.05)
		.abs()
		.mul(-1)
		.add(elevation)

	noiseInput = mul(position, 8)
	elevation = mx_perlin_noise_float(noiseInput.xz)
		.mul(0.01)
		.abs()
		.mul(-1)
		.add(elevation)

	return elevation
})

const position = positionLocal.add(vec3(0, getElevation(positionLocal), 0))
const pos = modelWorldMatrix.mul(vec4(position, 1))

material.positionNode = position

const shift = 0.001
let positionA = positionLocal.add(vec3(shift, 0, 0))
let positionB = positionLocal.add(vec3(0, 0, -shift))

positionA = positionA.add(vec3(0, getElevation(positionA), 0))
positionB = positionB.add(vec3(0, getElevation(positionB), 0))

const toA = positionA.sub(position).normalize()
const toB = positionB.sub(position).normalize()
const normal = toA.cross(toB)

material.normalNode = modelNormalMatrix.mul(normal)

// const d3 = mx_worley_noise_float(
// 	positionWorld.add(time.add(sin(positionWorld.x.mul(10)).mul(0.05)))
// )

const dInput = pos.xyz.mul(1).add(time)

const d3 = mx_worley_noise_float(dInput).mul(1)
// const d4 = mx_worley_noise_float(dInput.add(0.1)).mul(1)
let color = vec3(0.2, 0.6, 0.8).mul(smoothstep(0, 0.7, d3).pow2()).mul(0.8)

d3.pow3()
// d4.pow3()

color = color.add(
	vec3(0.9, 0.5, 0.3).mul(smoothstep(0.1, 1, d3).pow3()).mul(0.4)
)
color = color.add(
	vec3(0.9, 0.7, 0.9).mul(smoothstep(0.1, 1, d3).pow3()).mul(0.3)
)
// material.outputNode = vec4(
// 	mix(output.rgb, vec3(0.2, 0.6, 0.8), smoothstep(0.0, 1, d3)),
// 	1
// )

material.colorNode = vec3(1, 1, 1)
	.mul(smoothstep(20, 50, distance).oneMinus())
	.add(color.mul(smoothstep(15, 40, distance).oneMinus()))

// material.outputNode = vec4(
// 	output.rgb.add(color.mul(smoothstep(15, 40, distance).oneMinus())),
// 	1
// )

console.log(material)

export default sand
