package controller.listener;

import controller.DrawableObjectProcessing;
import controller.DrawingPanelViewController;
import model.drawables.Point;
import model.leveleditor.DashedRoom;
import model.leveleditor.Level;
import model.leveleditor.Room;

import javax.swing.event.MouseInputAdapter;
import java.awt.event.MouseEvent;

import static javax.swing.SwingUtilities.isLeftMouseButton;
import static javax.swing.SwingUtilities.isRightMouseButton;

/**
 * Created by Thomas Dautzenberg on 27/07/2016. Modified by Andreas Schroeder
 * 
 * Listener for the Rooms
 */
public class RoomListener extends MouseInputAdapter {

	private Point mousePos;
	private DrawingPanelViewController delegate;
	private Level level;
	private Room room;

	/**
	 * Constructor
	 * 
	 * @param delegate
	 *            The DrawableObjectProcessing of this Listener
	 * @param room
	 *            The Room, to listen
	 * @param level
	 *            The Level, which containts the room
	 */
	public RoomListener(DrawableObjectProcessing delegate, Room room, Level level) {
		this.delegate = (DrawingPanelViewController) delegate;
		this.level = level;
		this.room = room;
	}

	/**
	 * Methode to Handle mouseclicks shows room around Mouseposition. Rotates
	 * Room if already showed
	 * 
	 * @param e
	 *            The Mouseevent, which trigger actions
	 */
	public void mouseClicked(MouseEvent e) {

		// If MousePos isn't set yet
		if (mousePos == null) {
			// Create new MousePos
			mousePos = new Point(e.getX(), e.getY());

			// Sets the new center from the room
			room.setCenter(mousePos);
		} else {

			// Reaction for leftmouseclick
			if (isLeftMouseButton(e)) {
				// Compate ways with all not checked or cleared Level-ways
				if (room.compareWays(level.getWays())) {
					// Add room
					level.addRoom(room);
					level.setWays(room.getWaylist());
					delegate.clearTemporaryDrawableObject();
					delegate.processDrawableObject(room);
					this.delegate.refreshXML();
				}
				// Reaction of rightclick
			} else if (isRightMouseButton(e)) {
				// Rotate Room
				room.rotate();
				// TODO Delegate setzen (nice to have)
			}


		}
	}

	/**
	 * 
	 * Updated Center vom angefassten Raum.
	 *
	 * Übergebe mit Hilfe der aktuellen Mausposition ein DashedRectangle als
	 * temporäres Objekt an das Delegate, sofern bereits ein Mittelpunkt
	 * vorliegt.
	 * 
	 * @param e
	 *            The Event
	 */
	public void mouseMoved(MouseEvent e) {
		// If mousePos was'nt set yet
		if (mousePos != null) {
			// Set MousePos
			mousePos = new Point(e.getX(), e.getY());
			// Set center
			room.setCenter(mousePos);
			// TODO Delegate setzen (nice to have)

			DashedRoom r = new DashedRoom(this.room, mousePos);
			// Temporäres Objekt neu zeichnen
			delegate.setTemporaryDrawableObject(r);

		}
	}

	/**
	 * reset. yeah. megareset. uh. ultrareset. ja also alles auf anfang.
	 * 
	 * @param e
	 *            The MouseEvent
	 */
	public void mouseExited(MouseEvent e) {
		delegate.clearTemporaryDrawableObject();
		mousePos = null;
	}

	/**
	 * Getter for Level
	 * 
	 * @return returns the level
	 */
	public Level getLevel() {
		return this.level;
	}

	/**
	 * Sets new Levvel
	 * 
	 * @param level
	 *            new Level
	 */
	public void setLevel(Level level) {
		this.level = level;
	}

}
