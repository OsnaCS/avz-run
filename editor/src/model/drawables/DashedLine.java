/**
 * 
 */
package model.drawables;

import java.awt.Color;
import java.awt.Graphics;

/**
 * Eine DashedLine ist eine Linie, die im XOR-Modus gestrichelt gezeichnet wird.
 * 
 * @author Nicolas Neubauer
 * 
 */
public class DashedLine extends Line {

	private int steps;

	/**
	 * @see Line
	 */
	public DashedLine(int xa, int ya, int xe, int ye) {
		super(xa, ya, xe, ye);
		steps = 0;
	}

	/**
	 * @see Line
	 */
	public DashedLine(Point a, Point e) {
		super(a, e);
		steps = 0;
	}

	/**
	 * Setzt nur jedes drittel Pixel im XOR-Modus
	 */
	protected void setPixel(int x, int y, Graphics g) {

		if (((steps++ / 3) % 2) == 0) {
			g.setXORMode(Color.WHITE);
			super.setPixel(x, y, g);
			g.setPaintMode();
		}
	}

}
