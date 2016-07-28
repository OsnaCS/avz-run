package model.drawables;

import java.util.LinkedList;

import model.Way;

/**
 * Created by Thomas Dautzenberg on 28/07/2016.
 */
public class DashedRoom extends Room {

    public DashedRoom(String name, double xmin, double ymin, double xmax, double ymax, LinkedList<Way> waylist) {
        super(name, xmin, ymin, xmax, ymax, waylist);
    }

}
