package model.leveleditor;

import model.drawables.DrawableObject;
import model.drawables.Line;
import model.drawables.Point;

import java.awt.*;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 29/07/2016.
 */
public class Room extends DrawableObject {

	private Coordinates cA, cE, cC;
	private LinkedList<Way> waylist;
	private String name;

	public Room(String name, double ax, double ay, double ex, double ey, Point center, LinkedList<Way> waylist) {

		this.name = name;

		this.cA = new Coordinates(ax, ay);
		this.cE = new Coordinates(ex, ey);

		this.cC = new Coordinates(center.x, center.y);

		// cC = cC.basisChangeIntDouble(center);

		this.waylist = waylist;

	}

	public Room(Room room) {
		this.name = room.name;
		this.cA = new Coordinates(room.getcA());

		this.cE = new Coordinates(room.getcE());

		this.cC = new Coordinates(room.getCenter());

		this.waylist = new LinkedList<Way>();
		for (int i = 0; i < room.waylist.size(); i++) {
			this.waylist.add(new Way(room.waylist.get(i), this));
		}
		this.waylist = waylist;
	}

	/**
	 * Vergleicht alle eigenen Raeume mit der Liste uebergebener Raeume (alle).
	 * Alle die nah genug aneinander sind werden aus der Liste offener Wege
	 * geloescht, und true wird zurueckgegeben. False als Rueckgabe, wenn es
	 * keine nahen Wege gab.
	 * 
	 * @param allways
	 * @return
	 */
	public boolean compareWays(LinkedList<Way> allways) {

		boolean added = false;
		LinkedList<Way> cutways = new LinkedList<>(allways);
		LinkedList<Way> ownways = new LinkedList<>(waylist);

		for (Way mapway : allways) {
			for (Way roomway : waylist) {

				if (roomway.compareDistance(mapway)) {

					ownways.remove(roomway);
					cutways.remove(mapway);

					if (!added) {
						connect(roomway, mapway);
						cutways.addAll(ownways);
					}
					mapway.getFather().getWaylist().remove(mapway);
					added = true;
				}
			}
		}

		this.setWaylist(ownways);

		allways.clear();
		allways.addAll(cutways);

		// setWaylist(cutways);

		return added;

		// return true;
	}

	/**
	 * Setzt neue Mitte für den Raum so, dass er an einem anderen hängt.
	 * 
	 * @param ownway
	 *            eigene Tuer otherway andere Tuer
	 */
	private void connect(Way ownway, Way otherway) {
		boolean uneven=false;
		Point thisCenter = ownway.getFather().getCenter().getScaledIntCoordinates(ownway.getFather().getCenter());
		Point otherDoor = otherway.getPos().getScaledIntCoordinates(otherway.getFather().getCenter());
		Point thisDoor = ownway.getPos().getScaledIntCoordinates(ownway.getFather().getCenter());

		int newPosX = otherDoor.x + (-thisDoor.x + thisCenter.x);
		int newPosY = otherDoor.y + (-thisDoor.y + thisCenter.y);

		Coordinates paintPosition = new Coordinates(newPosX, newPosY);
		paintPosition.setAngle(ownway.getFather().getCenter().getAngle());
		Coordinates hardCor = new Coordinates(ownway.getPos());
		Coordinates softCor = new Coordinates(otherway.getPos());
		//if(ownway.getFather().getCenter().getAngle() != hardCor.getAngle()){
		for (int i = 0; i < ownway.getFather().getCenter().getAngle(); i += 90) {
			hardCor = hardCor.rotation(90, ownway.getFather().getCenter(), hardCor);
				

		}
		if(otherway.getFather().getCenter().getAngle()>0){
			for (int i = 0; i < otherway.getFather().getCenter().getAngle(); i += 90) {
				softCor = softCor.rotation(90, otherway.getFather().getCenter(), softCor);
					

			}
			
		}
		//}
		if(ownway.getFather().getCenter().getAngle()==90||ownway.getFather().getCenter().getAngle()==270){
			uneven=true;
		}

		double dx1 = softCor.getX()+otherway.getFather().getCenter().getX() ;
		double dx2 = ownway.getFather().getCenter().getX() - hardCor.getX();
		double dy1 = softCor.getY()+otherway.getFather().getCenter().getY() ; 
		double dy2 = ownway.getFather().getCenter().getY() - hardCor.getY();
		
		if(ownway.getFather().getCenter().getAngle()==90){
			 dx1  = softCor.getX()+otherway.getFather().getCenter().getY() ;
			
			 dy1 = softCor.getY()+otherway.getFather().getCenter().getX() ; 
			
			
		}
		

		this.cC = new Coordinates(dx1 + dx2, dy1 + dy2);

		moveCenter(paintPosition, ownway.getFather().getCenter().getAngle());
		ownway.getFather().cC=new Coordinates(this.cC);

		int diffCentersX = (int) this.getCenter().getPosx() - (int) otherway.getFather().getCenter().getPosx();
		int diffCentersY = (int) this.getCenter().getPosy() - (int) otherway.getFather().getCenter().getPosy();
		//System.out.println(diffCentersX + " Pixel " + diffCentersY);
		System.out.println("y: "+otherway.getFather().getCenter().getY()+" "+dy1+" "+dy2);
		System.out.println("x: "+otherway.getFather().getCenter().getX()+" "+dx1+" "+dx2);
		System.out.println((dx1 + dx2)  + " double*5 " + (dy1 + dy2)) ;
		System.out.println("other: "+softCor+" own: "+hardCor+" o center:  "+otherway.getFather().getCenter()+" own center: "+ownway.getFather().getCenter() );

	}

