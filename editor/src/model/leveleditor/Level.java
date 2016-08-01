package model.leveleditor;
import java.util.LinkedList;


/**
 * Created by Barbara on 29/07/16.
 */
public class Level {

    private LinkedList<Room> allrooms;
    private LinkedList<Way> allways;

    public Level() {
        allrooms = new LinkedList<Room>();
        allways = new LinkedList<Way>();
    }

    public LinkedList<Room> getRooms() {
        return allrooms;
    }

    public LinkedList<Way> getWays() {
        return allways;
    }

    public int getRoomNr() {
        return allrooms.size();
    }

    public int getWayNr() {
        return allways.size();
    }

    public void addRoom(Room newRoom){
        allrooms.add(newRoom);
    }

    public void deleteRoom(Room toDelete){
        allrooms.remove(toDelete);
    }

    public void addWay(Way newWay){
        allways.add(newWay);
    }

    public void deleteWay(Way toDelete){
        allways.remove(toDelete);
    }

    public void clearWays() {
        allways.clear();
    }

    public void clearRooms() {
        allrooms.clear();
    }

    public void setWays(LinkedList<Way> wayList) {
        clearWays();
        this.allways = wayList;

    }

    public void clear(){
        clearRooms();
        clearWays();
    }
}
