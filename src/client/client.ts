import * as THREE from 'three'
import { MOUSE, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Line } from '../client/Line'
import { Polyline } from '../client/Polyline'


enum mode {
    general,
    drawLine,
    drawPolyline
}
let currentMode = mode.general

/**
 * Line to draw
 */
let LineToDraw: Line | null
let PolylineToDraw: Polyline | null

/**
 * matrials
 */
const lineToDrawMat = new THREE.MeshBasicMaterial({
    color: 0xff0000
})
const drawnLineMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff
})
let line1: THREE.Line


/**
 * DOM elements
 */
const xPosition = document.querySelector('.xPosition') as HTMLParagraphElement
const yPosition = document.querySelector('.yPosition') as HTMLParagraphElement
const drawLineBtn = document.getElementById('drawLine') as HTMLInputElement
const drawPolylineBtn = document.getElementById('drawPolyline') as HTMLInputElement

/**
 * scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

/**
 * camera
 */
const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
camera.position.z = 1
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
drawPolylineBtn.addEventListener('click', (e) => {
    currentMode = mode.drawPolyline
})

/**
 *  Draw Lines
 */
window.onmousemove = (e) => {
    getPoint(e)
    if (currentMode == mode.drawLine) {
        if (LineToDraw != null) {
            LineToDraw.changeEndPoint(new Vector2(point.x, point.y))
            const geometry = new THREE.BufferGeometry().setFromPoints(LineToDraw.getPoints())
            line1.geometry = geometry
        }
        renderer.domElement.style.cursor = 'crosshair'
    }
    else if (e.which == 2) {
        renderer.domElement.style.cursor = 'grabbing'
    }
    else {
        renderer.domElement.style.cursor = 'grab'
    }
}

renderer.domElement.onmousedown = (e) => {
    if (e.button.valueOf() == MOUSE.RIGHT) {
        currentMode = mode.general
        // linePoints.splice(0)
    }
    if (e.button.valueOf() == MOUSE.LEFT && currentMode == mode.drawLine) {
        if (LineToDraw == null) {
            console.log("draw line")
            LineToDraw = new Line(new Vector2(point.x, point.y), new Vector2(point.x, point.y))
            const geometry = new THREE.BufferGeometry().setFromPoints([LineToDraw.StartPt, LineToDraw.EndPt])
            line1 = new THREE.Line()
            line1.material = lineToDrawMat
            line1.geometry = geometry
            scene.add(line1)
        } else {
            line1.material = drawnLineMat
            LineToDraw = null
        }
    }
}

renderer.domElement.onmouseup = (e) => {
    
}

//# Get Mouse Location
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var plane = new THREE.Plane()
var planeNormal = new THREE.Vector3()
var point = new THREE.Vector3();
function getPoint(event: MouseEvent) {
    var rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ( ( event.clientX - rect.left ) / ( rect. right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
const size = window.innerWidth;
const divisions = 50;

const gridHelper = new THREE.GridHelper(size, divisions)
gridHelper.position.z = -0.001
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
    renderer.setAnimationLoop(() => render())
}

function render() {
    renderer.render(scene, camera)
}
animate()
