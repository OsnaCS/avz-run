package model.leveleditor;

import model.drawables.DrawableObject;
import model.drawables.Line;
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

    /**
     * Vergleicht alle eigenen Raeume mit der Liste uebergebener Raeume (alle).
     * Alle die nah genug aneinander sind werden aus der Liste offener
     * Wege geloescht, und true wird zurueckgegeben.
     * False als Rueckgabe, wenn es keine nahen Wege gab.
     * @param allways
     * @return
     */
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

    //Rotiert um 90° um center
    public void rotate(){
        rotate(90);
    }

    //Rotiert um angle°
    public void rotate(int angle){
        cA.rotation(90, cC);
        cE.rotation(90, cC);
        cC.rotation(90, cC);
    }


    @Override
    public void paint(Graphics g) {

            //in ursprung verschieben
            //skalieren
            //zurückschieben

        Coordinates originalCenter = new Coordinates(cC);
        setCenter(new Coordinates(0,0));

        //zeichenkoordinaten erstellen
        Point a, e, c;
        a = cA.basisChangeDoubleInt();
        e = cE.basisChangeDoubleInt();
        c = originalCenter.basisChangeDoubleInt();

        a.x+=c.x;
        a.y+=c.y;
        e.x+=c.x;
        e.y+=c.y;

        //rechteck zeichnen
        Point ur = new Point(e.x, a.y);
        Point ll = new Point(a.x, e.y);

        new Line(a, ur).paint(g);
        new Line(ur, e).paint(g);
        new Line(e, ll).paint(g);
        new Line(ll, a).paint(g);

        //wege zeichnen
        for (Way roomway : waylist){
            roomway.paint(g);
        }

        //center zurücksetzen für korrektes speichern
        setCenter(originalCenter);
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
        Coordinates newC = cC.basisChangeIntDouble(center);
        this.cC = newC;
    }

    public void setCenter(Coordinates cC) {
        this.cC = cC;
        this.cA.setPos(cC);
        this.cE.setPos(cC);
    }

}
