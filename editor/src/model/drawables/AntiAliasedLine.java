package model.drawables;

import java.awt.Graphics;

/**
 * Klasse, die eine Linie mit Anti-Aliasing-Effekt repr&auml;sentiert. Eine
 * Linie besteht aus zwei Punkten. Diese Punkte dienen als Start- und Endpunkt
 * fuer den Bresenham Algorithmus.
 * 
 * @author Nicolas Neubauer
 */
public class AntiAliasedLine extends DrawableObject {

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
	public AntiAliasedLine(int xa, int ya, int xe, int ye) {
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
	public AntiAliasedLine(Point a, Point e) {
		this.a = a;
		this.e = e;
	}

	/**
	 * Paint-Methode der Linienklasse. Nutzt den Bresenham-Algorithmus (ohne
	 * Integer-Arithmetik). Zeichnet eine Linie mit einem einfachen
	 * Anti-Aliasing-Effekt
	 * 
	 * @param g
	 *            der Graphikkontext, in den das Objekt gezeichnet werden soll
	 */
	public void paint(Graphics g) {
		Point p = new Point(a);

		float error, delta, dx, dy;
		int inc_x, inc_y;

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
			error = 0.0f;
			delta = Math.abs(dy / dx);
			while (p.x != e.x) {

				// Erst den normalen Pixel mit Grauwert = Fehlerwert setzen
				setPixel(p.x, p.y, Math.abs(error), g);
				// Dann den optischen Eindruck auf volles schwarz darunter oder
				// darüber ergänzen
				if (error > 0.0f)
					setPixel(p.x, p.y + inc_y, (1 - Math.abs(error)), g);
				else
					setPixel(p.x, p.y - inc_y, (1 - Math.abs(error)), g);

				p.x += inc_x;
				error = error + delta;
				if (error > 0.5f) {
					p.y += inc_y;
					error = error - 1.0f;
				}
			}
		} else // steil nach oben oder unten
		{
			error = 0.0f;
			delta = Math.abs(dx / dy);
			while (p.y != e.y) {

				// Erst den normalen Pixel mit Grauwert = Fehlerwert setzen
				setPixel(p.x, p.y, Math.abs(error), g);
				// Dann den optischen Eindruck auf volles schwarz darunter oder
				// darüber ergänzen
				if (error > 0.0f)
					setPixel(p.x + inc_x, p.y, (1 - Math.abs(error)), g);
				else
					setPixel(p.x - inc_x, p.y, (1 - Math.abs(error)), g);

				p.y += inc_y;
				error = error + delta;
				if (error > 0.5f) {
					p.x += inc_x;
					error = error - 1.0f;
				}
			}
		}

		setPixel(e.x, e.y, g);
	}
}
