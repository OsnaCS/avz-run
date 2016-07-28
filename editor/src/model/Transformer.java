package model;

import java.awt.geom.Point2D;
import java.util.LinkedList;

import model.drawables.Point;
import model.drawables.Room;

public class Transformer {
	private Point toTransform;
	private Room room;
	private Point2D.Double toTransDouble;
	
	public Transformer(Point t){
		this.toTransform = t;
	}

	public Transformer(Point2D.Double t ){
		int x = (int) Math.round(t.x);
		int y = (int) Math.round(t.y);
		this.toTransform = new Point(x, y);
		this.toTransDouble = t;
	}
	
	public Transformer(Room room ){
		this.room = room;
	}
	//moves the Point saved in Transformer to Postion x,y
	public Point move(int x, int y) {
		
		//creates Matrix for movements
		double move[][] = { { 1, 0, x }, { 0, 1, y }, { 0, 0, 1 } };
		Matrix mover = new Matrix(move);
		
		//multiplies Point with movement matrix
		Point newP = mover.multiply(toTransform);

		return newP;
	}
	
	//moves the Point saved in Transformer to Postion x,y
		public Point2D.Double moveDouble(double x, double y) {
			
			//creates Matrix for movements
			double move[][] = { { 1, 0, x }, { 0, 1, y }, { 0, 0, 1 } };
			Matrix mover = new Matrix(move);
			
			//multiplies Point with movement matrix
			Point2D.Double newP = mover.multiplyDouble(toTransDouble);

			return newP;
		}
	
	//rotates current point with input angle 
	public Point rotate(int angle) {
		
		//creates dummy with coordinates of the point which shall be moved
		Point newP = toTransform;
		
		//sets rotation matrix
		double cosinus = Math.cos(angle);
		double sinus = Math.sin(angle);
		double rotation[][] = { { cosinus, -sinus, 0 }, { sinus, cosinus, 0 }, { 0, 0, 1 } };
		Matrix rotator = new Matrix(rotation);
		
		//rotates current point by multiplying it with matrix
		newP = rotator.multiply(newP);

		return newP;

	}
	
	public Point2D.Double rotateDouble(int angle) {

		// creates dummy with coordinates of the point which shall be moved
		Point2D.Double newP = toTransDouble;

		// sets rotation matrix
		double cosinus = Math.cos(angle);
		double sinus = Math.sin(angle);
		double rotation[][] = { { cosinus, -sinus, 0 }, { sinus, cosinus, 0 }, { 0, 0, 1 } };
		Matrix rotator = new Matrix(rotation);

		// rotates current point by multiplying it with matrix
		newP = rotator.multiplyDouble(newP);

		return newP;

	}
	
	
	public Room rotateRoom(int angle){
		//gets all relevant points
		Point2D.Double a = room.getRealA();
		Point2D.Double e = room.getRealE();
		Point center = room.getCenter();
		
		//rotation center, distance of centerpoint to coordinate origin
		double xDist =(double) center.x;
		double yDist =(double) center.y;
		
		//moves smallest Point, uses center as rotation center
		Transformer originA = new Transformer(a);
		
		Point2D.Double newATemp = originA.moveDouble(-xDist, -yDist);
		
		Transformer rotationA = new Transformer(newATemp);
		
		Point2D.Double newAt = rotationA.rotateDouble(angle);
		
		Transformer backA = new Transformer(newAt);
		
		Point2D.Double newA = backA.moveDouble(xDist, yDist);
		
		
		//moves largest Point, uses center as rotation center
		Transformer originE = new Transformer(e);
		
		Point2D.Double newETemp = originE.moveDouble(-xDist, -yDist);
		
		Transformer rotationE = new Transformer(newETemp);
		
		Point2D.Double newEt = rotationE.rotateDouble(angle);
		
		Transformer back = new Transformer(newEt);
		
		Point2D.Double newE = back.moveDouble(xDist, yDist);
		
		//creates new Room
		Room newR = new Room(room.getName(), newA.x, newA.y, newE.x, newE.y, room.getWaylist());
		return newR;
	}
	
	//scales to input scaling factor
	public Point scale(int sFactor) {
		Point newP = toTransform;
		
		//does basically the same as rotation, just with scaling Factor instead of rotation angle
		double scale[][] = { { sFactor, 0, 0 }, { 0, sFactor, 0 }, { 0, 0, 1 } };
		Matrix scaler = new Matrix(scale);

		newP = scaler.multiply(newP);


		return newP;

	}
	
	public Point2D.Double scaleDouble(int sFactor) {
		Point2D.Double newP = toTransDouble;
		
		//does basically the same as rotation, just with scaling Factor instead of rotation angle
		double scale[][] = { { sFactor, 0, 0 }, { 0, sFactor, 0 }, { 0, 0, 1 } };
		Matrix scaler = new Matrix(scale);

		newP = scaler.multiplyDouble(newP);


		return newP;

	}
}
