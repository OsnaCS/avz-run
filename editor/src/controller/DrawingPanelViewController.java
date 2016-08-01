package controller;

import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedList;

import javax.swing.DefaultComboBoxModel;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.event.MouseInputListener;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import controller.listener.RoomListener;
import model.drawables.DrawableObject;
import model.drawables.Point;
import model.leveleditor.DashedRoom;
import model.leveleditor.Level;
import model.leveleditor.Room;
import model.leveleditor.Way;
import model.leveleditor.XMLhandler;
import view.DrawingPanelView;

/**
 * Der Controller, der eine DrawingPanelView verwaltet und das dazugehörige
 * Model in Form einer Liste von DrawableObjects. Das Model des Controllers ist
 * hart mit dem der View verbunden. Änderungen werden also direkt in der View
 * passieren. Ggf. muss die View aufgefordert werden sich neu zu zeichnen.
 * 
 * @author Nicolas Neubauer
 * @author Laura Hembrock
 * @author Barbara Butz
 * 
 */
public class DrawingPanelViewController implements DrawableObjectProcessing {

	// View
	private DrawingPanelView drawingPanelView;
	private JFrame frame;
	private int height = 640;
	private int width = 800;

	// Model
	private LinkedList<DrawableObject> drawableObjectsModel;
	private DrawableObject temporaryObject;

	// Dateiname
	private String filename;

	// Alle Räume, die im Level vorhanden sind
	LinkedList<Room> allRooms = new LinkedList<Room>();
	LinkedList<Way> allWays = new LinkedList<Way>();

	// Speichert XML-Dateien
	XMLhandler handler = new XMLhandler("xml_map_editor.xml");

	private RoomListener roomListener;

	Level aktLevel;
	LinkedList<Level> levels;

	DrawingPanelViewController controller = this;

	/**
	 * Der Konstruktor initialisiert die View und legt die Listener an.
	 */
	public DrawingPanelViewController(String filename, JFrame frame) {

		this.filename = filename;
		
		levels = new LinkedList<Level>();
		aktLevel = null;

		drawableObjectsModel = new LinkedList<DrawableObject>();
		try {
			this.drawableObjectsModel.add(handler.createRoomFromXML("center"));
		} catch (FileNotFoundException e2) {
			e2.printStackTrace();
		}
		drawingPanelView = new DrawingPanelView(width, height, drawableObjectsModel);

		this.roomListener = null;

		this.drawingPanelView.addMouseListener(roomListener);

		// das UI anpassen
		drawingPanelView.getButton().setText("Clear");

		// ComboBox befüllen
		String[] box = { "Einzelflur", "Doppelflur", "Toilettenflur", "Vorlesungsraum", "Büro" };

		drawingPanelView.getComboBox().setModel(new DefaultComboBoxModel<>(box));

		// Event-Listener für Button
		ActionListener clear = new ActionListener() {
			@Override
			// TODO Files zurücksetzen
			public void actionPerformed(ActionEvent e) {
				// Das Model leeren und die View neu zeichnen
				drawableObjectsModel.clear();
				try {
					drawableObjectsModel.add(handler.createRoomFromXML("center"));
				} catch (FileNotFoundException e2) {
					e2.printStackTrace();
				}
				drawingPanelView.getDrawingPanel().repaint();
				levels = new LinkedList<Level>();
				aktLevel = null;
				allRooms = new LinkedList<Room>();
			}
		};

		// ChangeListener um festzustellen, was gezeichnet werden soll
		ActionListener change = new ActionListener() {
			/**
			 * Hängt den passenden Listener an die Zeichenfläche
			 */
			public void actionPerformed(ActionEvent e) {
				// Hänge das aktuell gewählte Objekt als Listener an die
				// View
				@SuppressWarnings("unchecked")
				JComboBox<String> cb = (JComboBox<String>) e.getSource();

				String selectedRoom = (String) cb.getSelectedItem();

				switch (selectedRoom) {
				case "Büro":
					selectedRoom = "buero";
					break;
				case "Einzelflur":
					selectedRoom = "gang_solo";
					break;
				case "Doppelflur":
					selectedRoom = "circle_walled";
					break;
				case "Toilettenflur":
					selectedRoom = "klogang_solo";
					break;
				case "Vorlesungsraum":
					selectedRoom = "lectureroom1";
					break;
				default:
					System.out.println("in");
					break;
				}

				Room room = null;
				try {
					room = handler.createRoomFromXML(selectedRoom);
				} catch (FileNotFoundException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				RoomListener roomListener = new RoomListener(controller, room, getAktLevel());

				this.changeMouseInputListenerTo(roomListener);

			}

			/**
			 * Convenience-Methode zum umsetzen des aktuellen MouseListeners an
			 * der Zeichenfläche der verwalteten View
			 * 
			 * @param newListener
			 *            der zu setzende Listener, alle anderen werden
			 *            ausgehängt
			 */
			private void changeMouseInputListenerTo(MouseInputListener newListener) {

				// InputListeners
				MouseListener[] currentInputListeners = drawingPanelView.getDrawingPanel().getMouseListeners();

				for (MouseListener curListener : currentInputListeners) {
					drawingPanelView.getDrawingPanel().removeMouseListener(curListener);
				}

				// MotionListeners
				MouseMotionListener[] currentMotionListners = drawingPanelView.getDrawingPanel()
						.getMouseMotionListeners();
				for (MouseMotionListener curListener : currentMotionListners) {
					drawingPanelView.getDrawingPanel().removeMouseMotionListener(curListener);
				}

				drawingPanelView.getDrawingPanel().addMouseListener(newListener);
				drawingPanelView.getDrawingPanel().addMouseMotionListener(newListener);
			}

		};

		/*
		 * ActionListener um XML-File zu speichern. Fenster wird nach dem
		 * Speichern geschlossen und das Programm beendet. Hilfsdateien werden
		 * gelöscht
		 */
		ActionListener save = new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

			}
		};

