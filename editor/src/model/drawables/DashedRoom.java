package model.drawables;

import model.Way;

import java.awt.*;

/**
 * Created by Thomas Dautzenberg on 27/07/2016.
 */
public class DashedRoom extends DashedRectangle {

    private Way[] waylist;

    public DashedRoom(int xa, int ya, int xe, int ye) {
        super(xa, ya, xe, ye);
    }

    public DashedRoom(Point a, Point e) {
        super(a, e);
    }

    public DashedRoom(int xa, int ya, int xe, int ye, Way[] waylist){
        super(xa, ya, xe, ye);
        this.waylist=waylist;
    }

    public DashedRoom(Point a, Point e, Way[] waylist){
        super(a, e);
        this.waylist=waylist;
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);



    }
}
