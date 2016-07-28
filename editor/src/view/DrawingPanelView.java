package view;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.util.LinkedList;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JPanel;
import javax.swing.event.MouseInputAdapter;

import model.drawables.DrawableObject;

/**
 * Eine DrawingPanelView besteht aus einem großen DrawingPanel sowie darunter
 * einer ComboBox und einem Button. Sie ist beliebig skalierbar.
 * 
 * @author Nicolas Neubauer
 * 
 */
@SuppressWarnings("serial")
public class DrawingPanelView extends JPanel {

	// View-Components
	public  DrawingPanel drawingPanel;
	private XMLPanel xmlPanel;
	private JComboBox<MouseInputAdapter> comboBox;
	private JButton button;

	/**
	 * Konstruktor, der eine neue View anlegt.
	 * 
	 * @param preferedWidthOfDrawingPanel
	 * @param preferedHeightOfDrawingPanel
	 * @param drawableObjectsModel
	 *            das Model, das an das DrawingPanel übergeben wird
	 */

	public DrawingPanelView(int preferedWidthOfDrawingPanel,
			int preferedHeightOfDrawingPanel,
			LinkedList<DrawableObject> drawableObjectsModel) {

		if (preferedWidthOfDrawingPanel < 1 || preferedHeightOfDrawingPanel < 1)
			throw new IllegalArgumentException(
					"Groesse des DrawingPanels muss 1x1 oder groesser sein.");

		this.setLayout(new BorderLayout());

		JPanel leftPanel = new JPanel();
		leftPanel.setLayout(new BorderLayout());
		
		// Besorge ein DrawingPanel und propagiere das entsprechende Model
		drawingPanel = new DrawingPanel(preferedWidthOfDrawingPanel,
				preferedHeightOfDrawingPanel, drawableObjectsModel);
		leftPanel.add(drawingPanel, BorderLayout.CENTER);

		// Menüleiste in ein neues JPanel legen
		JPanel menu = new JPanel(new GridLayout(1, 0));
		leftPanel.add(menu, BorderLayout.SOUTH);

		// Erzeuge Auswahlliste
		comboBox = new JComboBox<>();
		comboBox.setMaximumRowCount(11);
		menu.add(comboBox);

		// Erzeuge Button
		button = new JButton();
		menu.add(button);
		
		//Fuege Linkes Panel hinzu
		this.add(leftPanel,BorderLayout.CENTER);

		//Erzeuge XMLPanel
		xmlPanel = new XMLPanel();
		xmlPanel.setBorder(BorderFactory.createEmptyBorder(0, 5, 0, 5));
		this.add(xmlPanel, BorderLayout.EAST);

	}

	/**
	 * @return the drawingPanel
	 */
	public DrawingPanel getDrawingPanel() {
		return drawingPanel;
	}

	/**
	 * @return the comboBox
	 */
	public JComboBox<MouseInputAdapter> getComboBox() {
		return comboBox;
	}

	/**
	 * @return the button
	 */
	public JButton getButton() {
		return button;
	}

	/**
	 *
	 * @return the xmlPanel
     */
	public XMLPanel getXMLPanel() {
		return xmlPanel;
	}

}