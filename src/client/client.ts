import * as THREE from 'three'
import { MOUSE, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


enum mode {
    general,
    drawLine
}
let currentMode = mode.general

/**
 * Line to draw
 */
const linePoints: Vector2[] = []
const matLine = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 100
});
let isLineDrawn = false

/**
 * DOM elements
 */
const xPosition = document.querySelector('.xPosition') as HTMLParagraphElement
const yPosition = document.querySelector('.yPosition') as HTMLParagraphElement
const drawLineBtn = document.getElementById('drawLine') as HTMLInputElement

/**
 * scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

/**
 * camera
 */
const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
camera.position.z = 4
/**
 * rendrerer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/**
 * controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN
controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY
controls.enableRotate = false

/**
 * events
 */
drawLineBtn.addEventListener('click', (e) => {
    currentMode = mode.drawLine
})

/**
 *  Draw Lines
 */
renderer.domElement.onmousemove = (e) => {
    getPoint(e)
    if (currentMode == mode.drawLine) {
    }
}

renderer.domElement.onmousedown = (e) => {
    if (e.button.valueOf() == MOUSE.RIGHT) {
        currentMode = mode.general
        linePoints.splice(0)
    }
    if (e.button.valueOf() == MOUSE.LEFT && currentMode == mode.drawLine) {
        if (linePoints.length != 2) {
            linePoints.push(new Vector2(point.x, point.y))
        }
    }
}

renderer.domElement.onmouseup = (e) => {
    if (e.button.valueOf() == MOUSE.LEFT && currentMode == mode.drawLine && linePoints.length == 2) {
        let lineToDrawGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)
        const line = new THREE.Line(lineToDrawGeometry, matLine)
        line.computeLineDistances()
        scene.add(line)
        linePoints.splice(0)
    }
}

//# Get Mouse Location
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var plane = new THREE.Plane()
var planeNormal = new THREE.Vector3()
var point = new THREE.Vector3();
function getPoint(event: MouseEvent) { // Get point on drawing plane
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -event.clientY / window.innerHeight * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, point)
    xPosition.textContent = ' x: ' + Math.round(point.x * 100) / 100
    yPosition.textContent = ' y: ' + Math.round(point.y * 100) / 100
}

/**
 * Grids
 */
const size = 50;
const divisions = 50;

const gridHelper = new THREE.GridHelper(size, divisions)
// gridHelper.position.z = -0.001
gridHelper.rotation.x = Math.PI / 2
scene.add(gridHelper)

/**
 * Resize window
 */
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    // Update Camera
    // const camFactor = window.innerWidth / window.innerHeight
    // camera.left = -window.innerWidth / camFactor;
    // camera.right = window.innerWidth / camFactor;
    // camera.top = window.innerHeight / camFactor;
    // camera.bottom = -window.innerHeight / camFactor;
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    render()
}

/**
 *  update scene
 */
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()
