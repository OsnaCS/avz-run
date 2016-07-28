package view;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.util.LinkedList;

import javax.swing.JPanel;

import model.drawables.DrawableObject;

/**
 * Ein DrawingPanel ist eine weiße Zeichenfläche, die drawableObjects verwaltet
 * und diese auf sich selbst zeichnet.
 * 
 * @author Nicolas Neubauer
 * 
 */
@SuppressWarnings("serial")
public class DrawingPanel extends JPanel {

	private LinkedList<DrawableObject> drawableObjects;

	/**
	 * Konstruktor, der die bevorzugte Größe und ein Model erwartet
	 * 
	 * @param width
	 * @param height
	 * @param drawableObjectsModel
	 */
	public DrawingPanel(int width, int height,
			LinkedList<DrawableObject> drawableObjectsModel) {

		super();

		if (width <= 0 || height <= 0)
			throw new IllegalArgumentException(
					"Groesse muss >= 1x1 Pixel sein.");

		// Mache das Panel mit dem Model bekannt
		drawableObjects = drawableObjectsModel;

		// Setze die bevorzugte Größe
		Dimension d = new Dimension(width, height);
		setPreferredSize(d);

		// Setze die Farben
		setForeground(Color.BLACK);
		setBackground(Color.WHITE);

	}

	/**
	 * Zeichne alle DrawableObjects aus dem Model auf die Zeichenfläche.
	 */
	public void paint(Graphics g) {
		super.paint(g);

		for (DrawableObject d : drawableObjects) {
			d.paint(g);
		}
	}

}
