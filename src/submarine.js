import { Object3D, Vector2, Vector3 } from 'three'

export default class Submarine extends Object3D {
	velocity = new Vector3(0, 0, 20)
	baseSpeed = 20
	speed = 0
	// acceleration = new Vector3(1, 0, 0)
	cursor = new Vector2(0, 0)

	constructor() {
		super()
	}

	update(dt) {}

	initCursor() {
		window.addEventListener('mousemove', (e) => {
			const x = (e.clientX / innerWidth) * 2 - 1
			const y = -(e.clientY / innerHeight) * 2 + 1

			this.cursor.set(x, y)
		})

		window.addEventListener('touchmove', (e) => {
			const touch = e.touches[0]
			const x = (touch.clientX / innerWidth) * 2 - 1
			const y = -(touch.clientY / innerHeight) * 2 + 1

			this.cursor.set(x / 1.5, y)
		})
	}
}
