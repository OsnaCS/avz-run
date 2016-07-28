package model.drawables;

import java.awt.Graphics;

/**
 * Repräsentiert einen (2D-)Punkt
 * 
 * @author Nicolas Neubauer
 * 
 */
public class Point extends DrawableObject implements Comparable<Point> {

	public int x;
	public int y;

	/**
	 * Konstruktor, der ein Punktobjekt aus einem Koordinatenpaar errechnet
	 * 
	 * @param x
	 *            x-Koordinate des Punktes
	 * @param y
	 *            y-Koordinate des Punktes
	 */
	public Point(int x, int y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Copy-Konstruktor
	 * 
	 * @param copy
	 *            Orginal, das kopiert werden soll
	 */

	public Point(Point copy) {
		this.x = copy.x;
		this.y = copy.y;
	}

	/**
	 * Liefert true, wenn dieser Punkt bezueglich der Kante edge beim Wert value
	 * auf der sichtbaren Seite (also zum Beispiel innerhalb eines
	 * Clipping-Rechtecks) liegt.
	 * 
	 * @param value
	 *            Wert der interessanten Kante
	 * @param edge
	 *            interessante Kante
	 */
	public boolean onVisibleSide(int value, int edge) {
		switch (edge) {
		case LEFT:
			return x >= value; // linke Fenster-Kante
		case RIGHT:
			return x <= value; // rechte Fenster-Kante
		case TOP:
			return y >= value; // obere Fenster-Kante
		case BOTTOM:
			return y <= value; // untere Fenster-Kante
		}
		return false; // sonst draussen
	}

	/**
	 * Paint-Methode der Pointklasse. Zeichnet einen Pixel
	 * 
	 * @param g
	 *            der Graphikkontext, in den das Objekt gezeichnet werden soll
	 */
	public void paint(Graphics g) {
		setPixel(x, y, g);
	}

	public int compareTo(Point p) {
		return x - p.x;
	}
	
	public String toString() {
		return "(x: " + x + ", y: " + y + ")";
	}
}
