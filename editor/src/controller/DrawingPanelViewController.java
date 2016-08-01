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
	private int height= 640;
	private int width= 800;


	// Model
	private LinkedList<DrawableObject> drawableObjectsModel;
	private DrawableObject temporaryObject;

	// Dateiname
	private String filename;

	// Alle Räume, die im Level vorhanden sind
	private LinkedList<Room> roomlist = new LinkedList<Room>();

	// Speichert XML-Dateien
	XMLhandler handler = new XMLhandler();
	
	private RoomListener roomListener;
	
	private Level aktLevel;
	
	DrawingPanelViewController controller = this;

	/**
	 * Der Konstruktor initialisiert die View und legt die Listener an.
	 */
	public DrawingPanelViewController(String filename, JFrame frame) {

		this.filename = filename;


		drawableObjectsModel = new LinkedList<DrawableObject>();
		drawingPanelView = new DrawingPanelView(width, height, drawableObjectsModel);
		
		this.roomListener = new RoomListener(this);

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
				drawingPanelView.getDrawingPanel().repaint();
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

				Room room =  handler.createRoomFromXML(selectedRoom);

				LinkedList<Way> allways = getRoomListener().getAllways();

				RoomListener roomListener = new RoomListener(controller, room, allways);

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

				// letzen Schritt rückgängig machen
				File f = undoFiles();

				// XML-Anzeige neu laden
				refreshXML(f);
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

		// keine Dashed-Rooms speichern
		if (!(drawableObject instanceof DashedRoom)) {
			this.roomlist.add((Room) drawableObject);

			// Hilfsfile anlegen
			File newFile = null;
			try {
				String s = "roomTemp" + i + ".xml";
				newFile = handler.writeXML(roomlist, s);
				i++;
				speicher.add(newFile);
			} catch (ParserConfigurationException | TransformerException e) {
				e.printStackTrace();
			}

			// aktuelles File neu setzen
			this.oldFiles = this.aktFile;
			this.aktFile = newFile;

			// XML-Anzeige neu laden
			refreshXML(this.aktFile);

		}

	}

	/**
	 * Löscht das temporäre DrawableObject aus dem Model und fordert die View
	 * zum Neuzeichnen auf.
	 */
	public void clearTemporaryDrawableObject() {

		drawableObjectsModel.remove(temporaryObject);
		drawingPanelView.getDrawingPanel().repaint();
		temporaryObject = null;

		if (!speicher.isEmpty()) {
			speicher.removeLast();
		}

		String s = "roomTemp" + i + ".xml";

		File help = new File(s);
		if (help.exists()) {
			help.delete();
		}

		if (i > 0) {
			i--;
		}

		try {
			this.aktFile.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}

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
			this.roomlist.add((Room) drawableObject);

			// Hilfsfile anlegen
			File newFile = null;
			try {
				String s = "roomTemp" + i + ".xml";
				newFile = handler.writeXML(roomlist, s);
				i++;
				speicher.add(newFile);
			} catch (ParserConfigurationException | TransformerException e) {
				e.printStackTrace();
			}

			// aktuelles File neu setzen
			this.oldFiles = this.aktFile;
			this.aktFile = newFile;

			// XML-Anzeige neu laden
			refreshXML(this.aktFile);
		}
	}

	/**
	 * Setzt die XML-Anzeige neu
	 * 
	 * @param f
	 *            aktuelles File, das in der Anzeige angezeigt wird
	 */
	public void refreshXML(File f) {

		// Aus XML-Datei auslesen
		StringBuilder temp = new StringBuilder();
		String zeile = null;
		BufferedReader in = null;
		try {
			in = new BufferedReader(new FileReader(f));
			while ((zeile = in.readLine()) != null) {
				temp.append(zeile);
				temp.append(System.lineSeparator());
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		// Textfeld neu setzen
		this.drawingPanelView.getXMLPanel().getTextField().setText(temp.toString());

	}

}