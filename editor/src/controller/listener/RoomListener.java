package controller.listener;

import controller.DrawableObjectProcessing;
import model.drawables.DashedRectangle;
import model.drawables.Point;
import model.drawables.Rectangle;
import model.leveleditor.DashedRoom;
import model.leveleditor.Level;
import model.leveleditor.Room;
import model.leveleditor.Way;

import javax.swing.*;
import javax.swing.event.MouseInputAdapter;
import java.awt.event.MouseEvent;

import java.util.LinkedList;

import static javax.swing.SwingUtilities.isLeftMouseButton;
import static javax.swing.SwingUtilities.isRightMouseButton;

/**
 * Created by Thomas Dautzenberg on 27/07/2016. Modified by Andreas Schroeder
 * 
 * Listener for the Rooms
 */
public class RoomListener extends MouseInputAdapter {

	private Point mousePos;
	private DrawableObjectProcessing delegate;
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
		this.delegate = delegate;
		this.level = level;
		this.room = room;
	}

	/**
	 * Methode to Handle mouseclicks
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
	 * Handle Reaction if Mouse is Moved
	 * 
	 * @param e	The Event
	 */
	public void mouseMoved(MouseEvent e) {
		// If mousePos was'nt set yet
		if (mousePos != null) {
			// Set MousePos
			mousePos = new Point(e.getX(), e.getY());
			// Set center
			room.setCenter(mousePos);
			// TODO Delegate setzen (nice to have)
		}
	}

	/**
	 * Handles Reaction if mouse is exited
	 * 
	 * @param e The MouseEvent
	 */
	public void mouseExited(MouseEvent e) {
		delegate.clearTemporaryDrawableObject();
		mousePos = null;
	}

	/**
	 * Getter for Level
	 * @return returns the level
	 */
	public Level getLevel() {
		return this.level;
	}

	/**
	 * Sets new Levvel
	 * @param level new Level
	 */
	public void setLevel(Level level) {
		this.level = level;
	}

}
