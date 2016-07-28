package model.drawables;

import java.awt.Graphics;

/**
 * Klasse, die eine Linie repr&auml;sentiert. Eine Linie besteht aus zwei
 * Punkten. Diese Punkte dienen als Start- und Endpunkt fuer den Bresenham
 * Algorithmus.
 * 
 * @author Nicolas Neubauer
 */
public class Line extends DrawableObject implements Comparable<Line> {
	protected Point a; // Anfangspunkt a
	protected Point e; // Endpunkt e

	/**
	 * Konstruktor zum erzeugen eines Linienobjektes
	 * 
	 * @param xa
	 *            x-Koordinate des Startpunktes
	 * @param ya
	 *            y-Koordinate des Startpunktes
	 * @param xe
	 *            x-Koordinate des Endpunktes
	 * @param ye
	 *            y-Koordinate des Endpunktes
	 */
	public Line(int xa, int ya, int xe, int ye) {
		this(new Point(xa, ya), new Point(xe, ye));
	}

	/**
	 * Konstruktor zum Erzeugen eines Linienobjektes
	 * 
	 * @param a
	 *            Startpunktes
	 * @param e
	 *            Endpunktes
	 */
	public Line(Point a, Point e) {
		this.a = a;
		this.e = e;
	}

	/**
	 * Paint-Methode der Linienklasse Nutzt den Bresenham-Algorithmus
	 * 
	 * @param g
	 *            der Graphikkontext, in den das Objekt gezeichnet werden soll
	 */
	public void paint(Graphics g) {
		Point p = new Point(a);

		int error, delta, schwelle, dx, dy, inc_x, inc_y;
		dx = e.x - p.x;
		dy = e.y - p.y;

		if (dx > 0)
			inc_x = 1;
		else
			inc_x = -1;
		if (dy > 0)
			inc_y = 1;
		else
			inc_y = -1;

		if (Math.abs(dy) < Math.abs(dx)) // flach nach oben oder unten
		{
			error = -Math.abs(dx);
			delta = 2 * Math.abs(dy);
			schwelle = 2 * error;
			while (p.x != e.x) {
				setPixel(p.x, p.y, g);
				p.x += inc_x;
				error = error + delta;
				if (error > 0) {
					p.y += inc_y;
					error = error + schwelle;
				}
			}
		} else // steil nach oben oder unten
		{
			error = -Math.abs(dy);
			delta = 2 * Math.abs(dx);
			schwelle = 2 * error;
			while (p.y != e.y) {
				setPixel(p.x, p.y, g);
				p.y += inc_y;
				error = error + delta;
				if (error > 0) {
					p.x += inc_x;
					error = error + schwelle;
				}
			}
		}

		setPixel(e.x, e.y, g);
	}

	/**
	 * Liefert den Schnittpunkt, wenn diese Linie die spezifizierte Kante eines
	 * Clipping-Rechtecks schneidet; null sonst.
	 * 
	 * @param value
	 *            der Wert der interessanten Kante in Pixeln
	 * @param edge
	 *            die interessante Kante
	 * @return der Schnittpunkt, falls er existiert; null sonst
	 */
	public Point intersection(int value, int edge) {
		boolean avis; // ist Startpunkt drinnen?
		boolean evis; // ist Endpunkt drinnen?
		double slope; // Steigung dieser Linie
		Point p;

		avis = a.onVisibleSide(value, edge); // Startpunkt testen
		evis = e.onVisibleSide(value, edge); // Endpunkt testen

		if ((avis && evis) || (!avis && !evis)) // kein Schnittpunkt
			return null;
		else {
			p = new Point(a); // Hilfspunkt vorbereiten
			slope = (e.y - a.y) / (double) (e.x - a.x); // Steigung berechnen

			if ((edge == TOP) || (edge == BOTTOM)) // waagerechte Kante
			{
				p.x = (int) ((value - a.y) / slope) + a.x;
				p.y = value;
			} else // senkrechte Kante
			{
				p.x = value;
				p.y = (int) ((value - a.x) * slope) + a.y;
			}
		}

		return p; // Hilfspunkt zurueck
	}

	/**
	 * Vergleicht zwei Linien anhand des y-Werts der Anfangspunkte.
	 */
	public int compareTo(Line l) {
		return l.a.y - a.y;
	}

}
