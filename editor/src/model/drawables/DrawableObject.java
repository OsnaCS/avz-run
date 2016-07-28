/**
 * 
 */
package model.drawables;

import java.awt.Color;
import java.awt.Graphics;

/**
 * Oberklasse für grafische (2D-)Objekte
 * 
 * @author Nicolas Neubauer
 * 
 */
public abstract class DrawableObject {

	// Region-Code-Konstanten
	protected static final byte LEFT = 1;
	protected static final byte RIGHT = 2;
	protected static final byte BOTTOM = 4;
	protected static final byte TOP = 8;

	protected static final byte EMPTY = 0;

	/**
	 * Diese Methode sollte das jeweilige Objekt in den grafischen Kontext
	 * zeichnen.
	 * 
	 * @param g
	 *            der grafische Kontext
	 */
	public abstract void paint(Graphics g);

	/**
	 * Setzt Pixel in einen grafischen Kontext
	 * 
	 * @param x
	 *            X-Koordinate des Punktes
	 * @param y
	 *            Y-Koordniate des Punktes
	 * @param g
	 *            der grafische Kontext in dem das Pixel gesetzt werden soll
	 */
	protected void setPixel(int x, int y, Graphics g) {

		// Ein Viereck zeichnen.
		g.fillRect(x, y, 1, 1);

	}

	/**
	 * Setzt Pixel mit einem anzugebenden Grauwert in einen grafischen Kontext.
	 * Stellt die vorher gesetzte Farbe wieder her (seiteneffektfrei).
	 * 
	 * @param x
	 *            X-Koordinate
	 * @param y
	 *            Y-Koordinate
	 * @param brightness
	 *            Grauwert (zwischen 0.0 (schwarz) und 1.0 (weiß))
	 * @param g
	 *            grafischer Kontext mit dem gezeichnet werden soll
	 */
	protected void setPixel(int x, int y, float brightness, Graphics g) {

		if (brightness < 0.0f || brightness > 1.0f)
			throw new IllegalArgumentException(
					"Grauwert muss zwischen 0.0 und 1.0 liegen.");

		Color c = g.getColor();
		Color newcolor = new Color(brightness, brightness, brightness);
		g.setColor(newcolor);
		setPixel(x, y, g);
		g.setColor(c);
	}

}
