package model.leveleditor;

import model.drawables.DrawableObject;

import model.drawables.Line;
import model.drawables.*;

import java.awt.Graphics;
import java.awt.geom.Point2D;



public class Way extends DrawableObject {
	
	private Coordinates pos;
	private Coordinates normal;
	private Room father;
	private String type;
	
	int maxDistance = 10;
	
	public Way(String type, Coordinates pos, Coordinates normal, Room father){
		this.type = type;
		this.pos= pos;
		this.normal = normal;
		this.father = father;
	}
	
	/*
	 * compares distances of two ways, if they are smaller as 10 Pixels returns therefore true
	 * and signals ability to connect
	 */
	public boolean compareDistance(Way other){
		
		//caclculates absolute value of the distances between x and y coordinate of the two ways
		double distX = Math.abs(pos.getPosx() - other.pos.getPosx());
		double distY = Math.abs(pos.getPosy() - other.pos.getPosy());
		
		//compares both distances with the allowed distance to create a circle
		//which if it is small enough signals ability to connect
		if(distX < maxDistance && distY < maxDistance)
		return true;
		
		//else returns false
		return false;
	}
	
	/*
	 * calculates the new Normals after rotation
	 */
	public void calcNormal(double rotation){
		
		//in case of switching to the sides, the absolute value of normals stays the same
		//just x and y value change
		if(rotation == Math.PI/2 || rotation == Math.PI * 1.5){
			double tmp;
			tmp = normal.getPosx();
			normal.setPosx(normal.getPosy());
			normal.setPosy(tmp);
		}
		
		//switching to horizontal lines switches algebraic sign of normal
		if(rotation == Math.PI || rotation == Math.PI * 2){
			double tmp;
			tmp = - normal.getPosx();
			normal.setPosx(- normal.getPosy());
			normal.setPosy(tmp);
		}
	}
	
	
	/*
	 * creates a usable Position of Way for drawing
	 */
	public Point fittingPos(){
		//gets the Positions of way and the center of father
		Point nowPos = pos.getScaledIntCoordinates();
		Point papaPos = father.center.getScaledIntCoordinates();
		
		//merges both to get the position in coordinate system relative
		//to the father's center
		int x = nowPos.x + papaPos.x;
		int y = nowPos.y + papaPos.y;
		
		//creates Point out of it
		Point fitPos = new Point(x,y);
		
		//returns point
		return fitPos;
	
	}
	
	@Override
	/*
	 *Paints a line in direction of normal with the radius of clickable circle
	 */
	public void paint(Graphics g){
		
		//updates normals
		this.calcNormal(father.center.getAngle());
		
		//gets the position of the way at the moment
		Point a = this.fittingPos();
		
		//dummy
		Point b = new Point (0, 0);
		
		//checks direction of normals and adds the radius
		//of clickable circle to matching coordinate
		//and changes the dummypoint
		if(normal.getPosx() > 0){
			int x = a.x + maxDistance;
			b.x = x;
			b.y = a.y;
		}else if(normal.getPosx() < 0){
			int x = a.x - maxDistance;
			b.x = x;
			b.y = a.y;
		}else if(normal.getPosy() > 0){
			int y = a.x + maxDistance;
			b.x = a.x;
			b.y = y;
		}else{
			int y = a.x - maxDistance;
			b.x = a.x;
			b.y = y;
		}
		
		//draws line from current position to the stted Point by normal
		new Line(a, b).paint(g);
		
	}

	
	/*
	 * ####### Getter and Setter #####	
	 */
	
	public Coordinates getPos() {
		return pos;
	}

	public void setPos(Coordinates pos) {
		this.pos = pos;
	}

	public Coordinates getNormal() {
		return normal;
	}

	public void setNormal(Coordinates normal) {
		this.normal = normal;
	}

	public Room getFather() {
		return father;
	}

	public void setFather(Room father) {
		this.father = father;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getMaxDistance() {
		return maxDistance;
	}

	public void setMaxDistance(int maxDistance) {
		this.maxDistance = maxDistance;
	}
	

	
	
	
}
