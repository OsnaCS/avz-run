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
 * Created by Thomas Dautzenberg on 27/07/2016.
 */
public class RoomListener extends MouseInputAdapter{

	private Point mousePos;
	private DrawableObjectProcessing delegate;
	private Level level;
	private Room room;

	public RoomListener(DrawableObjectProcessing delegate, Room room, Level level) {
		this.delegate = delegate;
		this.level = level;
		this.room = room;
	}

	//TODO Kommentare updaten
	/**
	 * Merke die aktuelle Koordinate des Startpunktes oder, sofern schon
	 * vorhanden, erzeuge mit Hilfe des neuen (End-)punkts ein neues Rectangle
	 * und übergebe es dem Delegate.
	 */
	public void mouseClicked(MouseEvent e) {

		if (mousePos == null){
			mousePos = new Point(e.getX(), e.getY());
			room.setCenter(mousePos);
			//TODO Delegate setzen (nice to have)
		} else {

			if (isLeftMouseButton(e)) {
				if(room.compareWays(level.getWays())) {
					level.addRoom(room);
					level.setWays(room.getWaylist());
					delegate.clearTemporaryDrawableObject();
					delegate.processDrawableObject(room);
				}

			} else if (isRightMouseButton(e)) {
				room.rotate();
				//TODO Delegate setzen (nice to have)
			}
		}


	}

	/**
	 * Übergebe mit Hilfe der aktuellen Mausposition ein DashedRectangle als
	 * temporäres Objekt an das Delegate, sofern bereits ein Mittelpunkt
	 * vorliegt.
	 */
	public void mouseMoved(MouseEvent e) {
		if (mousePos != null) {
			mousePos = new Point(e.getX(), e.getY());
			room.setCenter(mousePos);
			//TODO Delegate setzen (nice to have)
		}
	}

	public void mouseExited(MouseEvent e) {
		delegate.clearTemporaryDrawableObject();
		mousePos = null;
	}


}
