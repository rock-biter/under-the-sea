import {
	BoxGeometry,
	CapsuleGeometry,
	CylinderGeometry,
	DoubleSide,
	InstancedMesh,
	Matrix4,
	Mesh,
	PlaneGeometry,
	Quaternion,
	Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'
import {
	MeshStandardNodeMaterial,
	add,
	cos,
	modelWorldMatrix,
	mx_noise_float,
	mx_noise_vec3,
	oscSine,
	positionLocal,
	positionWorld,
	sin,
	timerGlobal,
	vec3,
	vec4,
} from 'three/examples/jsm/nodes/Nodes.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { smoothstep } from 'three/src/math/MathUtils.js'

const count = 10
const time = timerGlobal(0.75)

const geometries = []

for (let i = 0; i < count; i++) {
	for (let j = 0; j < count; j++) {
		const h = Math.random() * 1.5 + 1
		const geometry = new BoxGeometry(0.01, h, 0.1, 1, 10, 1)
		const pos = new Vector3(
			i * 0.15 - count * 0.15 * 0.5 + Math.random() * 0.1,
			h * 0.45,
			j * 0.15 - count * 0.15 * 0.5 + Math.random() * 0.1
		)
		geometry.rotateY(Math.PI * 2 * Math.random())
		geometry.rotateZ(Math.PI * -0.06 * -count * 0.5 + Math.PI * -0.06 * i)
		geometry.rotateX(Math.PI * 0.06 * -count * 0.5 + Math.PI * 0.06 * j)

		if (pos.length() > 1.2) continue
		// geometry.rotateX(-Math.PI * 0.5)
		geometry.translate(
			i * 0.25 - count * 0.25 * 0.5 + Math.random() * 0.1,
			h * 0.4,
			j * 0.25 - count * 0.25 * 0.5 + Math.random() * 0.1
		)

		geometries.push(geometry)
	}
}

const geometry = mergeGeometries(geometries)
geometry.computeVertexNormals()
const material = new MeshStandardNodeMaterial({
	color: 'green',
	side: DoubleSide,
})

const wPos = modelWorldMatrix.mul(vec4(positionLocal, 1))

const scale = 1
const vec = mx_noise_vec3(wPos.xyz.add(time).mul(0.3)).mul(wPos.y).mul(0.8)

material.positionNode = positionLocal
	.add(vec.mul(vec3(1, 0.3, 1)))
	.mul(vec3(1, scale, 1))
	.add(
		vec3(
			0,
			add(sin(wPos.x.mul(0.3)).mul(0.5), cos(wPos.z.mul(0.1)).mul(0.5)),
			0
		)
	)

const mesh = new Mesh(geometry, material, count)

material.colorNode = vec3(0.2, 0.5, wPos.y.oneMinus()).mul(wPos.y.mul(0.25))

const matrix = new Matrix4()

mesh.castShadow = true

export default mesh
