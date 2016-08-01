package model.leveleditor;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import model.drawables.Point;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 26/07/2016. 
 * Extended by Andreas Schroeder
 * Consulted by Tom Kruemmel
 */
public class XMLhandler {

	final String file;

	// private String filename = "xml_map_editor.xml";

	protected NodeList fileXML;

	protected NodeList editorXML;
	protected Document thedoc;
	protected DocumentBuilderFactory factory;
	DocumentBuilder builder;

	/**
	 * Constructor
	 * 
	 * @param file
	 *            The file with all available rooms.
	 */
	public XMLhandler(String file) {
		this.file = file;

		factory = DocumentBuilderFactory.newInstance();
		builder = null;
		try {
			builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}

		try {
			thedoc = builder.parse(new File(file));
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Node thenode = thedoc.getDocumentElement();
		clean(thenode);
		fileXML = thenode.getChildNodes();

		// readXML("gang_solo.xml");

	}

	/**
	 * creates room from XML
	 * 
	 * @param name
	 *            The name of the Room
	 * @return Returns the wanted room
	 * @throws FileNotFoundException
	 */
	public Room createRoomFromXML(String name) throws FileNotFoundException {

		double xmin, xmax, ymin, ymax;

		Node current = fileXML.item(0);
		// System.out.println(current.getAttributes().getNamedItem("name").getNodeValue());
		// System.out.println(name);
		// System.out.println(current.getAttributes().getNamedItem("name").getNodeValue().equals(name));
		// true if next iterration
		String itemName = "";
		boolean next = true;
		while (next) {
			// Name of current Node
			itemName = current.getAttributes().getNamedItem("name").getNodeValue().toString();

			// System.out.println(itemName);
			// iff different take next sibling
			if (!itemName.equals(name)) {
				if (current.getNextSibling() != null) {
					current = current.getNextSibling();
				} else {
					// if not found, abbort
					next = false;
					throw new FileNotFoundException();
				}

			} else {
				next = false;
			}
		}

		Node size = current.getChildNodes().item(0);
		xmin = Double.parseDouble(size.getAttributes().getNamedItem("xmin").getNodeValue());
		xmax = Double.parseDouble(size.getAttributes().getNamedItem("xmax").getNodeValue());
		ymin = Double.parseDouble(size.getAttributes().getNamedItem("ymin").getNodeValue());
		ymax = Double.parseDouble(size.getAttributes().getNamedItem("ymax").getNodeValue());
		// Coordinates begin = new Coordinates(xmin, ymin);
		// Coordinates end = new Coordinates(xmax, ymax);
		// Coordinates center = new Coordinates(0,0);

		// creates Nodelist with all doors in it
		NodeList doors = current.getChildNodes().item(1).getChildNodes();

		int length = doors.getLength();
		LinkedList<Way> waylist = new LinkedList<Way>();

		Room room = new Room(name, xmin, ymin, xmax, ymax, new Point(0, 0), waylist);

		for (int i = 0; i < length - 1; i++) {
			Node doorTemp = doors.item(i);
			String type = doorTemp.getAttributes().getNamedItem("type").getNodeValue();

			double x = Double.parseDouble(doorTemp.getAttributes().getNamedItem("x").getNodeValue());
			double y = Double.parseDouble(doorTemp.getAttributes().getNamedItem("y").getNodeValue());

			int normalX = Integer.parseInt(doorTemp.getAttributes().getNamedItem("normalX").getNodeValue());
			int normalY = Integer.parseInt(doorTemp.getAttributes().getNamedItem("normalY").getNodeValue());

			Way way = new Way(type, new Coordinates(x, y), new Coordinates(normalX, normalY), room);
			waylist.add(way);
		}

		return room;

	}
	public Level createLevelFromXML(String file){
		
		
		Document doc=null;
		DocumentBuilderFactory fac;
		DocumentBuilder build;
		
		fac = DocumentBuilderFactory.newInstance();
		build = null;
		try {
			build = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}

		try {
			doc = build.parse(new File(file));
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Node node = doc.getDocumentElement();
		clean(node);
		NodeList nodelist;
		nodelist = node.getChildNodes().item(0).getChildNodes();
		
		
		return null;
	}

	public String toXML(Level level) {

		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = null;
		try {
			docBuilder = docFactory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// root elements
		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("level");
		doc.appendChild(rootElement);

		// room elements
		Element rooms = doc.createElement("rooms");
		rootElement.appendChild(rooms);

		Element spawns = doc.createElement("spawns");
		rootElement.appendChild(spawns);

		Element lights = doc.createElement("lights");
		rootElement.appendChild(lights);

		Element fires = doc.createElement("fires");
		rootElement.appendChild(fires);

		// set attribute to staff element

		// shorten way
		// staff.setAttribute("id", "1");
		LinkedList<Room> roomlist = level.getRooms();
		while (!roomlist.isEmpty()) {
			// firstname elements
			Room currentRoom = roomlist.poll();
			Element room = doc.createElement("room");
			room.appendChild(doc.createTextNode("room"));
			rooms.appendChild(room);

			// set attribute to staff element
			Attr roomName = doc.createAttribute("name");
			roomName.setValue(currentRoom.getName());
			room.setAttributeNode(roomName);

			Attr x = doc.createAttribute("x");
			x.setValue(new Double(currentRoom.getCenter().getPosx()).toString());
			room.setAttributeNode(x);

			Attr y = doc.createAttribute("y");
			y.setValue(new Double(currentRoom.getCenter().getPosy()).toString());
			room.setAttributeNode(y);

			Attr rota = doc.createAttribute("rotation");
			rota.setValue(new Double(currentRoom.getCenter().getAngle()).toString());
			room.setAttributeNode(rota);

		}
		LinkedList<Way> doorlist = level.getWays();
		while (!doorlist.isEmpty()) {
			// firstname elements
			Way currentWay = doorlist.poll();

			Element door = doc.createElement("door");
			door.appendChild(doc.createTextNode("door"));
			rooms.appendChild(door);

			// set attribute to staff element <door type="wood" x="-10" y="7"
			// normx="0" normy="11"/>
			Attr type = doc.createAttribute("type");
			type.setValue(currentWay.getType());
			door.setAttributeNode(type);

			Attr x = doc.createAttribute("x");
			x.setValue(new Double(currentWay.getPos().getPosx()).toString());
			door.setAttributeNode(x);

			Attr y = doc.createAttribute("y");
			y.setValue(new Double(currentWay.getPos().getPosy()).toString());
			door.setAttributeNode(y);

			Attr normx = doc.createAttribute("normx");
			normx.setValue(new Double(currentWay.getNormal().getPosx()).toString());
			door.setAttributeNode(normx);
			
			Attr normy = doc.createAttribute("normy");
			normy.setValue(new Double(currentWay.getNormal().getPosy()).toString());
			door.setAttributeNode(normy);
		}
		// write the content into xml file
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = null;
		try {
			transformer = transformerFactory.newTransformer();
		} catch (TransformerConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// Makes the XML Output beautiful
		// DON'T DELETE AGAIN
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
		DOMSource source = new DOMSource(doc);

		// StreamResult result = new StreamResult(f);

		// Output to console for testing
		// result = new StreamResult(System.out);
		Writer writer = new StringWriter();
		// System.out.println((StringWriter)/result.getWriter().toString());
		StreamResult result = new StreamResult(writer);

		try {
			transformer.transform(source, result);
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return writer.toString();

	}

	public File writeXML(Level level, String filename) {
		File f = new File(filename);
		try (PrintWriter writer = new PrintWriter(f)) {
			writer.println(toXML(level));

		} catch (IOException e) {
			// TODO Auto-generated catch block

			e.printStackTrace();
		} finally {
			System.err.println("Error Saving XML-File");
		}

		return f;

	}

	public static void clean(Node node) {
		NodeList childNodes = node.getChildNodes();

		for (int n = childNodes.getLength() - 1; n >= 0; n--) {
			Node child = childNodes.item(n);
			short nodeType = child.getNodeType();

			if (nodeType == Node.ELEMENT_NODE)
				clean(child);
			else if (nodeType == Node.TEXT_NODE) {
				String trimmedNodeVal = child.getNodeValue().trim();
				if (trimmedNodeVal.length() == 0)
					node.removeChild(child);
				else
					child.setNodeValue(trimmedNodeVal);
			} else if (nodeType == Node.COMMENT_NODE)
				node.removeChild(child);
		}
	}
}