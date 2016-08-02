package model.leveleditor;

import model.Matrix;
import model.drawables.Point;

//TODO Kommentar
/**
 * 
 * @author lhembrock
 *
 */
public class Coordinates {
	
	// Ursprüngliche Position des Punktes
	private final double x;
	private final double y;
	
	// Position des Punktes 
	private double posx;
	private double posy;
	
	// Winkel, um den der Ursprüngliche Punkt gedreht wurde
	// in Gradmaß, maximal 360°
	private int angle;
	
	// Faktor, um den skaliert wird
	private static int factor = 10;
	
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
	 * Copy-Konstruktor
	 */
	public Coordinates(Coordinates toCopy) {
		
		this.x = toCopy.getX();
		this.posx = toCopy.getPosx();
		
		this.y = toCopy.getPosy();
		this.posy = toCopy.getPosy();
		
		this.angle = toCopy.getAngle();
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
	
	public Point getScaledIntCoordinates(Coordinates p) {
		// Basis Trafo der Koordinatensysteme
		double[][] translate = {{1, 0, -p.getPosx()}, 
				{0, 1, -p.getPosy()},{0,0,1}};
		
		Matrix translateTo = new Matrix(translate);
		
		translate[0][2] = p.getPosx();
		translate[1][2] = p.getPosy();
		
		Matrix translateFrom = new Matrix(translate);
		
		double[][] scale = {{factor, 0, 0}, 
				{0, factor, 0},{0,0,1}};
		
		Matrix scaling = new Matrix(scale);
		
		double[][] arrPoint = {{this.posx}, 
				{this.posy},{1}};
		
		Matrix matPoint = new Matrix(arrPoint);
		
		matPoint = translateTo.multiply(matPoint);
		matPoint = scaling.multiply(matPoint);
		matPoint = translateFrom.multiply(matPoint);
		
		
		Point point = new Point((int)matPoint.getValue(0, 0),(int) matPoint.getValue(1, 0));
		return point;
	}
	
	
	/**
	 * Nimmt einen Punkt mit int-Koordinaten und setzt damit die Position neu
	 * @param point Neue Position
	 */
	public void setScaledIntCoordinates(Point point) {
		
		double x = point.x / factor;
		double y = point.y / factor;
		
		this.posx = x;
		this.posy = y;
		
	}
	
	/**
	 * Umrechnung von Punkt zu Vektor
	 * @return berechneter Vektor
	 */
	public Coordinates getVector() {
		
		Coordinates v = new Coordinates(0, 0);
		
		v.setPosx(getX());
		v.setPosy(getY());
		
		return v;
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
		translate[1][2] = point.getPosy();
		
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
		
		double[][] translate = {{1, 0, point.getPosx()}, 
				{0, 1, point.getPosy()},{0,0,1}};
		
		Matrix translateTo = new Matrix(translate);
		
		double[][] arrPoint = {{this.posx}, 
				{this.posy},{1}};
		
		Matrix matPoint = new Matrix(arrPoint);
		
		matPoint = translateTo.multiply(matPoint);
		
		this.posx = matPoint.getValue(0, 0);
		this.posy = matPoint.getValue(1, 0);
	}
	
	/**
	 * Berechnet die Distanz zu einem anderen Punkt
	 * @param point Punkt, zu dem die Distanz berechnet wird
	 * @return Distanz
	 */
	public double distanceTo(Coordinates point) {
		
		double newX = Math.pow(this.posx - point.getPosx(), 2); 
		double newY = Math.pow(this.posy - point.getPosy(), 2); 
		
		double distance = Math.sqrt(newX + newY);
		
		return distance;
	}
	
	/**
	 * Invertiert die aktuellen Coordinates und gibt sie in neuen Coordinates zurück
	 * @return invertierte Coordinates 
	 */
	public Coordinates getInvert() {
		
		double newX = -1 * this.x; 
		double newY = -1 * this.y;
		
		double newPosx = -1 * this.posx;
		double newPosy = -1 * this.posy;
		
		int angle = (this.angle + 180) % 360;
		
		Coordinates v = new Coordinates(newX, newY);
		
		v.setPosx(newPosx);
		v.setPosy(newPosy);
		
		v.setAngle(angle);
		
		return v;
	}
	
	/**
	 * Addiert einen Punkt auf den aktuellen Punkt 
	 * Nur bzgl Pos, x&y werden jeweils auf 0 gesetzt
	 * @param point Punkt, der addiert wird
	 * @return Summe der Punkte
	 */
	public Coordinates addCoordinats(Coordinates point) {
		
		double newPosX = this.posx + point.getPosx();
		double newPosY = this.posy + point.getPosy();
		
		Coordinates v = new Coordinates(0, 0);
		
		v.setPosx(newPosX);
		v.setPosy(newPosY);
		
		return v;
	}
	
	/**
	 * Gibt die Koordinaten, die bzgl des Double-Koordinatensystems gegeben sind,
	 * in Koordinaten bzgl des Int-Koordinatensystem um
	 * @return umgerechnete Koordinaten
	 */
	public Point basisChangeDoubleInt() {
		
		int width = 800;
		int heigth = 640;
		
		int newX = this.getScaledIntCoordinates().x + (width / 2);
		int newY = this.getScaledIntCoordinates().y + (heigth / 2);
		
		return new Point(newX, newY);
	}
	
	/**
	 * Gibt die Koordinaten, die bzgl des Int-Koordinatensystems gegeben sind,
	 * in Koordinaten bzgl des Double-Koordinatensystem um
	 * @param c unzurechnende Koordinaten
	 * @return umgerechnete Koordinaten
	 */
	public static Coordinates basisChangeIntDouble(Point p) {
		
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

	public static int getFactor() {
		return factor;
	}

	public static void setFactor(int factorNew) {
		factor = factorNew;
	}

}
