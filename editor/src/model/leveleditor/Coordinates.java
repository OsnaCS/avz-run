package model.leveleditor;

import java.awt.Point;

public class Coordinates {
	
	// Ursprüngliche Position des Punktes
	private final double x;
	private final double y;
	
	// Position des Punktes 
	private double posx;
	private double posy;
	
	// Winkel, um den der Ursprüngliche Punkt gedreht wurde
	// in Bogenmaß
	private int angle;
	
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
	}
	
	/**
	 * Gibt die aktuellen Koordinaten umgerechnet in int und skaliert zurück
	 * @param factor Faktor, um den skaliert wird
	 * @return int-Koordinaten
	 */
	public Point getScaledIntCoordinates(int factor) {
		return null;
	}
	
	/**
	 * Rotiert den Punkt um eine Winkel um einen Punkt
	 * @param angle Winkel, un den rotiert wird
	 * @param point Punkt, um den Rotiert wird
	 */
	public void rotation(int angle, Coordinates point){
		
	}
	
	/**
	 * Führt eine Translation zu einem Punkt aus
	 * @param point Punkt zu den translatiert werden soll
	 */
	public void translateTo(Coordinates point) {
		
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
	
	/*********************************************************/
	/***************** GETTER und SETTER *********************/
	/*********************************************************/
	
	public Coordinates addCoordinats(Coordinates point) {
		return null;
	}

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
