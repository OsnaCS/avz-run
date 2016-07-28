package controller.listener;

import java.awt.event.MouseEvent;

import javax.swing.event.MouseInputAdapter;

import model.drawables.Point;
import controller.DrawableObjectProcessing;

/**
 * Listener, der Punkte aufnimmt, um Transformationen zu initiieren.
 * 
 * @author Nicolas Neubauer
 * 
 */
public class TransformListener extends MouseInputAdapter {

	private DrawableObjectProcessing delegate;

	/**
	 * Erzeugt einen neuen Transform-Listener
	 * 
	 * @param delegate
	 *            das Delegate
	 */
	public TransformListener(DrawableObjectProcessing delegate) {
		this.delegate = delegate;
	}

	/**
	 * Erzeuge einen neuen Point bei den Klick-Koordinaten und übergebe ihn an
	 * das Delegate.
	 */
	public void mouseClicked(MouseEvent e) {
		Point p = new Point(e.getX(), e.getY());
		delegate.transformDrawableObjectsNear(p);
	}
	
	public String toString() {
		return "Polygon-Transformation";
	}
}
