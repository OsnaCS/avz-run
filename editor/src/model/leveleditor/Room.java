package model.leveleditor;

import model.drawables.DrawableObject;
import model.drawables.Point;
import sun.awt.image.ImageWatched;


import java.awt.*;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 29/07/2016.
 */
public class Room extends DrawableObject {

    private Coordinates cA, cE, cC;
    private LinkedList<Way> waylist;
    private String name;

    public Room(String name, double ax, double ay, double ex, double ey, Point center, LinkedList<Way> waylist){

        this.name = name;

        this.cA = new Coordinates(ax, ay);
        this.cE = new Coordinates(ex, ey);
        this.cC = new Coordinates(center.x, center.y);

        this.waylist = waylist;

    }

    public boolean compareWays(LinkedList<Way> allways){

        boolean added = false;
        LinkedList<Way> cutways = new LinkedList<>(allways);

        for (Way mapway : allways){
            for (Way roomway : waylist){

                if (roomway.compareDistance(mapway)){

                    waylist.remove(roomway);
                    cutways.remove(mapway);

                    if (!added){
                        connect(roomway, mapway);
                        cutways.addAll(waylist);
                    }

                    added = true;

                }
            }
        }

        setWaylist(cutways);

        return added;
    }

    /**
     * Setzt neue Mitte für den Raum
     * so, dass er an einem anderen hängt.
     * @param ownway    eigene Tuer
     *        otherway  andere Tuer
     */
    private void connect(Way ownway, Way otherway){
        Coordinates touchedRoom = new Coordinates(otherway.getFather().getCenter());

        //Raummitten werden in Respektive zur benutzten Tuer gesetzt
        Coordinates newCenter = new Coordinates(ownway.getPos().getVector().getInvert());
        touchedRoom = touchedRoom.addCoordinats(otherway.getPos().getVector());

        newCenter = newCenter.addCoordinats(touchedRoom);

        setCenter(newCenter);
    }

    //Rotiert um 90° um cC
    public void rotate(){
        cA.rotation(90, cC);
        cE.rotation(90, cC);
        cC.rotation(90, cC);
    }


    @Override
    public void paint(Graphics g) {

        //paint this
        // then
        //for (way's){way.paint};
    }

    public String getName() {
        return name;
    }

    public Coordinates getcA() {
        return cA;
    }

    public Coordinates getcE() {
        return cE;
    }

    public Coordinates getCenter() {
        return cC;
    }

    public LinkedList<Way> getWaylist() {
        return waylist;
    }

    public void setWaylist(LinkedList<Way> waylist) {
        this.waylist = waylist;
    }

    public void setCenter(Point center){
        Coordinates newC = Coordinates.basisChangeIntDouble(center);
        this.cC = newC;
    }

    public void setCenter(Coordinates cC) {
        this.cC = cC;
        this.cA.setPos(cC);
        this.cE.setPos(cC);
    }

}
