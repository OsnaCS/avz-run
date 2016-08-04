package controller.listener;

import controller.DrawableObjectProcessing;
import controller.DrawingPanelViewController;
import model.drawables.Point;
import model.leveleditor.Coordinates;
import model.leveleditor.Level;
import model.leveleditor.Room;
import model.leveleditor.Way;

import javax.swing.event.MouseInputAdapter;
import java.awt.event.MouseEvent;
import java.io.FileNotFoundException;

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
    final Room templateRoom;
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
		this.templateRoom = room;

        this.room = new Room(templateRoom);
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
			room = new Room(templateRoom);
		} else {

            //
            //System.out.println("Stopp");
			// Reaction for leftmouseclick
			if (isLeftMouseButton(e)) {
				
				// Compare ways with all not checked or cleared Level-ways
				if (room.compareWays(level.getWays())) {

				    // Add room
					level.addRoom(room);
					//delegate.clearTemporaryDrawableObject();
					//delegate.processDrawableObject(thisroom);
                    delegate.processDrawableObject(room);
					mousePos = null;

					this.delegate.refreshXML();
                   // this.room.getCenter().setAngle(0);
                   // this.room.getcE().setAngle(0);
                   // this.room.getcA().setAngle(0);


                    try {
                        this.room = delegate.getHandler().createRoomFromXML(this.room.getName());
                    } catch (FileNotFoundException e1) {
                        e1.printStackTrace();
                    }
                }
				// Reaction of rightclick
			} else if (isRightMouseButton(e)) {
				// Rotate Room
                room.rotate();
                for(Way way: room.getWaylist()){
                	way.calcNormal(90);
                }
               
                //System.out.println("Stopp");

				delegate.setTemporaryDrawableObject(room);

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
		if (mousePos == null) {
			
			// Set MousePos
			//mousePos = new Point(e.getX(), e.getY());
			//room.setCenter(mousePos);
		} else {
			mousePos = new Point(e.getX(), e.getY());
            // Set center
			
            room.moveCenter(mousePos, room.getCenter().getAngle());
			//DashedRoom r = new DashedRoom(this.room, mousePos);
			// Temporäres Objekt neu zeichnen
			delegate.setTemporaryDrawableObject(room);
			//mousePos = null;
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
        room = null;
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
	
	public String toString() {
		return this.room.getName();
	}

}
