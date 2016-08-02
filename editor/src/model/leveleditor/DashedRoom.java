package model.leveleditor;

import java.awt.Color;
import java.awt.Graphics;
import java.util.LinkedList;

import model.drawables.DashedLine;
import model.drawables.Line;
import model.drawables.Point;

/**
 * Created by Thomas Dautzenberg on 28/07/2016.
 */
public class DashedRoom extends Room {

	private Coordinates cA, cE, cC;
    private LinkedList<Way> waylist;
    private String name;
	
	public DashedRoom(String name, double xmin, double ymin, double xmax, double ymax, Point center, LinkedList<Way> waylist) {
		super(name, xmin, ymin, xmax, ymax, center, waylist);
		
		this.cA = new Coordinates(xmin, ymin);
		this.cE = new Coordinates(xmax, ymax);
		this.cC = new Coordinates((center.x / 5), (center.y / 5));
		
		this.name = name;
		
		this.waylist = waylist;
		
	}

	public DashedRoom(Room room, Point mousePos) {
		this(room.getName(), room.getcA().getX(), room.getcA().getY(), room.getcE().getX(), room.getcE().getY(),
				mousePos, room.getWaylist());
	}

	@Override
	public void paint(Graphics g) {
		
		// in ursprung verschieben
		// skalieren
		// zurückschieben

		g.setColor(Color.BLACK);

		Point a = this.cA.getScaledIntCoordinates(this.cC);
        Point e = this.cE.getScaledIntCoordinates(this.cC);
		// rechteck zeichnen

        Point ur = new Point(e.x, a.y);
		Point ll = new Point(a.x, e.y);

		new DashedLine(a, ur).paint(g);
		new DashedLine(ur, e).paint(g);
		new DashedLine(e, ll).paint(g);
		new DashedLine(ll, a).paint(g);

		// wege zeichnen
		for (Way roomway : this.waylist) {
			roomway.paint(g);
		}
	}

}
