var reached = false;

function moveObject(object, xStart , yStart, zStart, xOffset, yOffset, zOffset, speed, timeDif) {

	//console.log(reached);
	if(timeDif < 0.004){
		var startPosition = new THREE.Vector3(xStart , yStart, zStart );
		var targetPosition = new THREE.Vector3( xStart+xOffset , yStart+yOffset, zStart+zOffset );
		var distvector = new THREE.Vector3();
		if(!reached){
			distvector.subVectors( targetPosition, startPosition );
		}
		else{
			distvector.subVectors( startPosition, targetPosition);
			distvector.multiplyScalar(-1);
		}

		distvector.normalize();

		var moveVector = distvector;
		var newSpeed = speed*timeDif;
		moveVector.multiplyScalar(newSpeed );

		object.translateX ( moveVector.x );
		object.translateY ( moveVector.y );
		object.translateZ ( moveVector.z );

		var difVector = new THREE.Vector3();
		if(!reached){
			difVector.subVectors(targetPosition, object.position);

			if(Math.abs(difVector.x) <20 && Math.abs(difVector.y) <20 && Math.abs(difVector.z) <20){
				reached = true;
				object.rotateY(Math.PI);
			}
		}
		else{
			difVector.subVectors(startPosition, object.position);	

			if(Math.abs(difVector.x) <20 && Math.abs(difVector.y) <20 && Math.abs(difVector.z) <20){
				reached = false;
				object.rotateY(-Math.PI);
			}
		}


	}


}