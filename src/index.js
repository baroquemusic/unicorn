import favicon from './assets/favicon.ico'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { Text } from 'troika-three-text'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import unicornLogo from './assets/unicorn-logo.svg'
import font from './assets/fonts/Philosopher.woff'
import fontJson from './assets/fonts/Philosopher.json'
import appDevelopment from './assets/glb/app.glb'
import blockChain from './assets/glb/block.glb'
import deepLearning from './assets/glb/deep.glb'
import extendedReality from './assets/glb/extended.glb'
import interactive3D from './assets/glb/interact.glb'

var scrLock = false

const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
document.addEventListener( 'click', click )

function click() {

	if( scrollPos > 88 ) {

		navigator.clipboard.writeText( 'hi@unicorn3d.com' )

		alert( 'hi@unicorn3d.com copied to your clipboard' )

	}

}

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
	uniforms: { amp: { value: 0.0 } }

} )

function vertexShader() {

  return `

		uniform float amp;
		attribute vec3 dis;

		void main() {
			
			vec3 newPos = position + dis * amp;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );

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

var out = []

function random() {

    var scale = 1000

    var r = Math.random( 2 ) * Math.PI
    var z = Math.random( 2 ) - 1
    var zScale = Math.sqrt( 1 - z * z ) * scale

    out[ 0 ] = Math.cos( r ) * zScale
    out[ 1 ] = Math.sin( r ) * zScale
    out[ 2 ] = z * scale

    return out

}

const tessGeo = new TessellateModifier

logoLoader.load(

	unicornLogo,

	function( data ) {

		const paths = data.paths

		for( let i = 0; i < paths.length; i++ ) {

			const path = paths[ i ]
			const shapes = SVGLoader.createShapes( path )
			var geometry = new THREE.ShapeGeometry( shapes, 5 )
			geometry = tessGeo.modify( geometry )
			
			var numFaces = geometry.attributes.position.count / 3
			var dis = new Float32Array( numFaces * 9 )

			for( let j = 0; j < numFaces; j++ ) {

				var ix = j * 9

				random()

				for( let k = 0; k < 3; k++ ) {

					dis[ ix + 3 * k ] = out[ 0 ]
					dis[ ix + 3 * k + 1 ] = out[ 1 ] - window.innerHeight / 2
					dis[ ix + 3 * k + 2 ] = out[ 2 ]

				}

			}

			geometry.setAttribute( 'dis', new THREE.BufferAttribute( dis, 3 ) )

			const mesh = new THREE.Mesh( geometry, material )
			logo.add( mesh )

		}

		const bbLogo = new THREE.Box3().setFromObject( logo )
		logoWidth = bbLogo.max.x
    logo.rotation.y = logo.rotation.z = Math.PI
    logo.scale.set( .01, .01, -.01 )
    logo.position.set( -logoWidth * .005, 10, 0 )

    scene.add( logo )

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

let txtQuoteMX
let txtQuoteMR

txtQuoteM.sync( () => {

  txtQuoteMX = txtQuoteM.geometry.boundingBox.max.x
	txtQuoteM.curveRadius = txtQuoteMR = txtQuoteMX * Math.PI * 2
	txtQuoteM.position.set( -txtQuoteMX - 3, -1, 0 )
	scene.add( txtQuoteM )

} )

let txtQuoteLX
let txtQuoteLR

txtQuoteL.sync( () => {

  txtQuoteLX = txtQuoteL.geometry.boundingBox.max.x
	txtQuoteL.curveRadius = txtQuoteLR = txtQuoteLX * Math.PI * 2
	txtQuoteL.position.set( 3, -1, 0 )
	txtQuoteL.anchorX = txtQuoteLX
	txtQuoteL.position.x += txtQuoteLX
	scene.add( txtQuoteL )
	scrLock = true

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

//////////// EMAIL

const eMaterial = new THREE.ShaderMaterial( {

	fragmentShader: fragmentShader(),
	vertexShader: vertexShader(),
	uniforms: { amp: { value: 0.0 } }

} )

const fontLoader = new FontLoader

var e

fontLoader.load( 'Philosopher.json', ( font ) => {

	let geometry = new TextGeometry( 'Click to contact us\nhi@unicorn3d.com', {

	 	font: font,
		size: 2,
		height: 0,
		curveSegments: 3
		
	} )

	geometry = tessGeo.modify( geometry )

	const numFaces = geometry.attributes.position.count / 3

	const dis = new Float32Array( numFaces * 9 )

	for( let i = 0; i < numFaces; i++ ) {

		var ix = i * 9

		random()

		for( let k = 0; k < 3; k++ ) {

			dis[ ix + 3 * k ] = out[ 0 ]
			dis[ ix + 3 * k + 1 ] = out[ 1 ] - window.innerHeight / 2
			dis[ ix + 3 * k + 2 ] = out[ 2 ]

		}

	}

	geometry.setAttribute( 'dis', new THREE.BufferAttribute( dis, 3 ) )

	e = new THREE.Mesh( geometry, eMaterial )

	eMaterial.uniforms.amp.value = 15000

	scene.add( e )

} )

//////////////// SCROLL

let scrollPos = 0
const smooth = 10
let servRot, logoScale

function onMouseWheel( event ) {

	scroll = event.deltaY

	if( scroll > 0 && scrollPos < 144 && scrLock ) { 

		scrollPos += 1
		roll()
	
	} else if( scroll < 0 && scrollPos > 0 && scrLock ) { 
	
		scrollPos -= 1
		roll()
	
	}

	function roll() {

		console.log( scrollPos )

		if( scrollPos < 8 ) {

			logo.position.y = 12 - Math.log( scrollPos + 2 ) * 3.2
			logo.position.x = -logoWidth * .005 + Math.log( scrollPos + 1 ) / .72
			logo.scale.x = logo.scale.y = .01 - ( Math.log( scrollPos + 1 ) / 530 )

			services.position.y = -11 + Math.log( scrollPos ) * 6
			services.rotation.x = -Math.PI / 180 * ( 90 - Math.exp( scrollPos / 2 ) )
			objects.rotation.x = Math.PI / 180 * ( - Math.exp( scrollPos / 2 ) )
			services.rotation.z = -Math.PI / 22.5 * scrollPos
			objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
			services.scale.x = services.scale.y = services.scale.z 
				= Math.log( scrollPos ) / 2.7

			objects.scale.x = objects.scale.y = objects.scale.z = 22 / scrollPos

			for( let i = 1; i < 6; i++ ) {

				servRot = eval( 's' + i ).rotation.z
				eval( 's' + i ).position.x = Math.cos( servRot ) 
					* Math.log( scrollPos ) * 4
				eval( 's' + i ).position.y = Math.sin( servRot ) 
					* Math.log( scrollPos ) * 4
				eval( 's' + i ).curveRadius = -.1 - Math.exp( scrollPos / 3 )
				eval( 'o' + i ).position.x = Math.cos( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).position.y = Math.sin( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).rotation.x = 
				eval( 'o' + i ).rotation.y = 
				eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

			}
			
		} else if( scrollPos < 18 ) {

			logo.position.y = 12 - Math.log( scrollPos + 2 ) * 3.2
			logo.scale.x = logo.scale.y = logoScale 
				= .01 - ( Math.log( scrollPos + 1 ) / 530 )
			logo.position.x = -logoWidth * .005 + Math.log( scrollPos + 1 ) / .72

			services.rotation.z = -Math.PI / 22.5 * scrollPos
			objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )

			objects.scale.x = objects.scale.y = objects.scale.z = 22 / scrollPos

			for( let i = 1; i < 6; i++ ) {

				servRot = eval( 's' + i ).rotation.z
				eval( 's' + i ).curveRadius = -.1 - Math.exp( scrollPos / 3 )
				eval( 'o' + i ).position.x = Math.cos( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).position.y = Math.sin( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).rotation.x = 
				eval( 'o' + i ).rotation.y = 
				eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

			}

		} else if( scrollPos < 50 ) {

			eMaterial.uniforms.amp.value = 1 / Math.exp( ( scrollPos - 50 ) * .2 )

			services.rotation.z = -Math.PI / 22.5 * scrollPos
			objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
			objects.scale.x = objects.scale.y = objects.scale.z = 22 / scrollPos

			for( let i = 1; i < 6; i++ ) {

				servRot = eval( 's' + i ).rotation.z
				eval( 'o' + i ).position.x = Math.cos( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).position.y = Math.sin( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).rotation.x = 
				eval( 'o' + i ).rotation.y = 
				eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

			}

		} else if( scrollPos < 70 ) {

			material.uniforms.amp.value = Math.exp( ( scrollPos - 50 ) * .03 ) - 1

			logo.scale.x = logo.scale.y = ( Math.exp( ( scrollPos - 50 ) / 230 ) ) * logoScale

			eMaterial.uniforms.amp.value = 1 / Math.exp( ( scrollPos - 50 ) * .2 )

			e.scale.x = e.scale.y = Math.log( ( scrollPos - 49 ) / 20 + 1 )
			e.position.x = - e.geometry.boundingSphere.radius * e.scale.x
			e.rotation.x = e.rotation.y = - Math.PI / 180 * ( 70 - scrollPos ) * 2

			services.rotation.z = -Math.PI / 22.5 * scrollPos
			objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
			objects.scale.x = objects.scale.y =
			objects.scale.z = ( .35 / Math.exp( ( scrollPos - 50 ) / 6 ) )

			for( let i = 1; i < 6; i++ ) {

				servRot = eval( 's' + i ).rotation.z
				eval( 's' + i ).position.x = Math.cos( servRot ) 
					* Math.exp( ( scrollPos - 30 ) / 10 )
				eval( 's' + i ).position.y = Math.sin( servRot ) 
					* Math.exp( ( scrollPos - 30 ) / 10 )
				eval( 'o' + i ).position.x = Math.cos( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).position.y = Math.sin( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).rotation.x = 
				eval( 'o' + i ).rotation.y = 
				eval( 'o' + i ).rotation.z = Math.PI / 33 * scrollPos

			}

		} else {

			material.uniforms.amp.value = Math.exp( ( scrollPos - 50 ) * .035 ) - 1

			logo.scale.x = logo.scale.y
				= ( Math.exp( ( scrollPos - 70 ) / 95 ) ) 
				* logoScale 
				* Math.exp( ( scrollPos - 70 ) / 12 )

			logo.rotation.x = Math.PI / 180 * ( scrollPos - 70 )
			logo.rotation.y = Math.PI + logo.rotation.x * 1.5

			eMaterial.uniforms.amp.value = 1 / Math.exp( ( scrollPos - 50 ) * .2 )

			e.scale.x = e.scale.y = Math.log( ( scrollPos - 49 ) / 20 + 1 )
			e.position.x = - e.geometry.boundingSphere.radius * e.scale.x
			e.position.y = - e.geometry.boundingSphere.center.y * e.scale.x

			services.rotation.z = -Math.PI / 22.5 * scrollPos
			objects.rotation.z = -Math.PI / 22.5 * scrollPos - ( 36 * ( Math.PI / 180 ) )
			objects.scale.x = objects.scale.y =
			objects.scale.z = ( .35 / Math.exp( ( scrollPos - 50 ) / 6 ) )

			for( let i = 1; i < 6; i++ ) {

				servRot = eval( 's' + i ).rotation.z
				eval( 's' + i ).position.x = Math.cos( servRot ) 
					* Math.exp( ( scrollPos - 30 ) / 10 )
				eval( 's' + i ).position.y = Math.sin( servRot ) 
					* Math.exp( ( scrollPos - 30 ) / 10 )
				eval( 'o' + i ).position.x = Math.cos( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
				eval( 'o' + i ).position.y = Math.sin( servRot ) 
					* Math.log( 350 / scrollPos ) * 7.2
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

}

////////////////// ANIM

function animate() { 

  requestAnimationFrame( animate )

  renderer.render( scene, camera )

	// raycaster.setFromCamera( mouse, camera )

	// const intersects = raycaster.intersectObjects( scene.children )

	// for( let i = 0; i < intersects.length; i ++ ) {

	// 	if( intersects[ i ].object = 'Mesh' ) {
	// 		console.log(intersects[ i ])
	// 	}

	// }

}

animate()