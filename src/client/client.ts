import * as THREE from 'three'
import { MOUSE, Object3D, PointLight, Vector2 } from 'three';
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
class client {
    currentMode = mode.general

    /**
     * Objects to draw
     */
    LineToDraw: Line | null = null
    line: any

    PolylineToDraw: Polyline | null = null
    polyline: any

    RectangleToDraw: Rectangle | null = null
    rectangle: any

    /**
     * Object to delete
     */
    objectsToDelete: THREE.Line[] = []

    /**
     * matrials
     */
    objectToDrawMat = new THREE.LineBasicMaterial({
        color: 0xff0000,
        // wireframe:true
    })
    drawnObjectMat = new THREE.LineBasicMaterial({
        color: 0x000fff,
        // wireframe:true
    })
    /**
    * DOM elements
    */
    xPosition = document.querySelector('.xPosition') as HTMLParagraphElement
    yPosition = document.querySelector('.yPosition') as HTMLParagraphElement
    drawLineBtn = document.getElementById('drawLine') as HTMLInputElement
    drawPolylineBtn = document.getElementById('drawPolyline') as HTMLInputElement
    drawRectangleBtn = document.getElementById('drawRectangle') as HTMLInputElement
    divisionsInput = document.getElementById('divisions') as HTMLInputElement

    //# Get Mouse Location
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()
    plane = new THREE.Plane()
    planeNormal = new THREE.Vector3()
    point = new THREE.Vector3();

    /**
     * scene
     */
    scene = new THREE.Scene()

    /**
     * camera
     */
    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    /**
     * rendrerer
     */
    renderer = new THREE.WebGLRenderer()


    /**
     * controls
     */
    controls = new OrbitControls(this.camera, this.renderer.domElement)
    currentIntesect: any = null



    /**
     * Grids
     */
    size = window.innerWidth * 2;
    divisions: number = +this.divisionsInput.value;

    gridHelper = new THREE.GridHelper(this.size, this.divisions)

