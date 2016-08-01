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
import java.util.HashMap;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 26/07/2016. 
 * Extended by Andreas Schroeder
 * Consulted by Tom Kruemmel
 */
public class XMLhandler {

	// XML-File where all rooms are definet
	final String file;

	// Saves all available Rooms
	protected NodeList fileXML;
	// Vor Decoding
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

		// Opens XML-Factory
		factory = DocumentBuilderFactory.newInstance();
		builder = null;
		try {
			// creates XML-Builder
			builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}

		try {
			// Parse XML into Document
			thedoc = builder.parse(new File(file));
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		// Saves the first Node in XML
		Node thenode = thedoc.getDocumentElement();
		clean(thenode);
		// Saves all subnodes
		fileXML = thenode.getChildNodes();

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
		// Starts with first node
		Node current = fileXML.item(0);
		// Saves current itemName
		String itemName = "";
		boolean next = true;
		while (next) {
			// Name of current Node
			itemName = current.getAttributes().getNamedItem("name").getNodeValue().toString();
			
			// if different take next sibling
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
		
		// Node with all nessessary sizes
		Node size = current.getChildNodes().item(0);
		xmin = Double.parseDouble(size.getAttributes().getNamedItem("xmin").getNodeValue());
		xmax = Double.parseDouble(size.getAttributes().getNamedItem("xmax").getNodeValue());
		ymin = Double.parseDouble(size.getAttributes().getNamedItem("ymin").getNodeValue());
		ymax = Double.parseDouble(size.getAttributes().getNamedItem("ymax").getNodeValue());
		
		// creates Nodelist with all doors in it
		NodeList doors = current.getChildNodes().item(1).getChildNodes();

		// Amount ob doors
		int length = doors.getLength();
		
		// List with all ways of the room
		LinkedList<Way> waylist = new LinkedList<Way>();

		// Create Room from given XML
		Room room = new Room(name, xmin, ymin, xmax, ymax, new Point(0, 0), waylist);

		// Add all Doors to waylist of current Room
		for (int i = 0; i < length - 1; i++) {
			// Saves Door
			Node doorTemp = doors.item(i);
			String type = doorTemp.getAttributes().getNamedItem("type").getNodeValue();

			// Saves Coordinates
			double x = Double.parseDouble(doorTemp.getAttributes().getNamedItem("x").getNodeValue());
			double y = Double.parseDouble(doorTemp.getAttributes().getNamedItem("y").getNodeValue());

			// Saves Normals
			int normalX = Integer.parseInt(doorTemp.getAttributes().getNamedItem("normalX").getNodeValue());
			int normalY = Integer.parseInt(doorTemp.getAttributes().getNamedItem("normalY").getNodeValue());

			// Create Way
			Way way = new Way(type, new Coordinates(x, y), new Coordinates(normalX, normalY), room);
			
			//Add Way to current Room
			waylist.add(way);
		}
		return room;

	}
	
	/**
	 * Creates Level from XML
	 * @param file	Gets File from which XML is created
	 * @return created Level
	 * @throws FileNotFoundException
	 */
	public Level createLevelFromXML(String file) throws FileNotFoundException{
		
		//Initialize XML-Reading
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
		
		// Saves List of all rooms and doors at the outside
		nodelist = node.getChildNodes().item(0).getChildNodes();
		
		// Create empty level
		Level level =new Level();
		
		// Create Waylist for every Room
		LinkedList<Way>[] list = new LinkedList[nodelist.getLength()];
		
		// create Fatherrooms for the way
		// The Rooms need their child-ways and 
		// the childways need their parents.
		Room[] fathers = new Room[nodelist.getLength()];
		
		// Starts with rooms
		for(int i=0; i < nodelist.getLength();i++){
			// Current Node
			Node tmpNode = nodelist.item(i);

			// Check if node is room
			if(tmpNode.getNodeName()=="room"){
				
				// read all nessassary attributes from XML
				String name=tmpNode.getAttributes().getNamedItem("name").getNodeValue();
				double x=Double.parseDouble(tmpNode.getAttributes().getNamedItem("x").getNodeValue());
				double y=Double.parseDouble(tmpNode.getAttributes().getNamedItem("y").getNodeValue());
				double rota=Double.parseDouble(tmpNode.getAttributes().getNamedItem("rota").getNodeValue());
				int index=Integer.parseInt((tmpNode.getAttributes().getNamedItem("index").getNodeValue()));
				
				// Create Room from Name
				// for getting the size of the room
				Room tmp = this.createRoomFromXML(name);
				
				// Calc new position of room
				double xa= tmp.getcA().getX()+x;
				double ya= tmp.getcA().getY()+y;
				double xe= tmp.getcE().getPosx() +x;
				double ye= tmp.getcE().getPosy()+y;
				
				// get right waylist from index
				list[index]=new LinkedList<Way>();
			
				// create Room, fill waylist later
				Room room = new Room(name,xa,ya,xe,ye,new Point((int)x,(int)y),list[index]);
				
				// set Angle
				room.getCenter().setAngle((int)rota);
				
				// save father room with index
				fathers[index]= room;
				
				// add the room
				level.addRoom(room);			
			}
		}
		
		// Doors/Ways
		for(int j=0; j < nodelist.getLength();j++){
			
			// Saves Node
			Node tmpNode = nodelist.item(j);

			// Check if node is door
			if(tmpNode.getNodeName()=="door"){
				
				// Saves all attributes
				String type=tmpNode.getAttributes().getNamedItem("type").getNodeValue();
				double x=Double.parseDouble(tmpNode.getAttributes().getNamedItem("x").getNodeValue());
				double y=Double.parseDouble(tmpNode.getAttributes().getNamedItem("y").getNodeValue());
				double normx=Double.parseDouble(tmpNode.getAttributes().getNamedItem("normx").getNodeValue());
				double normy=Double.parseDouble(tmpNode.getAttributes().getNamedItem("normy").getNodeValue());
				int father=Integer.parseInt((tmpNode.getAttributes().getNamedItem("father").getNodeValue()));
				
				// Create Coordinates
				Coordinates c =new Coordinates(x,y);
				Coordinates n =new Coordinates(normx,normy);
				
				// Get Father-Room from fatherindex
				Room fatherRoom =fathers[father];
				
				// create Way
				Way way = new Way(type,c,n,fatherRoom);
				
				// Add door to level and waylist of father
				list[father].add(way);
				level.addWay(way);
			}
		}
		this.toXML(level);
		return level;
	}

	/**
	 * parses level into XML-String
	 * @param level
	 * @return XML-String
	 */
	public String toXML(Level level) {
		// Initializing XML-Writing
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = null;
		try {
			docBuilder = docFactory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
		
			e.printStackTrace();
		}

		// root elements
		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("level");
		doc.appendChild(rootElement);

		// Create rooms Element
		Element rooms = doc.createElement("rooms");
		rootElement.appendChild(rooms);

		// Creates spawns Element
		Element spawns = doc.createElement("spawns");
		rootElement.appendChild(spawns);

		// Creates lights Element
		Element lights = doc.createElement("lights");
		rootElement.appendChild(lights);

		// Creates fires Element
		Element fires = doc.createElement("fires");
		rootElement.appendChild(fires);

		//List with all Rooms
		// TODO: The name is not a good KEY, serveral rooms could have same name;
		LinkedList<Room> roomlist = level.getRooms();
		// Hashmap
		HashMap<Room,Integer> map = new HashMap<Room,Integer>();
		int i =0;
		for(int j =0; j < roomlist.size();j++) {
			
			// Create Tag for Room
			Room currentRoom = roomlist.get(j);
			Element room = doc.createElement("room");
			room.appendChild(doc.createTextNode("room"));
			rooms.appendChild(room);

			// set attributes
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
			
			// Add Room to Hashmap
			map.put(currentRoom, i);
			i++;
			
			// Add Index
			Attr index = doc.createAttribute("index");
			index.setValue(new Integer(map.get(currentRoom)).toString());
			room.setAttributeNode(index);

		}
		// Add Doors to XML
		LinkedList<Way> doorlist = level.getWays();
		for(int j =0; j < doorlist.size();j++) {
			// Current Way
			Way currentWay = doorlist.get(j);

			// Add Door Tag
			Element door = doc.createElement("door");
			door.appendChild(doc.createTextNode("door"));
			rooms.appendChild(door);

			// set attributes to staff element 
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
			
			//Get Father ID
			int id =map.get(currentWay.getFather());
			Attr father = doc.createAttribute("father");
			father.setValue(new Integer(id).toString());
			door.setAttributeNode(father);
			
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
		Writer writer = new StringWriter();
		StreamResult result = new StreamResult(writer);

		try {
			transformer.transform(source, result);
		} catch (TransformerException e) {
			
			e.printStackTrace();
		}

		System.out.println(writer.toString());
		return writer.toString();

	}

	/**
	 * Writes XML-Files go given file
	 * @param level
	 * @param filename
	 * @return
	 */
	public File writeXML(Level level, String filename) {
		File f = new File(filename);
		try (PrintWriter writer = new PrintWriter(f)) {
			writer.println(toXML(level));

		} catch (IOException e) {
			

			e.printStackTrace();
		} finally {
			System.err.println("Error Saving XML-File");
		}

		return f;

	}

	/**
	 * Cleaning
	 * @param node
	 */
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