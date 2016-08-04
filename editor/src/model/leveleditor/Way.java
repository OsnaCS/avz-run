package model.leveleditor;

import model.drawables.DrawableObject;

import model.drawables.Line;
import model.Matrix;
import model.drawables.*;

import java.awt.Color;
import java.awt.Graphics;

import org.omg.CORBA.portable.Delegate;




/*
 * Created by Tom Krümmel
 */

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
	public Way(Way way, Room father){
		this.type = way.getType();
		this.pos = new Coordinates(way.getPos());
		this.normal = new Coordinates(way.getNormal());
		this.father = father;
	}

	public void updatePosition(){

		Coordinates newPos = new Coordinates(father.getCenter());

		newPos = newPos.addCoordinats(pos.getVector());

		this.pos.setPos(newPos);
	}

	public Coordinates getActualPosition(){
		double updatedX = father.getCenter().getPosx() + pos.getX();
		double updatedY = father.getCenter().getPosy() + pos.getY();
		int angle = father.getCenter().getAngle();
		Coordinates updatedCoordinates = new Coordinates(updatedX, updatedY, angle);
		for(int i =0; i<angle ; i+=90 ){
			updatedCoordinates.rotation(90, father.getCenter());
		}
		return updatedCoordinates;
	}

	/*
	 * compares distances of two ways, if they are smaller as 10 Pixels returns therefore true
	 * and signals ability to connect
	 */
	public boolean compareDistance(Way other){

		//updatePosition();
		//other.updatePosition();

		
		//caclculates absolute value of the distances between x and y coordinate of the two ways
		double distX = Math.abs(this.pos.getScaledIntCoordinates(this.getFather().getCenter()).x - other.pos.getScaledIntCoordinates(other.getFather().getCenter()).x);
		double distY = Math.abs(this.pos.getScaledIntCoordinates(this.getFather().getCenter()).y - other.pos.getScaledIntCoordinates(other.getFather().getCenter()).y);
//		System.out.println("Distanz:" + distX + "," + distY);
//		System.out.println("this x:"  +this.getFather().getCenter().getPosx()+ " other:" + (other.getFather().getCenter().getPosx()));
		if(distX < maxDistance && distY < maxDistance) {

		//	System.out.println("Normals: (" + this.normal.getVector().getX() + "," + this.normal.getVector().getY() + ") ("+
		//			other.normal.getInvert().getVector().getX()+","+other.normal.getInvert().getVector().getY()+")");

			if (other.getNormal().getInvert().getVector().getX()==this.normal.getVector().getX()
					|| other.getNormal().getInvert().getVector().getY()==this.normal.getVector().getY())
			{
			//	System.out.println("Distanz:" + distX + "," + distY);
			}

		}


		//compares both distances with the allowed distance to create a circle
		//which if it is small enough signals ability to connect and has orthogonal normals
		//and is of the same type
		if(distX < maxDistance && distY < maxDistance
				&& (other.getNormal().getInvert().getVector().getX()==this.normal.getVector().getX()
						|| other.getNormal().getInvert().getVector().getY()==this.normal.getVector().getY()))
			//	&& other.getType().equals(this.type)) {
			{
			return true;
		}
		//else returns false
		return false;
	}
	
	/*
	 * calculates the new Normals after rotation
	 */
	public void calcNormal(double rotation){
		
		if(normal.getPosx()==0){
			normal.setPosx(normal.getPosy()*-1);
			normal.setPosy(0.0);
		}
		else{
			normal.setPosy(normal.getPosx());
			normal.setPosx(0.0);
		}

		
	}
	
	
	/*
	 * creates a usable Position of Way for drawing
	 */
	public Point fittingPos(){
//		//gets the Positions of way and the center of father
		Point nowPos = pos.getScaledIntCoordinates(father.getCenter());
//		int x = nowPos.x * 2;
//		int y = nowPos.y * 2;
//		double[][] translate = {{1, 0, x}, 
//				{0, 1, y},{0,0,1}};
//		Matrix workaround = new Matrix(translate);
//		nowPos = workaround.multiply(nowPos);
		
		//nowPos =new Point(nowPos.x, nowPos.y);
//		int papaPosX = (int) (father.getCenter().getPosx() +0.5);
//		int papaPosY = (int) (father.getCenter().getPosy() +0.5);
//		Point papaPos = new Point(papaPosX, papaPosY);
//		
//		//merges both to get the position in coordinate system relative
//		//to the father's center
//		int x = nowPos.x + papaPos.x;
//		int y = nowPos.y + papaPos.y;
//		
//		//creates Point out of it
//		Point fitPos = new Point(x,y);
//		
//		//returns point
		return nowPos;
	}
	
	@Override
	/*
	 *Paints a line in direction of normal with the radius of clickable circle
	 */
	public void paint(Graphics g){
		
		
		//updates normals
		//this.calcNormal(father.getCenter().getAngle());
		
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
			int y = a.y + maxDistance;
			b.x = a.x;
			b.y = y;
		}else{
			int y = a.y - maxDistance;
			b.x = a.x;
			b.y = y;
		}
		
		Color c = Color.BLACK;
		// decides by type of door its color
		if (type.equals("glass")) {
			//Cyan for glassdoor
			c = Color.BLUE;
		} else if (type.equals("floor")) {
			//Yellow for corridor
			c = Color.MAGENTA;
		} else {
			//selects green for wooden door
			c = Color.GREEN;
		}
		
		//sets selected color
		g.setColor(c);
		
		// draws line from current position to the setted Point by normal
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
	
	

	public String toString(){
		return getType() + " Pos:" + getPos().getPosx() + "/" + getPos().getPosy() + " Normal: " + getNormal().getPosx() +
				"/" + getNormal().getPosy() + " " + getFather().getName();
	}
	
	
}
