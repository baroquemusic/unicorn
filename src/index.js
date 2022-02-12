import favicon from './assets/favicon.ico'
import * as THREE from 'three'
import { LoadingManager } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { Earcut } from 'three/src/extras/Earcut'
import { Text } from 'troika-three-text'
import unicornLogo from './assets/unicorn-logo.svg'
import font from './assets/fonts/Philosopher.woff'
import appDevelopment from './assets/glb/app.glb'
import blockChain from './assets/glb/block.glb'
import deepLearning from './assets/glb/deep.glb'
import extendedReality from './assets/glb/extended.glb'
import interactive3D from './assets/glb/interact.glb'

const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const camera = new THREE.PerspectiveCamera
  ( 45, window.innerWidth / window.innerHeight, 1, 1000 )
camera.position.set( 0, 0, 50 )
camera.lookAt( 0, 0, 0 )

const scene = new THREE.Scene()
scene.background = new THREE.Color( 'white' )

const manager = new THREE.LoadingManager

const gltfLoader = new GLTFLoader( manager )

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )

}

window.addEventListener( 'wheel', onMouseWheel, false )
window.addEventListener( 'resize', onWindowResize, false )
window.addEventListener( 'mousemove', onMouseMove, false )

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

}

///////////////// LOGO

const logoLoader = new SVGLoader
const logo = new THREE.Object3D
let logoWidth

const material = new THREE.ShaderMaterial( {
	fragmentShader: fragmentShader(),
	vertexShader: vertexShader(),
	side: THREE.DoubleSide,
	uniforms: {
		amplitude: { type: 'f', value: 0 },
	}
} )

function vertexShader() {
  return `
		attribute vec3 direction;
		uniform float amplitude;

		void main() {
			vec3 tPos = position + direction * amplitude;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(tPos, 1.0);
		}
  `
}

function fragmentShader() {
  return `
		void main() {
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		}
  `
}

function random( out ) {

	var scale = Math.random() * 1000

	var r = Math.random() * 2 * Math.PI
	var z = ( Math.random() * 2 ) - 1
	var zScale = Math.sqrt( 1 - z * z ) * scale

	out.x += Math.cos( r ) * zScale
	out.y += Math.sin( r ) * zScale
	out.z += z * scale

	return out

}

logoLoader.load(

	unicornLogo,

	function( data ) {

		const paths = data.paths

		for( let i = 0; i < paths.length; i++ ) {

			const path = paths[ i ]
			const shapes = SVGLoader.createShapes( path )
			const geometry = new THREE.ShapeGeometry( shapes, 5 )
			const length = geometry.attributes.position.array.length
			geometry.setAttribute( 
				'direction',
				new THREE.Float32BufferAttribute( new Float32Array( length ), 3 )
			)

			for( let j = 0; j < length; j += 3 ) {

				const rand = random( new THREE.Vector3() )

				geometry.attributes.direction.array[ j ] = rand.x
				geometry.attributes.direction.array[ j + 1 ] = rand.y
				geometry.attributes.direction.array[ j + 2 ] = rand.z

			}

			const mesh = new THREE.Mesh( geometry, material )

			logo.add( mesh )

		}
		
		const bbLogo = new THREE.Box3().setFromObject( logo )
		logoWidth = bbLogo.max.x
    logo.rotation.y = logo.rotation.z = Math.PI
    logo.scale.set( .01, .01, -.01 )
    logo.position.set( -logoWidth * .005, 10, 0 )
		
    scene.add( logo )
		console.log(logo)
    
	}

)

/////////////////// TEXT: QUOTES

const txtQuoteM = new Text
const txtQuoteL = new Text

txtQuoteL.textAlign = 'left'
txtQuoteM.text = 'The greater danger for most of us\nlies not in setting our aim too high and\nfalling short; but in setting our aim\ntoo low, and achieving our mark\n\n- Michelangelo Buonarroti'

txtQuoteM.textAlign = 'right'
txtQuoteL.text = 'Experience never errs; it is only\nyour judgments that err by promising\nthemselves effects such as are not\ncaused by your experiments\n\n- Leonardo da Vinci'

txtQuoteM.font = txtQuoteL.font = font
txtQuoteM.fontSize = txtQuoteL.fontSize = 1
txtQuoteM.lineHeight = txtQuoteL.lineHeight = 1.5
txtQuoteM.color = txtQuoteL.color = 0x000000

