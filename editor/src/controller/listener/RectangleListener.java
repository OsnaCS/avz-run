/**
 * 
 */
package controller.listener;

import java.awt.event.MouseEvent;

import javax.swing.event.MouseInputAdapter;

import controller.DrawableObjectProcessing;

import model.drawables.DashedRectangle;
import model.drawables.Point;
import model.drawables.Rectangle;

/**
 * 
 * Ein Listener, der Rectangles durch MouseEvents erzeugt und an ein Objekt, das
 * DrawableObjectProcessing implementiert übergibt.
 * 
 * @author Nicolas Neubauer
 * 
 */
public class RectangleListener extends MouseInputAdapter {

	private Point tmp;
	private DrawableObjectProcessing delegate;

	public RectangleListener(DrawableObjectProcessing delegate) {
		this.delegate = delegate;
	}

	/**
	 * Merke die aktuelle Koordinate des Startpunktes oder, sofern schon
	 * vorhanden, erzeuge mit Hilfe des neuen (End-)punkts ein neues Rectangle
	 * und übergebe es dem Delegate.
	 */
	public void mouseClicked(MouseEvent e) {

		if (tmp == null)
			tmp = new Point(e.getX(), e.getY());
		else {

			// Lösche temporäres Object
			delegate.clearTemporaryDrawableObject();

			Rectangle r = new Rectangle(tmp, new Point(e.getX(), e.getY()));
			tmp = null;
			delegate.processDrawableObject(r);
		}

	}

	/**
	 * Übergebe mit Hilfe der aktuellen Mausposition ein DashedRectangle als
	 * temporäres Objekt an das Delegate, sofern bereits ein Mittelpunkt
	 * vorliegt.
	 */
	public void mouseMoved(MouseEvent e) {
		if (tmp != null) {
			DashedRectangle r = new DashedRectangle(tmp, new Point(e.getX(), e
					.getY()));
			// Temporäres Objekt neu zeichnen
			delegate.setTemporaryDrawableObject(r);
		}
	}

	public String toString() {
		return "Rechteck";
	}
}
