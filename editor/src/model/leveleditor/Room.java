package model.leveleditor;

import model.drawables.DrawableObject;

import java.awt.*;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 29/07/2016.
 */
public class Room extends DrawableObject {

    private Coordinates cA, cE, cC;
    private LinkedList<Way> waylist;
    private String name;

    public Room(double ax, double ay, double ex, double ey, Point center, LinkedList<Way> waylist){

        this.cA = new Coordinates(ax, ay);
        this.cE = new Coordinates(ex, ey);
        this.cC = new Coordinates(center.getX(), center.getY());

        this.waylist = waylist;

    }

    //erstellt raum mithilfe des xmlhandlers
    public Room(String name){
        //center = 0,0
    }

    public LinkedList<Way> compareWays(LinkedList<Way> allways){




        return allways;
    }

    private void connect(Way ownway, Way otherway){


    }


    //Rotiert um 90° um cC
    public void rotate(){
        cA.rotation(Math.PI/2, cC);
        cE.rotation(Math.PI/2, cC);
    }

    //verschiebt anhand cC
    public void translate(){
        Coordinates newA = new Coordinates()
        Coordinates newE = new Coordinates()


        cA.translateTo(newA);
        cE.translateTo(newE);

    }


    @Override
    public void paint(Graphics g) {

        //paint this

        //for way's - way.paint

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

    public Coordinates getcC() {
        return cC;
    }

    public LinkedList<Way> getWaylist() {
        return waylist;
    }

    public void setcC(Coordinates cC) {
        this.cC = cC;
    }

    public void updateCenter(Point center){

    }
}