scene.add( txtQuoteM )
scene.add( txtQuoteL )

let txtQuoteMX
let txtQuoteMR

txtQuoteM.sync( () => {

  txtQuoteMX = txtQuoteM.geometry.boundingBox.max.x
	txtQuoteM.curveRadius = txtQuoteMR = txtQuoteMX * Math.PI * 2
	txtQuoteM.position.set( -txtQuoteMX - 3, -1, 0 )

} )

let txtQuoteLX
let txtQuoteLR

txtQuoteL.sync( () => {

  txtQuoteLX = txtQuoteL.geometry.boundingBox.max.x
	txtQuoteL.curveRadius = txtQuoteLR = txtQuoteLX * Math.PI * 2
	txtQuoteL.position.set( 3, -1, 0 )
	txtQuoteL.anchorX = txtQuoteLX
	txtQuoteL.position.x += txtQuoteLX

} )

/////////// TEXT: SERVICES

const s1 = new Text
const s2 = new Text
const s3 = new Text
const s4 = new Text
const s5 = new Text

s2.text = 'Interactive 3D'
s3.text = 'App Development'
s4.text = 'Deep Learning'
s5.text = 'Extended Reality'
s1.text = 'Blockchain'

s1.font = s2.font = s3.font = s4.font = s5.font = font
s1.fontSize = s2.fontSize = s3.fontSize = s4.fontSize = s5.fontSize = 3
s1.color = s2.color = s3.color = s4.color = s5.color = 0x000000

const services = new THREE.Object3D

for( let i = 1; i < 6; i++ ) {

	eval( 's' + i ).rotation.z = Math.PI / 180 * 72 * ( i - 1 )
	eval( 's' + i ).curveRadius = -.001

	services.add( eval( 's' + i ) )

}

scene.add( services )

//////// OBJECTS

let o1, o2, o3, o4, o5

const objects = new THREE.Object3D

gltfLoader.load( interactive3D, ( a ) => {
	o2 = a.scene.children[0]
	o2.scale.set( 1.5, 1.5, 1.5 )
	o2.position.x = 999
	objects.add( o2 )
}, undefined, ( error ) => { console.error( error ) } )

gltfLoader.load( appDevelopment, ( a ) => {
	o3 = a.scene.children[0]
	o3.scale.set( 2.5, 2.5, 2.5 )
	o3.position.x = 999
	objects.add( o3 )
}, undefined, ( error ) => { console.error( error ) } )

gltfLoader.load( deepLearning, ( a ) => {
	o4 = a.scene.children[0]
	o4.scale.set( 70, 70, 70 )
	o4.position.x = 999
	objects.add( o4 )
}, undefined, ( error ) => { console.error( error ) } )

gltfLoader.load( extendedReality, ( a ) => {
	o5 = a.scene.children[0]
	o5.scale.set( 4, 4, 4 )
	o5.position.x = 999
	objects.add( o5 )
}, undefined, ( error ) => { console.error( error ) } )

gltfLoader.load( blockChain, ( a ) => {
	o1 = a.scene.children[0]
	o1.scale.set( 3, 3, 3 )
	o1.position.x = 999
	objects.add( o1 )
}, undefined, ( error ) => { console.error( error ) } )

scene.add( objects )

//////////////// SCROLL

let scrollPos = 0
const smooth = 10
let servRot

