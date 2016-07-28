package controller.listener;

import controller.DrawableObjectProcessing;
import model.Way;
import model.drawables.DashedRoom;
import model.drawables.Point;
import model.drawables.Room;

import javax.swing.*;
import java.awt.event.MouseEvent;

/**
 * Created by Thomas Dautzenberg on 27/07/2016.
 */
public class RoomListener extends RectangleListener {

    private Point tmp;
    private DrawableObjectProcessing delegate;
    private Room room;
    private Room templateRoom;
    private Way[] allways;

    public Way[] getAllways() {
        return allways;
    }

    public void setAllways(Way[] allways) {
        this.allways = allways;
    }

    public RoomListener(DrawableObjectProcessing delegate, Room room, Way[] allways) {
        super(delegate);
        this.delegate=delegate;
        this.templateRoom=room;
        this.allways = allways;
    }

    public void mouseClicked(MouseEvent e){

        if (tmp == null){
            tmp = new Point(e.getX(), e.getY());
            room = new Room(templateRoom);
            room.setCenter(tmp);
        } else {
            if (SwingUtilities.isRightMouseButton(e)){
                room.spin();
                updateDelegate(
                        new Point (e.getX()+room.getA().x, e.getY()+room.getA().y),
                        new Point (e.getX()+room.getE().x, e.getY()+room.getE().y));
            }else if (SwingUtilities.isLeftMouseButton(e)) {
                if (room.checkMerge(allways)) {
                    delegate.processDrawableObject(room);
                    tmp = null;
                }
            }
        }
    }

    //if mouse moves, rectangle moves with it
    public void mouseMoved(MouseEvent e) {

        if (tmp==null){

        }else{
            tmp = new Point(e.getX(), e.getY());

            //determines position of rectangle with position of cursor and length of rectangle sides
            updateDelegate(
                    new Point (e.getX()+room.getA().x, e.getY()+room.getA().y),
                    new Point (e.getX()+room.getE().x, e.getY()+room.getE().y));
        }
    }

    @Override
    public String toString() {
        return "Raum";
    }


    //zeichnet das gestrichelte rechteck neu
    private void updateDelegate(Point ua, Point ue){

        delegate.clearTemporaryDrawableObject();

        DashedRoom r = new DashedRoom(
                room.getName(),
                ua.x,
                ua.y,
                ue.x,
                ue.y,
                room.getWaylist()
        );

        // Temporäres Objekt neu zeichnen
        delegate.setTemporaryDrawableObject(r);
    }



    /**
     * Setze den Status des Listeners zurück.
     */
    public void mouseExited(MouseEvent e) {
        // Lösche temporäres Object und Mausposition
        delegate.clearTemporaryDrawableObject();
        tmp = null;
    }




}
