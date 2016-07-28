package model.drawables;

import java.awt.Graphics;

/**
 * Repräsentiert ein Rectangle, das gestrichelt und im XOR-Modus gezeichnet
 * wird.
 * 
 * @author Nicolas Neubauer
 * 
 */
public class DashedRectangle extends Rectangle {

	/**
	 * @see Rectangle
	 */
	public DashedRectangle(int xa, int ya, int xe, int ye) {
		super(xa, ya, xe, ye);
	}

	/**
	 * @see Rectangle
	 */
	public DashedRectangle(Point a, Point e) {
		super(a, e);
	}

	/**
	 * Zeichnet das Rechteck in einen grafischen Kontext (mit DashedLines)
	 * 
	 * @param g
	 *            der grafische Kontext in den das Rechteck gezeichnet wird
	 */
	public void paint(Graphics g) {
		Point ur = new Point(e.x, a.y);
		Point ll = new Point(a.x, e.y);
		// Zeichnen im Uhrzeigersinn ul -> ur -> lr -> ll -> ul
		new DashedLine(a, ur).paint(g);
		new DashedLine(ur, e).paint(g);
		new DashedLine(e, ll).paint(g);
		new DashedLine(ll, a).paint(g);
	}

}
