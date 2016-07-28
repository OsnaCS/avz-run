package controller;

import model.drawables.DrawableObject;
import model.drawables.Point;

/**
 * 
 * Ein Interface, dass das Verarbeiten von DrawableObjects vorschreibt.
 * 
 * @author Nicolas Neubauer
 * 
 */
public interface DrawableObjectProcessing {

	/**
	 * Veranlasst das (permanente) verarbeiten eines DrawableObjects.
	 * Beispielsweise das Einfügen in ein lokales Model.
	 * 
	 * @param drawableObject
	 *            das zu verarbeitende Objekt
	 */
	public void processDrawableObject(DrawableObject drawableObject);

	/**
	 * Setzt ein temporäres DrawableObject. Beispielsweise zur
	 * Benutzerunterstützung.
	 * 
	 * @param drawableObject
	 *            das temporäre Objekt
	 */
	public void setTemporaryDrawableObject(DrawableObject drawableObject);

	/**
	 * Löscht das derzeit gesetzte temporäre DrawableObject. Ignoriere
	 * eventuelle Fehler durch nicht vorhandenes temporäres Objekt.
	 */
	public void clearTemporaryDrawableObject();

	/**
	 * Transformiert alle transformierberen DrawableObjects die in der Nähe des
	 * übergebenen Punkts p liegen.
	 * 
	 * @param p
	 *            der Punkt in dessen Nähe die Objekte liegen müssen, um
	 *            transformiert zu werden
	 */
	public void transformDrawableObjectsNear(Point p);

}
