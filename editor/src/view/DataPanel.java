package view;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.GridLayout;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JTextField;

/**
 * Created by Thomas Dautzenberg on 26/07/2016.
 */
public class DataPanel extends JPanel {

    public DataPanel(){
        this.setLayout(new BorderLayout());

        JTextField textfield = new JTextField();

        this.add(textfield);


    }




}
