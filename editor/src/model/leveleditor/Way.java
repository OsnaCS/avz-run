package model.leveleditor;

import model.drawables.DrawableObject;

import model.drawables.Line;
import model.drawables.*;

import java.awt.Graphics;
import java.awt.geom.Point2D;



public class Way extends DrawableObject {
	
	Coordinates pos;
	Coordinates normal;
	Room father;
	
	public Way(Coordinates pos, Coordinates normal, Room father){
		this.pos= pos;
		this.normal = normal;
		this.father = father;
	}
	
	public boolean compareDistance(Way other){
		return true;
	}
	
	public Way calcNormal(){
		double x = 1.0;
		double y = 0.0;
		Coordinates nNormal = new Coordinates(x, y);
		Way way =  new Way (pos, nNormal, father);
		return way;
	}
	
	public Point fittingPos(){
		Point nowPos = pos.getScaledIntCoordinates(2);
		Point papaPos = father.center.getScaledIntCoordinates(2);
		
		int x = nowPos.x + papaPos.x;
		int y = nowPos.y + papaPos.y;
		
		Point fitPos = new Point(x,y);
		
		return fitPos;
	
	}
	
	public void paint(Graphics g){
		Point a = new Point(0, 0);
		Point b = new Point (1, 1);
		new Line(a, b).paint(g);
		
	}
	
	
	
}