    constructor() {
        this.scene.background = new THREE.Color(0xffffff)
        this.camera.position.z = 1
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
        this.controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN
        this.controls.enableRotate = false
        this.controls.screenSpacePanning = true;
        this.gridHelper.position.z = -0.05
        this.gridHelper.rotation.x = Math.PI / 2
        this.scene.add(this.gridHelper)
        this.fireEvents()
        this.animate()
    }
    fireEvents() {

        this.drawLineBtn.addEventListener('click', (e) => {
            this.currentMode = mode.drawLine
        })
        this.drawPolylineBtn.addEventListener('click', (e) => {
            this.currentMode = mode.drawPolyline
        })
        this.drawRectangleBtn.addEventListener('click', (e) => {
            this.currentMode = mode.drawRectangle
        })

        /**
         *  Draw objects
         */
        window.onmousemove = (e) => {
            this.getPoint(e)
            switch (this.currentMode) {
                case mode.drawLine:
                    this.renderer.domElement.style.cursor = 'crosshair'
                    if (this.LineToDraw != null) {
                        this.LineToDraw.changeEndPoint(new Vector2(this.point.x, this.point.y))
                        const geometry = new THREE.BufferGeometry().setFromPoints(this.LineToDraw.getPoints())
                        this.line.geometry = geometry
                    }
                    break

                case mode.drawRectangle:
                    this.renderer.domElement.style.cursor = 'crosshair'
                    if (this.RectangleToDraw != null) {
                        this.RectangleToDraw.updateSlices(new Vector2(this.point.x, this.point.y))
                        const geometry = new THREE.BufferGeometry().setFromPoints(this.RectangleToDraw.Points)
                        this.rectangle.geometry = geometry
                    }
                    break

                case mode.drawPolyline:
                    this.renderer.domElement.style.cursor = 'crosshair'
                    if (this.PolylineToDraw != null) {
                        this.PolylineToDraw.updateLastPoint(new Vector2(this.point.x, this.point.y))
                        const geometry = new THREE.BufferGeometry().setFromPoints(this.PolylineToDraw.getpoints())
                        this.polyline.geometry = geometry
                    }
                    break

                default:
                    if (e.which == 3 || e.which == 1) {
                        this.renderer.domElement.style.cursor = 'grabbing'
                    }
                    else {
                        this.renderer.domElement.style.cursor = 'grab'
                    }
                    break
            }
        }
        this.renderer.domElement.onmousedown = (e) => {
            if (e.button.valueOf() == MOUSE.RIGHT) {
                if (this.currentMode == mode.drawPolyline) this.PolylineToDraw = null
                this.currentMode = mode.general
            }
            switch (this.currentMode) {
                case mode.general:
                    if (e.button.valueOf() == MOUSE.MIDDLE) {
                        if (this.currentIntesect) {
                            this.scene.remove(this.currentIntesect as THREE.Line)
                            console.log("object deleted successfully")
                        }
                        else {
                            console.log("No Shapes to Delete")
                        }
                    }
                    break
                case mode.drawLine:
                    if (e.button.valueOf() == MOUSE.LEFT) {
                        if (this.LineToDraw == null) {
                            console.log("draw line")
                            this.LineToDraw = new Line(new Vector2(this.point.x, this.point.y), new Vector2(this.point.x, this.point.y))
                            const geometry = new THREE.BufferGeometry().setFromPoints(this.LineToDraw.getPoints())
                            this.line = new THREE.Line(geometry, this.objectToDrawMat)
                            this.scene.add(this.line)
                            this.objectsToDelete.push(this.line)
                        } else {
                            console.log('Line is drawn')
                            this.line.material = this.drawnObjectMat
                            this.LineToDraw = null
                        }
                    }
                    break
                case mode.drawRectangle:
                    if (e.button.valueOf() == MOUSE.LEFT) {
                        if (this.RectangleToDraw == null) {
                            console.log("draw rectangle")
                            this.RectangleToDraw = new Rectangle(new Vector2(this.point.x, this.point.y))
                            const geometry = new THREE.BufferGeometry()
                            this.rectangle = new THREE.Line(geometry, this.objectToDrawMat)
                            this.scene.add(this.rectangle)
                            this.objectsToDelete.push(this.rectangle)
                        } else {
                            console.log('Rectangle is drawn')
                            this.rectangle.material = this.drawnObjectMat
                            this.RectangleToDraw = null
                        }
                    }
                    break
                case mode.drawPolyline:
                    if (e.button.valueOf() == MOUSE.LEFT) {
                        if (this.PolylineToDraw == null) {
                            console.log("draw polyline")
                            this.PolylineToDraw = new Polyline(new Vector2(this.point.x, this.point.y), new Vector2(this.point.x, this.point.y))
                            const geometry = new THREE.BufferGeometry()
                            this.polyline = new THREE.Line(geometry, this.objectToDrawMat)
                            this.scene.add(this.polyline)
                            this.objectsToDelete.push(this.polyline)
                        }
                        else {
                            this.polyline.material = this.drawnObjectMat
                            this.PolylineToDraw.addPoint(new Vector2(this.point.x, this.point.y))
                        }
                    }
                    break

                default:
                    break
            }
        }

        this.divisionsInput.addEventListener('input', (e) => {
            this.scene.remove(this.gridHelper)
            const size = window.innerWidth * 2;
            let divisions: number = +this.divisionsInput.value;
            this.gridHelper = new THREE.GridHelper(size, divisions)
            this.gridHelper.position.z = -0.05
            this.gridHelper.rotation.x = Math.PI / 2
            this.scene.add(this.gridHelper)
        })

        /**
         * Resize window
         */
        window.addEventListener('resize', this.onWindowResize, false)
    }
    getPoint(event: MouseEvent) {
        var rect = this.renderer.domElement.getBoundingClientRect()
        this.mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
        this.mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1
        this.planeNormal.copy(this.camera.position).normalize()
        this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.scene.position)
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.raycaster.ray.intersectPlane(this.plane, this.point)
        this.xPosition.textContent = ' x: ' + Math.round(this.point.x * 100) / 100
        this.yPosition.textContent = ' y: ' + Math.round(this.point.y * 100) / 100
    }
    onWindowResize() {
        // Update Camera
        // const camFactor = window.innerWidth / window.innerHeight
        // camera.left = -window.innerWidth / camFactor;
        // camera.right = window.innerWidth / camFactor;
        // camera.top = window.innerHeight / camFactor;
        // camera.bottom = -window.innerHeight / camFactor;
        this.camera.updateProjectionMatrix()

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.render()
    }
    animate() {
        requestAnimationFrame(() => this.animate())
        this.controls.update()
        this.renderer.setAnimationLoop(() => this.render())
        this.getIntersectedObject()
    }

    getIntersectedObject() {
        if (this.currentMode == mode.general) {
            const intersects = this.raycaster.intersectObjects(this.objectsToDelete)
            for (const object of this.objectsToDelete) {
                object.material = this.drawnObjectMat
            }

            for (const intersect of intersects) {
                (intersect.object as THREE.Line).material = this.objectToDrawMat
            }
            if (intersects.length) {
                // if (this.currentIntesect === null) {
                //     console.log('mouse entered')
                // }
                this.currentIntesect = intersects[0].object
            } else {
                // if (this.currentIntesect) {
                //     console.log('mouse leaved')
                // }
                this.currentIntesect = null
            }
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}

new client()