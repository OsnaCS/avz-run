package model;

import model.drawables.Point;

import java.awt.geom.Point2D;

public class Way {
	private Point2D.Double location;
	private String type;
	private int normalx;
	private int normaly;

	public int getNormalx() {
		return normalx;
	}

	public void setNormalx(int normalx) {
		this.normalx = normalx;
	}

	public int getNormaly() {
		return normaly;
	}

	public void setNormaly(int normaly) {
		this.normaly = normaly;
	}



	public Way(Point2D.Double location, String type, int normalx, int normaly){
		this.location = location;
		this.type = type;
		this.normalx=normalx;
		this.normaly=normaly;
	}
	
	public Way(double x, double y, String type, int normalx, int normaly){
		location = new Point2D.Double(x, y);
		this.type = type;
		this.normalx=normalx;
		this.normaly=normaly;
	}

	public Point2D.Double getLocation(){
		return location;
	}

	public Point getRounded(){
		return new Point((int) location.getX(), (int) location.getY());
	}

	public Point getNormald(){
		return new Point((int) location.getX()+normalx, (int) location.getY()+normaly);
	}

	public double getX(){
		return location.x;
	}
	
	public double getY(){
		return location.y;
	}
	
	public String getType(){
		return type;
	}

	
	public void setLocation(Point2D.Double loc){
		location = loc;
	}
	
	public void setX(int newX){
		location.x = newX;
	}
	
	public void setY(int newY){
		location.y = newY;
	}
	
	public void setType(String newType){
		type = newType;
	}

}
