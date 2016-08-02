package controller;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.io.FileNotFoundException;
import java.util.LinkedList;

import javax.swing.DefaultComboBoxModel;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.event.MouseInputListener;

import controller.listener.RoomListener;
import model.drawables.DrawableObject;
import model.drawables.Point;
import model.leveleditor.Coordinates;
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

	// Speichert XML-Dateien
	private XMLhandler handler = new XMLhandler("xml_map_editor.xml");

	// der aktuelle Roomlistener
	private RoomListener roomListener;

	// Level
	private Level aktLevel;
	private LinkedList<Level> levels;

	// Contoller
	private DrawingPanelViewController controller = this;

	/**
	 * Der Konstruktor initialisiert die View und legt die Listener an.
	 */
	public DrawingPanelViewController(String filename, JFrame frame) {

		// Filename für das File zum speichern setzen
		this.filename = filename;

		// Mittelgang hinzufügen
		Room temp = null;
		try {
			temp = handler.createRoomFromXML("center");
		} catch (FileNotFoundException e3) {
			e3.printStackTrace();
		}
		temp.setCenter(new Coordinates(width/2, height/2));

		// aktuelles Level setzen und in Liste speichern
		this.aktLevel = new Level();
		this.aktLevel.addRoom(temp);
		this.aktLevel.setWays(temp.getWaylist());
		
		levels = new LinkedList<Level>();
		levels.add(aktLevel);
		
		// Zeichenfläche initialisieren und Mittelgang hinzufügen
		drawableObjectsModel = new LinkedList<DrawableObject>();
		this.drawableObjectsModel.add(temp);
		
		drawingPanelView = new DrawingPanelView(width, height, drawableObjectsModel);

		// aktuellen Roomlistner erstellen und anhängen
		this.aktLevel = new Level();
		this.aktLevel.addRoom(temp);
		for (int i =0; i <temp.getWaylist().size();i++){
			this.aktLevel.addWay(temp.getWaylist().get(i));
		}
		this.roomListener = null;
		//this.roomListener = new RoomListener(this, temp, this.aktLevel);
		this.drawingPanelView.addMouseListener(roomListener);
		

		// ComboBox befüllen
		String[] box = { "Einzelflur", "Doppelflur", "Toilettenflur", "Vorlesungsraum", "Büro" };
		drawingPanelView.getComboBox().setModel(new DefaultComboBoxModel<>(box));
		
		// XML-Anzeige setzen
		refreshXML();

		// das UI anpassen
		drawingPanelView.getButton().setText("Clear");

		// Event-Listener für Button
		ActionListener clear = new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				
				// Das Model leeren und die View neu zeichnen
				drawableObjectsModel.clear();
				
				// Mittelgang wieder in die Mitte zeichnen
				Room temp = null;
				try {
					temp = handler.createRoomFromXML("center");
				} catch (FileNotFoundException e3) {
					e3.printStackTrace();
				}
				temp.setCenter(new Coordinates(width/2, height/2));
				drawableObjectsModel.add(temp);
				drawingPanelView.getDrawingPanel().repaint();
				levels = new LinkedList<Level>();
				
				// Mittelgang zum Level hinzufügen und Listen updaten
				aktLevel = new Level();
				aktLevel.addRoom(temp);
				aktLevel.setWays(temp.getWaylist());
				
				// XML-Anzeige neu laden
				refreshXML();
//				System.out.println("Clear");
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

				// Den ausgewählten Raum aus der XML laden
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
					e1.printStackTrace();
				}

				// Für den neuen Raum einen neuen Listener erstellen und anhängen
				RoomListener roomListener = new RoomListener(controller, room, getAktLevel());
				this.changeMouseInputListenerTo(roomListener);
				setRoomListener(roomListener);

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
				
				handler.writeXML(aktLevel, getFilename());
				
			}
		};

		// ActionListener um die letzte Aktion rückgängig zu machen
		ActionListener undo = new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				
				levels.removeLast();
				aktLevel = levels.getLast();
				refreshXML();

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

	/**
	 * Fügt ein temporäres Objekt in das Model ein und fordert die View zum
	 * Neuzeichnen auf. Das Objekt kann mit clearTemporaryDrawableObject wieder
	 * aus dem Model entfernt werden.
	 */
	public void setTemporaryDrawableObject(DrawableObject drawableObject) {

		// Erst löschen
		if (temporaryObject != null)
			this.clearTemporaryDrawableObject();

		temporaryObject = drawableObject;
		this.processDrawableObject(temporaryObject);

	}

	@Override
	public void transformDrawableObjectsNear(Point p) {
	}

	/**
	 * Setzt die XML-Anzeige neu
	 */
	public void refreshXML() {

		String text = handler.toXML(aktLevel);

		this.drawingPanelView.getXMLPanel().getTextField().setText(text);

	}
	
	/********************************************************/
	/********************************************************/
	/********************Getter & Setter*********************/
	/********************************************************/
	/********************************************************/

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

	public LinkedList<Level> getLevels() {
		return levels;
	}

	public void setLevels(LinkedList<Level> levels) {
		this.levels = levels;
	}

	public DrawingPanelViewController getController() {
		return controller;
	}

	public void setController(DrawingPanelViewController controller) {
		this.controller = controller;
	}

}