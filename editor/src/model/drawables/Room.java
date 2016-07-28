package model.drawables;

import model.Way;

import java.awt.*;
import java.awt.geom.Point2D;

/**
 * Created by Thomas Dautzenberg on 27/07/2016.
 */
public class Room extends Rectangle {

    protected Point2D.Double realA;
    protected Point2D.Double realE;
    protected String name;
    protected Way[] waylist;

    public Room(String name, double xmin, double ymin, double xmax, double ymax, Way[] waylist){

        this.name = name;

        this.realA = new Point2D.Double(xmin, ymin);
        this.realE = new Point2D.Double(xmax, ymax);

        this.a = new Point((int) xmin, (int) ymin);
        this.e = new Point((int) xmax, (int) ymax);

        this.waylist = waylist;
    }

    //dreht den Raum um 90°
    public void spin(){

        Point2D.Double tmpA = realA;
        Point2D.Double tmpE = realE;

        double cosinus = Math.cos(90);
        double sinus = Math.sin(90);

        setRealA(new Point2D.Double(
                cosinus*realA.getX()-sinus*realA.getY(),
                sinus*realA.getX()+cosinus*realA.getY()
        ));
        setRealE(new Point2D.Double(
                cosinus*realE.getX()-sinus*realE.getY(),
                sinus*realE.getX()+cosinus*realE.getY()
        ));

        setA(new Point((int) realA.getX(), (int) realA.getY()));
        setE(new Point((int) realE.getX(), (int) realE.getY()));
    }


    public boolean checkMerge(Way[] allways){

        int MERGETHRESHOLD = 5;

        for (Way aw : allways){
            for (Way wl : waylist){
                if (Math.abs(aw.getX()-wl.getX())<= MERGETHRESHOLD
                && Math.abs(aw.getY()-wl.getY())<= MERGETHRESHOLD){
                    return true;
                }
            }
        }
        return true;
    }














    /*##########################################################################

                                 Getter and Setter

    ##########################################################################*/

    public Point2D.Double getRealA() {
        return realA;
    }

    public void setRealA(Point2D.Double realA) {
        this.realA = realA;
    }

    public Point2D.Double getRealE() {
        return realE;
    }

    public void setRealE(Point2D.Double realE) {
        this.realE = realE;
    }

    public void setA(Point a){
        this.a = a;
    }

    public void setE(Point e){
        this.e = e;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Way[] getWaylist() {
        return waylist;
    }

    public void setWaylist(Way[] waylist) {
        this.waylist = waylist;
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);

    }
}
