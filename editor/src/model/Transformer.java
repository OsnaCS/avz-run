package model;

import java.awt.geom.Point2D;

import model.drawables.Point;
import model.drawables.Room;

public class Transformer {
	private Point toTransform;
	
	public Transformer(Point t){
		this.toTransform = t;
	}

	public Transformer(Point2D.Double t ){
		int x = (int) Math.round(t.x);
		int y = (int) Math.round(t.y);
		this.toTransform = new Point(x, y);
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

	
	//scales to input scaling factor
	public Point scale(int sFactor) {
		Point newP = toTransform;
		
		//does basically the same as rotation, just with scaling Factor instead of rotation angle
		double scale[][] = { { sFactor, 0, 0 }, { 0, sFactor, 0 }, { 0, 0, 1 } };
		Matrix scaler = new Matrix(scale);

		newP = scaler.multiply(newP);


		return newP;

	}
}
