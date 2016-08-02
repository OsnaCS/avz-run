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

	public DashedRoom(String name, double xmin, double ymin, double xmax, double ymax, LinkedList<Way> waylist) {
		super(name, xmin, ymin, xmax, ymax, null, null);
	}

	public DashedRoom(Room room, Point mousePos) {
		super(room.getName(), room.getcA().getX(), room.getcA().getY(), room.getcE().getX(), room.getcE().getY(),
				mousePos, room.getWaylist());
	}

	@Override
	public void paint(Graphics g) {

		// in ursprung verschieben
		// skalieren
		// zurückschieben

		g.setColor(Color.BLACK);

		Point a = cA.getScaledIntCoordinates(cC);
		Point e = cE.getScaledIntCoordinates(cC);
		// rechteck zeichnen
		Point ur = new Point(e.x, a.y);
		Point ll = new Point(a.x, e.y);

		new DashedLine(a, ur).paint(g);
		new DashedLine(ur, e).paint(g);
		new DashedLine(e, ll).paint(g);
		new DashedLine(ll, a).paint(g);

		// wege zeichnen
		for (Way roomway : waylist) {
			roomway.paint(g);
		}
	}

}
