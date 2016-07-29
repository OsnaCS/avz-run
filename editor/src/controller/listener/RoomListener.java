package controller.listener;

import controller.DrawableObjectProcessing;
import model.drawables.Point;
import model.leveleditor.DashedRoom;
import model.leveleditor.Room;
import model.leveleditor.Way;

import javax.swing.*;
import java.awt.event.MouseEvent;

import java.util.LinkedList;

/**
 * Created by Thomas Dautzenberg on 27/07/2016.
 */
public class RoomListener extends RectangleListener {

	public RoomListener(DrawableObjectProcessing delegate) {
		super(delegate);
	}


}
