package model.leveleditor;

import model.drawables.Line;
import model.drawables.Point;
import model.drawables.Rectangle;

import java.awt.*;
import java.awt.geom.Point2D;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 27/07/2016.
 */
public class Room extends Rectangle {

    protected Point2D.Double realA;
    protected Point2D.Double realE;
    protected Point center;


    protected String name;
    protected LinkedList<Way> waylist;

    public Room(String name, double xmin, double ymin, double xmax, double ymax, LinkedList<Way> waylist){

        this.name = name;

        this.realA = new Point2D.Double(xmin, ymin);
        this.realE = new Point2D.Double(xmax, ymax);

        this.a = new Point((int) xmin, (int) ymin);
        this.e = new Point((int) xmax, (int) ymax);

        this.waylist = waylist;

        this.center = new Point(0,0);
    }

    public Room() {
    	
    }
    
    public Room(Room r) {
        this.name = r.getName();

        this.realA = r.getRealA();
        this.realE = r.getRealE();

        this.a = new Point((int) realA.getX(), (int) realA.getY());
        this.e = new Point((int) realE.getX(), (int) realE.getY());

        this.waylist = r.getWaylist();

        this.center = r.getCenter();
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


    public boolean checkMerge(LinkedList<Way> allways){

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

    /**
	 * Zeichnet das Rechteck in einen grafischen Kontext
	 * 
	 * @param g
	 *            der grafische Kontext in den das Rechteck gezeichnet wird
	 */
	public void paint(Graphics g) {
		
		Point drawA = this.a;
		Point drawE = this.e;
		
		drawA.x *=2;
		drawA.y *=2;
		drawE.x *=2;
		drawE.y *=2;
		
		
		Point ur = new Point(drawE.x, drawA.y);
		Point ll = new Point(drawA.x, drawE.y);

		new Line(drawA, ur).paint(g);
		new Line(ur, drawE).paint(g);
		new Line(drawE, ll).paint(g);
		new Line(ll, drawA).paint(g);
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

    public LinkedList<Way> getWaylist() {
        return waylist;
    }

    public void setWaylist(LinkedList<Way> waylist) {
        this.waylist = waylist;
    }

    public Point getCenter() {
        return center;
    }

    public void setCenter(Point center) {
        this.center = center;
    }
}