function onMouseWheel( event ) {

	scroll = event.deltaY

	if( scroll > 0 ) { scrollPos += 1	} 
	else if( scroll < 0 && scrollPos > 0 ) { scrollPos -= 1	}

	console.log(scrollPos)

	material.uniforms.amplitude.value = scrollPos / 10

	if( scrollPos < 8 ) {

		logo.position.y = 12 - Math.log( scrollPos + 2 ) * 3.2
		logo.position.x = -logoWidth * .005 + Math.log( scrollPos + 1 ) / .72
		logo.scale.x = logo.scale.y = .01 - ( Math.log( scrollPos + 1 ) / 500 )

		services.position.y = -11 + Math.log( scrollPos ) * 6
		services.rotation.x = -Math.PI / 180 * ( 90 - Math.exp( scrollPos / 2 ) )
		objects.rotation.x = Math.PI / 180 * ( - Math.exp( scrollPos / 2 ) )
		services.rotation.z = -Math.PI / 22.5 * scrollPos
		objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
		services.scale.x = services.scale.y = services.scale.z = Math.log( scrollPos ) / 2.7

		objects.scale.x = objects.scale.y = objects.scale.z = 22 / scrollPos

		for( let i = 1; i < 6; i++ ) {

			servRot = eval( 's' + i ).rotation.z
			eval( 's' + i ).position.x = Math.cos( servRot ) * Math.log( scrollPos ) * 4
			eval( 's' + i ).position.y = Math.sin( servRot ) * Math.log( scrollPos ) * 4
			eval( 's' + i ).curveRadius = -.1 - Math.exp( scrollPos / 3 )
			eval( 'o' + i ).position.x = Math.cos( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).position.y = Math.sin( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).rotation.x = 
			eval( 'o' + i ).rotation.y = 
			eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

		}
		
	} else if( scrollPos < 18 ) {

		logo.position.y = 12 - Math.log( scrollPos + 2 ) * 3.2
		logo.scale.x = logo.scale.y = .01 - ( Math.log( scrollPos + 1 ) / 500 )
		logo.position.x = -logoWidth * .005 + Math.log( scrollPos + 1 ) / .72

		services.rotation.z = -Math.PI / 22.5 * scrollPos
		objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )

		objects.scale.x = objects.scale.y = objects.scale.z = 22 / scrollPos

		for( let i = 1; i < 6; i++ ) {

			servRot = eval( 's' + i ).rotation.z
			eval( 's' + i ).curveRadius = -.1 - Math.exp( scrollPos / 3 )
			eval( 'o' + i ).position.x = Math.cos( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).position.y = Math.sin( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).rotation.x = 
			eval( 'o' + i ).rotation.y = 
			eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

		}

	} else if( scrollPos < 50 ) {

		services.rotation.z = -Math.PI / 22.5 * scrollPos
		objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
		objects.scale.x = objects.scale.y = objects.scale.z = 22 / scrollPos

		for( let i = 1; i < 6; i++ ) {

			servRot = eval( 's' + i ).rotation.z
			eval( 'o' + i ).position.x = Math.cos( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).position.y = Math.sin( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).rotation.x = 
			eval( 'o' + i ).rotation.y = 
			eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

		}

	} else {

		services.rotation.z = -Math.PI / 22.5 * scrollPos
		objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
		objects.scale.x = objects.scale.y =
		objects.scale.z = ( .35 / Math.exp( ( scrollPos - 50 ) / 6 ) )

		for( let i = 1; i < 6; i++ ) {

			servRot = eval( 's' + i ).rotation.z
			eval( 's' + i ).position.x = Math.cos( servRot ) * Math.exp( ( scrollPos - 30 ) / 10 )
			eval( 's' + i ).position.y = Math.sin( servRot ) * Math.exp( ( scrollPos - 30 ) / 10 )
			eval( 'o' + i ).position.x = Math.cos( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).position.y = Math.sin( servRot ) * Math.log( 350 / scrollPos ) * 7.2
			eval( 'o' + i ).rotation.x = 
			eval( 'o' + i ).rotation.y = 
			eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

		}

	}

	txtQuoteM.position.x = -txtQuoteMX - 3 - Math.exp( scrollPos ) / 1000
	txtQuoteL.position.x = 3 + txtQuoteLX + Math.exp( scrollPos ) / 1000
	
	txtQuoteM.curveRadius = 
	txtQuoteL.curveRadius = 
	txtQuoteMR * ( Math.cos( Math.log( scrollPos + 1 ) ) + 1 ) / smooth

	if( scrollPos ) {

		txtQuoteM.curveRadius = 
		txtQuoteL.curveRadius = 
		txtQuoteMR * ( Math.cos( Math.log( scrollPos + 1 ) ) + 1 ) / smooth

	} else {

		txtQuoteM.curveRadius = txtQuoteMR
		txtQuoteL.curveRadius = txtQuoteLR
		logo.scale.set( .01, .01, -.01 )
    logo.position.set( -logoWidth * .005, 10, 0 )

	}

}

////////////////// ANIM

function animate() { 

  requestAnimationFrame( animate )

  renderer.render( scene, camera )

	// raycaster.setFromCamera( mouse, camera )

	// const intersects = raycaster.intersectObjects( scene.children )

	// for ( let i = 0; i < intersects.length; i ++ ) {

	// 	intersects[ i ].object.material.color.set( 0xaaaaaa )

	// }

}

animate()