	// Rotiert um 90° um center
	public void rotate() {
		rotate(90);
	}

	// Rotiert um angle°
	public void rotate(int angle) {

		cA.rotation(angle, cC);

		cE.rotation(angle, cC);

		cC.rotation(angle, cC);

		for (int i = 0; i < waylist.size(); i++) {
			waylist.get(i).getPos().rotation(angle, cC);

		}
	}
	

	@Override
	public void paint(Graphics g) {

		// in ursprung verschieben
		// skalieren
		// zurückschieben

		// Coordinates originalCenter = new Coordinates(cC);
		// setCenter(new Coordinates(0,0));

		g.setColor(Color.BLACK);

		// center anzeigen
		Point middle = cC.getScaledIntCoordinates(cC);// new Point();
		middle.paint(g);

		// int cX = (int) (cC.getPosx() + 0.5);
		// int cY = (int) (cC.getPosy() + 0.5);
		// Point c = new Point(cX, cY);
		Point a = cA.getScaledIntCoordinates(cC);
		Point e = cE.getScaledIntCoordinates(cC);

		// zeichenkoordinaten erstellen
		// Point a, e, c;
		// a = cA.basisChangeDoubleInt();
		// e = cE.basisChangeDoubleInt();
		// c = originalCenter.basisChangeDoubleInt();
		//
		// a.x+=c.x;
		// a.y+=c.y;
		// e.x+=c.x;
		// e.y+=c.y;

		// rechteck zeichnen
		Point ur = new Point(e.x, a.y);
		Point ll = new Point(a.x, e.y);

		new Line(a, ur).paint(g);
		new Line(ur, e).paint(g);
		new Line(e, ll).paint(g);
		new Line(ll, a).paint(g);

		// wege zeichnen
		for (Way roomway : waylist) {
			roomway.paint(g);
		}

		// center zurücksetzen für korrektes speichern
		// setCenter(originalCenter);
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

	public Coordinates getCenter() {
		return cC;
	}

	public LinkedList<Way> getWaylist() {
		return waylist;
	}

	public void setWaylist(LinkedList<Way> waylist) {
		this.waylist = waylist;
	}

	public void setCenter(Point center, int angle) {
		Coordinates newC = new Coordinates(center.x, center.y, angle);
		setCenter(newC);
	}

	public void setCenter(Coordinates cC) {
		// this.cC = cC;

		this.cC.setPosx(cC.getPosx());
		this.cC.setPosy(cC.getPosy());
		this.cC.setAngle(cC.getAngle());

		this.cA.setPos(cC.addCoordinats(cA.getVector()));
		this.cE.setPos(cC.addCoordinats(cE.getVector()));
		for (int i = 0; i < waylist.size(); i++) {
			waylist.get(i).getPos().setPos(cC.addCoordinats(waylist.get(i).getPos().getVector()));
		}

	}

	public void moveCenter(Point center, int angle) {
		// this.cC = cC;
		Coordinates newC = new Coordinates(center.x, center.y, angle);
		this.cC.setPosx(newC.getPosx());
		this.cC.setPosy(newC.getPosy());
		this.cC.setAngle(newC.getAngle());

		this.cA.setPos(newC.addCoordinats(cA.getVector()));
		this.cE.setPos(newC.addCoordinats(cE.getVector()));
		for (int i = 0; i < waylist.size(); i++) {
			waylist.get(i).getPos().setPos(newC.addCoordinats(waylist.get(i).getPos().getVector()));
		}

		for (int i = 0; i < newC.getAngle(); i += 90) {
			this.cA.rotation(90, newC);
			this.cE.rotation(90, newC);
			for (int j = 0; j < waylist.size(); j++) {
				waylist.get(j).getPos().rotation(90, cC);
			}
		}
	}

	public void moveCenter(Coordinates newC, int angle) {

		this.cC.setPosx(newC.getPosx());
		this.cC.setPosy(newC.getPosy());
		this.cC.setAngle(newC.getAngle());

		this.cA.setPos(newC.addCoordinats(cA.getVector()));
		this.cE.setPos(newC.addCoordinats(cE.getVector()));
		for (int i = 0; i < waylist.size(); i++) {
			waylist.get(i).getPos().setPos(newC.addCoordinats(waylist.get(i).getPos().getVector()));
		}

		for (int i = 0; i < newC.getAngle(); i += 90) {
			this.cA.rotation(90, newC);
			this.cE.rotation(90, newC);
			for (int j = 0; j < waylist.size(); j++) {
				waylist.get(j).getPos().rotation(90, cC);
			}
		}
	}
}