		// ActionListener um die letzte Aktion rückgängig zu machen
		ActionListener undo = new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

			}
		};

		// Anhängen der Listener
		drawingPanelView.getButton().addActionListener(clear);
		drawingPanelView.getComboBox().addActionListener(change);

		drawingPanelView.getXMLPanel().getSaveButton().addActionListener(save);
		drawingPanelView.getXMLPanel().getUndoButton().addActionListener(undo);

		// Event einmal auslösen, damit der korrekte Listener angehängt wird
		drawingPanelView.getComboBox().setSelectedIndex(0);
	}

	/**
	 * Fügt das DrawableObject in das Model ein und fordert die View zum
	 * Neuzeichnen auf.
	 */
	public void processDrawableObject(DrawableObject drawableObject) {

		drawableObjectsModel.add(drawableObject);
		drawingPanelView.getDrawingPanel().repaint();

	}

	/**
	 * Löscht das temporäre DrawableObject aus dem Model und fordert die View
	 * zum Neuzeichnen auf.
	 */
	public void clearTemporaryDrawableObject() {

		drawableObjectsModel.remove(temporaryObject);
		drawingPanelView.getDrawingPanel().repaint();
		temporaryObject = null;

	}

	@Override
	public void transformDrawableObjectsNear(Point p) {

	}

	/**
	 * Fügt ein temporäres Objekt in das Model ein und fordert die View zum
	 * Neuzeichnen auf. Das Objekt kann mit clearTemporaryDrawableObject wieder
	 * aus dem Model entfernt werden.
	 */
	public void setTemporaryDrawableObject(DrawableObject drawableObject) {

		// Erst löschen
		if (temporaryObject != null) {
			this.clearTemporaryDrawableObject();
		}

		temporaryObject = drawableObject;
		this.processDrawableObject(temporaryObject);

		drawingPanelView.getDrawingPanel().repaint();

		// keine Dashed-Rooms speichern
		if (!(drawableObject instanceof DashedRoom)) {
			this.allRooms.add((Room) drawableObject);
		}
		
		
	}

	/**
	 * Setzt die XML-Anzeige neu
	 */
	public void refreshXML() {

		String text = handler.toXML(aktLevel);
		
		this.drawingPanelView.getXMLPanel().getTextField().setText(text);

	}

	public DrawingPanelView getDrawingPanelView() {
		return drawingPanelView;
	}

	public void setDrawingPanelView(DrawingPanelView drawingPanelView) {
		this.drawingPanelView = drawingPanelView;
	}

	public JFrame getFrame() {
		return frame;
	}

	public void setFrame(JFrame frame) {
		this.frame = frame;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public LinkedList<DrawableObject> getDrawableObjectsModel() {
		return drawableObjectsModel;
	}

	public void setDrawableObjectsModel(LinkedList<DrawableObject> drawableObjectsModel) {
		this.drawableObjectsModel = drawableObjectsModel;
	}

	public DrawableObject getTemporaryObject() {
		return temporaryObject;
	}

	public void setTemporaryObject(DrawableObject temporaryObject) {
		this.temporaryObject = temporaryObject;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public LinkedList<Room> getRoomlist() {
		return allRooms;
	}

	public void setRoomlist(LinkedList<Room> roomlist) {
		this.allRooms = roomlist;
	}

	public XMLhandler getHandler() {
		return handler;
	}

	public void setHandler(XMLhandler handler) {
		this.handler = handler;
	}

	public RoomListener getRoomListener() {
		return roomListener;
	}

	public void setRoomListener(RoomListener roomListener) {
		this.roomListener = roomListener;
	}

	public Level getAktLevel() {
		return aktLevel;
	}

	public void setAktLevel(Level aktLevel) {
		this.aktLevel = aktLevel;
	}

	public DrawingPanelViewController getController() {
		return controller;
	}

	public void setController(DrawingPanelViewController controller) {
		this.controller = controller;
	}

}