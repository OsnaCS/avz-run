package controller.listener;

import java.awt.event.MouseEvent;
import javax.swing.event.MouseInputAdapter;
import model.drawables.Point;
import controller.DrawableObjectProcessing;

/**
 * Ein Listener, der Points durch MouseEvents erzeugt und an ein Objekt, das
 * DrawableObjectProcessing implementiert übergibt.
 * 
 * @author Nicolas Neubauer
 * 
 */
public class PointListener extends MouseInputAdapter {

	private DrawableObjectProcessing delegate;

	public PointListener(DrawableObjectProcessing delegate) {
		this.delegate = delegate;
	}

	/**
	 * Erzeuge einen neuen Point bei den Klick-Koordinaten und übergebe ihn an
	 * das Delegate.
	 */
	public void mouseClicked(MouseEvent e) {
		Point p = new Point(e.getX(), e.getY());
		delegate.processDrawableObject(p);
		System.out.println("Point @ " + p);
	}
	
	public String toString() {
		return "Punkt";
	}

}
