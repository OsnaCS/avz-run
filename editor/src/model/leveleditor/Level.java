package model.leveleditor;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.LinkedList;

/**
 * Created by Barbara on 29/07/16.
 */
public class Level implements NodeList {

    private LinkedList<Room> allrooms;
    private LinkedList<Way> allways;

    public Level() {
        allrooms = new LinkedList<Room>();
        allways = new LinkedList<Way>();
    }

    @Override
    public Node item(int index) {
        return null;
    }

    @Override
    public int getLength() {
        return allrooms.size();
    }

    public void addRoom(Room newRoom){

    }

    public String toXML() {
        return null;
    }
}
