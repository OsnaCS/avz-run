package controller;

import model.Way;
import model.drawables.Room;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 26/07/2016.
 */
public class XMLhandler {

	private String filename = "xml_map_editor.xml";

	protected NodeList fileXML;

	protected NodeList editorXML;
	protected Document thedoc;
	protected DocumentBuilderFactory factory;
	DocumentBuilder builder;


	public Room createRoomFromXML(String name) throws FileNotFoundException {


		double xmin, xmax, ymin, ymax;

		Node current = fileXML.item(0);
//		System.out.println(current.getAttributes().getNamedItem("name").getNodeValue());
//		System.out.println(name);
//		System.out.println(current.getAttributes().getNamedItem("name").getNodeValue().equals(name));
		// true if next iterration
		String itemName="";
		boolean next =true;
		while(next){
			// Name of current Node
			itemName = current.getAttributes().getNamedItem("name").getNodeValue().toString(); 
		
			//System.out.println(itemName);
			// iff different take next sibling
			if(!itemName.equals(name)){
				if (current.getNextSibling()!=null){
					current = current.getNextSibling();
				}else{
					// if not found, abbort
					next=false;
					throw new FileNotFoundException();
				}
				
			} else{
				next =false;
			}
		}
		
		Node size = current.getChildNodes().item(0);
		xmin = Double.parseDouble(size.getAttributes().getNamedItem("xmin").getNodeValue());
		xmax = Double.parseDouble(size.getAttributes().getNamedItem("xmax").getNodeValue());
		ymin = Double.parseDouble(size.getAttributes().getNamedItem("ymin").getNodeValue());
		ymax = Double.parseDouble(size.getAttributes().getNamedItem("ymax").getNodeValue());

		// creates Nodelist with all doors in it
		NodeList doors = current.getChildNodes().item(1).getChildNodes();

		int length = doors.getLength();
		Way waylist[] = new Way[length];

		for (int i = 0; i < length - 1; i++) {

			Node doorTemp = doors.item(i);
			String type = doorTemp.getAttributes().getNamedItem("type").getNodeValue();

			double x = Double.parseDouble(doorTemp.getAttributes().getNamedItem("x").getNodeValue());
			double y = Double.parseDouble(doorTemp.getAttributes().getNamedItem("y").getNodeValue());

			int normalX = Integer.parseInt(doorTemp.getAttributes().getNamedItem("normalX").getNodeValue());
			int normalY = Integer.parseInt(doorTemp.getAttributes().getNamedItem("normalY").getNodeValue());

			Way way = new Way(x, y, type, normalX, normalY);
			waylist[i] = way;
		}

		Room room = new Room(itemName, xmin, xmax, ymin, ymax, waylist);

		return room;

	}

	public XMLhandler() {

		factory = DocumentBuilderFactory.newInstance();
		builder = null;
		try {
			builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}

		try {
			thedoc = builder.parse(new File(filename));
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

	public String readXML(String filename) {
		return "";
	}

	public File writeXML(LinkedList<Room> roomlist, String filname) throws ParserConfigurationException, TransformerException {

		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

		// root elements
		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("level");
		doc.appendChild(rootElement);

		// room elements
		Element rooms = doc.createElement("Rooms");
		rootElement.appendChild(rooms);

		// set attribute to staff element

		// shorten way
		// staff.setAttribute("id", "1");
		while (!roomlist.isEmpty()) {
			// firstname elements
			String name = roomlist.poll().getName();
			Element room = doc.createElement(name);
			room.appendChild(doc.createTextNode(name));
			rooms.appendChild(room);

			// set attribute to staff element
			Attr x = doc.createAttribute("x");
			x.setValue("1");
			room.setAttributeNode(x);

			Attr y = doc.createAttribute("y");
			y.setValue("1");
			room.setAttributeNode(y);

			Attr rota = doc.createAttribute("rotation");
			rota.setValue("1");
			room.setAttributeNode(rota);

		}
		// write the content into xml file
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		DOMSource source = new DOMSource(doc);
		File f = new File(filname);
		StreamResult result = new StreamResult(f);

		// Output to console for testing
		//result = new StreamResult(System.out);

		transformer.transform(source, result);

		System.out.println("File saved!");

		return f;

	}

	public String getMap() {
		return "nope";
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