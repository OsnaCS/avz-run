package model.drawables;

import java.awt.Graphics;

/**
 * Diese Klasse repr&auml;sentiert ein Rechteck. Ein Rechteck wird durch zwei
 * Punkte definiert, zum Einen die linke obere Ecke und zum Anderen die rechte
 * untere Ecke.
 * 
 * @author Nicolas Neubauer
 */
public class Rectangle extends DrawableObject {

	protected Point a; // Anfangspunkt a
	protected Point e; // Endpunkt e

	/**
	 * Konstruktor mit frei w&auml;hlbaren Argumenten
	 * 
	 * @param xa
	 *            X-Koordinate des ersten Punkts
	 * @param ya
	 *            Y-Koordinate des ersten Punkts
	 * @param xb
	 *            X-Koordinate des zweiten Punkts
	 * @param yb
	 *            Y-Koordinate des zweiten Punkts
	 *         
	 */
	
	public Rectangle(){
	  this(new Point(0,0), new Point(0,0));
	}
	
	public Rectangle(int xa, int ya, int xe, int ye) {
		this(new Point(xa, ya), new Point(xe, ye));
	}

	/**
	 * Konstruktor mit frei w&auml;hlbaren Argumenten
	 * 
	 * @param a
	 *            ein Punkt
	 * @param e
	 *            ein Punkt verschieden von a
	 */
	public Rectangle(Point a, Point e) {

		int xa, xe, ya, ye;

		// Sicherstellen, dass a oben links ist und e unten rechts

		if (a.x < e.x && a.y > e.y) {
			// a ist unten links und e oben rechts
			xa = a.x;
			ya = e.y;
			xe = e.x;
			ye = a.y;

			this.a = new Point(xa, ya);
			this.e = new Point(xe, ye);

		} else if (e.x < a.x && e.y > a.y) {
			// a ist oben rechts und e unten links
			xa = e.x;
			ya = a.y;
			xe = a.x;
			ye = e.y;

			this.a = new Point(xa, ya);
			this.e = new Point(xe, ye);
		} else if (a.x > e.x && a.y > e.y) {
			// a ist unten rechts und e oben links
			xa = e.x;
			ya = e.y;
			xe = a.x;
			ye = a.y;

			this.a = new Point(xa, ya);
			this.e = new Point(xe, ye);
		} else {
			this.a = a;
			this.e = e;
		}
	}

	/**
	 * Zeichnet das Rechteck in einen grafischen Kontext
	 * 
	 * @param g
	 *            der grafische Kontext in den das Rechteck gezeichnet wird
	 */
	public void paint(Graphics g) {
		Point ur = new Point(e.x, a.y);
		Point ll = new Point(a.x, e.y);

		new Line(a, ur).paint(g);
		new Line(ur, e).paint(g);
		new Line(e, ll).paint(g);
		new Line(ll, a).paint(g);
	}

	/**
	 * A ist immer der Punkt oben links auf der Zeichenfläche
	 * 
	 * @return der Punkt A
	 */
	public Point getA() {
		return a;
	}

	/**
	 * E ist immer der Punkt unten rechts auf der Zeichenfläche
	 * 
	 * @return der Punkt E
	 */
	public Point getE() {
		return e;
	}
	
	public int getLengthX(){
		return Math.abs(a.x - e.x);
	}
	
	public int getLengthY(){
		return Math.abs(a.y - e.y);
	}
}
