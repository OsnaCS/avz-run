package model.leveleditor;

import java.awt.Toolkit;

import model.Matrix;
import model.drawables.Point;

public class Coordinates {
	
	// Ursprüngliche Position des Punktes
	private final double x;
	private final double y;
	
	// Position des Punktes 
	private double posx;
	private double posy;
	
	// Winkel, um den der Ursprüngliche Punkt gedreht wurde
	// in Gradmaß, maximal 2*Pi
	private int angle;
	
	// Faktor, um den skaliert wird
	private int factor;
	
	/**
	 * Konstruktor für einen zweidimesionalen Punkt
	 * @param x x-Koordinate
	 * @param y y-Koordinate
	 */
	public Coordinates(double x, double y){
		this.x = x;
		this.posx = x;
		
		this.y = y;
		this.posy = y;
		
		this.angle = 0;
		
		this.factor = 10;
	}
	
	/**
	 * Gibt die aktuellen Koordinaten umgerechnet in int und skaliert zurück
	 * @param factor Faktor, um den skaliert wird
	 * @return int-Koordinaten
	 */
	public Point getScaledIntCoordinates() {
		// Basis Trafo der Koordinatensysteme
		int x = (int) ((factor * this.posx) + 0.5);
		int y = (int) ((factor * this.posy) + 0.5);
				
		return new Point(x,y);
	}
	
	/**
	 * Nimmt einen Punkt mit int-Koordinaten und setzt damit die Position neu
	 * @param point Neue Position
	 */
	public void setScaledIntCoordinates(Point point) {
		
		
		
	}
	
	/**
	 * Rotiert den Punkt um eine Winkel um einen Punkt
	 * @param angle Winkel, un den rotiert wird
	 * @param point Punkt, um den Rotiert wird
	 */
	public void rotation(int angle, Coordinates point){
		
		double[][] translate = {{1, 0, -point.getPosx()}, 
				{0, 1, -point.getPosy()},{0,0,1}};
		
		Matrix translateTo = new Matrix(translate);
		
		translate[0][2] = point.getPosx();
		translate[1][3] = point.getPosy();
		
		Matrix translateFrom = new Matrix(translate);
		
		double[][] rotate = {{Math.cos(angle), -Math.sin(angle), 0}, 
				{Math.sin(angle), Math.cos(angle), 0},{0,0,1}};
		
		Matrix rotation = new Matrix(rotate);
		
		double[][] arrPoint = {{this.posx}, 
				{this.posy},{1}};
		
		Matrix matPoint = new Matrix(arrPoint);
		
		matPoint = translateTo.multiply(matPoint);
		matPoint = rotation.multiply(matPoint);
		matPoint = translateFrom.multiply(matPoint);
		
		this.posx = matPoint.getValue(0, 0);
		this.posy = matPoint.getValue(1, 0);
		
		this.angle = this.angle + angle % 360;
		
	}
	
	/**
	 * Führt eine Translation um den 
	 * @param point Punkt zu den translatiert werden soll
	 */
	public void translate(Coordinates point) {
		
	}
	
	/**
	 * Berechnet die Distanz zu einem anderen Punkt
	 * @param point Punkt, zu dem die Distanz berechnet wird
	 * @return Distanz
	 */
	public double distanceTo(Coordinates point) {
		
		
		
		return 0.0;
	}
	
	/**
	 * Addiert einen Punkt auf den aktuellen Punkt
	 * @param point Punkt, der addiert wird
	 * @return Summe der Punkte
	 */
	public Coordinates addCoordinats(Coordinates point) {
		return null;
	}
	
	public Point basisChangeDoubleInt(Coordinates c) {
		
		int width = 800;
		int heigth = 640;
		
		int newX = (int) ((c.getX() * factor) - (width / 2) + 0.5);
		int newY = (int) ((c.getY() * factor) - (heigth / 2) + 0.5);
		
		return new Point(newX, newY);
	}
	
	public Coordinates basisChangeIntDouble(Point p) {
		
		int width = 800;
		int heigth = 640;
		
		double newX = (p.x / factor) + (width / 2);
		double newY = (p.y / factor) + (heigth / 2);
		
		return new Coordinates(newX, newY);
	}
	
	/*********************************************************/
	/***************** GETTER und SETTER *********************/
	/*********************************************************/

	public double getPosx() {
		return posx;
	}

	public void setPosx(double posx) {
		this.posx = posx;
	}

	public double getPosy() {
		return posy;
	}

	public void setPosy(double posy) {
		this.posy = posy;
	}
	
	public void setPos(Coordinates pos) {
		this.posx = pos.getPosx();
		this.posy = pos.getPosy();
	}

	public int getAngle() {
		return angle;
	}

	public void setAngle(int angle) {
		this.angle = angle;
	}

	public double getX() {
		return x;
	}

	public double getY() {
		return y;
	}

}
