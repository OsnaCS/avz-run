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

    public Room(double ax, double ay, double ex, double ey,Point center, LinkedList<Way> waylist){

    }

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

    }

    //verschiebt anhand cC
    public void translate(){

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

    public void setCenter(Coordinates cC) {
        this.cC = cC;
    }
}
