var reached = false;

function moveObject(object, xTarget , yTarget, zTarget, speed, timeDif) {

	console.log(object.position.z);
	if(timeDif < 0.004){
		var objectPosition = object.position;
		var targetPosition = new THREE.Vector3( xTarget , yTarget, zTarget );
		var distvector = new THREE.Vector3();
		distvector.subVectors( targetPosition, objectPosition );
		distvector.normalize();

		var moveVector = distvector;
		var newSpeed = speed*timeDif;
		moveVector.multiplyScalar (newSpeed );

		object.translateX ( moveVector.x );
		object.translateY ( moveVector.y );
		object.translateZ ( moveVector.z );



		if(!reached){
			if(Math.abs(xTarget - objectPosition.x) < 5 &&
				Math.abs(yTarget - objectPosition.y) < 5 &&
				Math.abs(zTarget - objectPosition.z) < 5) {
				reached = !reached;
			}
		}
		else{
			if(Math.abs(xTarget - objectPosition.x) < 5 &&
				Math.abs(yTarget - objectPosition.y) < 5 &&
				Math.abs(zTarget - -objectPosition.z) < 5) {
				reached = !reached;
			}
		}
	}
}