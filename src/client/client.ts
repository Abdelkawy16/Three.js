import * as THREE from 'three'
import { MOUSE, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Line } from '../client/Line'
import { Polyline } from '../client/Polyline'
import { Rectangle } from './Rectangle';


enum mode {
    general,
    drawLine,
    drawPolyline,
    drawRectangle
}
let currentMode = mode.general

/**
 * Objects to draw
 */
let LineToDraw: Line | null = null
let line: THREE.Line

let PolylineToDraw: Polyline | null = null
let polyline: THREE.Line

let RectangleToDraw: Rectangle | null = null
let rectangle: THREE.Line

/**
 * matrials
 */
const objectToDrawMat = new THREE.LineBasicMaterial({
    color: 0xff0000,
    // wireframe:true
})
const drawnObjectMat = new THREE.LineBasicMaterial({
    color: 0x000fff,
    // wireframe:true
})


/**
 * DOM elements
 */
const xPosition = document.querySelector('.xPosition') as HTMLParagraphElement
const yPosition = document.querySelector('.yPosition') as HTMLParagraphElement
const drawLineBtn = document.getElementById('drawLine') as HTMLInputElement
const drawPolylineBtn = document.getElementById('drawPolyline') as HTMLInputElement
const drawRectangleBtn = document.getElementById('drawRectangle') as HTMLInputElement

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
controls.screenSpacePanning = true;

/**
 * events
 */
drawLineBtn.addEventListener('click', (e) => {
    currentMode = mode.drawLine
})
drawPolylineBtn.addEventListener('click', (e) => {
    currentMode = mode.drawPolyline
})
drawRectangleBtn.addEventListener('click', (e) => {
    currentMode = mode.drawRectangle
})

/**
 *  Draw objects
 */
window.onmousemove = (e) => {
    getPoint(e)
    switch (currentMode) {
        case mode.drawLine:
            renderer.domElement.style.cursor = 'crosshair'
            if (LineToDraw != null) {
                LineToDraw.changeEndPoint(new Vector2(point.x, point.y))
                const geometry = new THREE.BufferGeometry().setFromPoints(LineToDraw.getPoints())
                line.geometry = geometry
            }
            break

        case mode.drawRectangle:
            renderer.domElement.style.cursor = 'crosshair'
            if(RectangleToDraw != null){
                RectangleToDraw.updateSlices(new Vector2(point.x, point.y))
                const geometry = new THREE.BufferGeometry().setFromPoints(RectangleToDraw.Points)
                rectangle.geometry = geometry
            }
            break

        default:
            if (e.which == 2) {
                renderer.domElement.style.cursor = 'grabbing'
            }
            else {
                renderer.domElement.style.cursor = 'grab'
            }
            break
    }
}

renderer.domElement.onmousedown = (e) => {
    if (e.button.valueOf() == MOUSE.RIGHT) {
        currentMode = mode.general
    }
    switch (currentMode) {
        case mode.drawLine:
            if (e.button.valueOf() == MOUSE.LEFT) {
                if (LineToDraw == null) {
                    console.log("draw line")
                    LineToDraw = new Line(new Vector2(point.x, point.y), new Vector2(point.x, point.y))
                    const geometry = new THREE.BufferGeometry().setFromPoints(LineToDraw.getPoints())
                    line = new THREE.Line(geometry, objectToDrawMat)
                    scene.add(line)
                } else {
                    console.log('Line is drawn')
                    line.material = drawnObjectMat
                    LineToDraw = null
                }
            }
            break
        case mode.drawRectangle:
            if (e.button.valueOf() == MOUSE.LEFT) {
                if (RectangleToDraw == null) {
                    console.log("draw rectangle")
                    RectangleToDraw = new Rectangle(new Vector2(point.x, point.y))
                    const geometry = new THREE.BufferGeometry()
                    rectangle = new THREE.Line(geometry, objectToDrawMat)
                    scene.add(rectangle)
                } else {
                    console.log('Rectangle is drawn')
                    rectangle.material = drawnObjectMat
                    RectangleToDraw = null
                }
            }
            break

        default:
            break
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
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1
    planeNormal.copy(camera.position).normalize()
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, point)
    xPosition.textContent = ' x: ' + Math.round(point.x * 100) / 100
    yPosition.textContent = ' y: ' + Math.round(point.y * 100) / 100
}

/**
 * Grids
 */
const size = window.innerWidth * 2;
const divisions = 50;

const gridHelper = new THREE.GridHelper(size, divisions)
gridHelper.position.z = -0.05
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
