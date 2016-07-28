/**
 * 
 */
package controller.listener;

import java.awt.event.MouseEvent;

import javax.swing.event.MouseInputAdapter;

import controller.DrawableObjectProcessing;

import model.drawables.DashedLine;
import model.drawables.DrawableObject;
import model.drawables.Line;
import model.drawables.AntiAliasedLine;
import model.drawables.Point;

/**
 * Ein Listener, der Lines durch MouseEvents erzeugt und an ein Objekt, das
 * DrawableObjectProcessing implementiert übergibt.
 * 
 * @author Nicolas Neubauer
 * 
 */
public class LineListener extends MouseInputAdapter {

	private Point start;   // erster Klick
	private DrawableObjectProcessing delegate;
	private boolean antiAliased;

	public LineListener(DrawableObjectProcessing delegate, boolean antiAliased) {
		this.delegate = delegate;
		this.antiAliased = antiAliased;
	}

	/**
	 * Merke die aktuelle Koordinate des Startpunktes oder, sofern schon
	 * vorhanden, erzeuge mit Hilfe des neuen (End-)punkts eine neue Line und
	 * übergebe sie dem Delegate.
	 */
	public void mouseClicked(MouseEvent e) {
		// Falls dies der erste Klick ist
		if (start == null) {
			start = new Point(e.getX(), e.getY());
		}
		// ... sonst Linie finalisieren
		else {
			// Lösche temporäres Object
			delegate.clearTemporaryDrawableObject();

			// Linie hinzufügen und zeichnen lassen
			Point end = new Point(e.getX(), e.getY());
			DrawableObject obj;
			if (!antiAliased) {
				obj = new Line(start, end);
			} else {
				obj = new AntiAliasedLine(start, end);
			}
			delegate.processDrawableObject(obj);
			start = null;
		}
	}

	/**
	 * Übergebe mit Hilfe der aktuellen Mausposition eine DashedLine als
	 * temporäres Objekt an das Delegate, sofern bereits ein Mittelpunkt
	 * vorliegt.
	 */
	public void mouseMoved(MouseEvent e) {
		if (start != null) {
			Point end = new Point(e.getX(), e.getY());
			DashedLine l = new DashedLine(start, end);
			// Temporäres Objekt neu zeichnen
			delegate.setTemporaryDrawableObject(l);
		}
	}

	public String toString() {
		if (antiAliased) {
			return "Linie (AntiAliased)";
		} else {
			return "Linie";
		}
	}
	
}
