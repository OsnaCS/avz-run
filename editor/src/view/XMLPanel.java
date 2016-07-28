package view;

import java.awt.*;
import java.util.LinkedList;

import javax.swing.*;

import model.drawables.DrawableObject;

@SuppressWarnings("serial")
public class XMLPanel extends JPanel {

    private JButton saveButton;
    private JButton undoButton;

    // JTextField don't have newLines
    // Choose JTextPane
    private JTextPane textField;

    /**
     * Konstruktor, der die Buttons und das Textfeld erstellt und 
     * diese im Panel anordnet
     *
     */
    public XMLPanel() {

        this.setLayout(new BorderLayout());

        // Create Label
        JLabel l = new JLabel("XML-Datei");
        this.add(l, BorderLayout.NORTH);

        textField = new JTextPane();

        this.add(textField, BorderLayout.CENTER);


        // Buttons
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new BorderLayout());

        saveButton = new JButton("Speichern & Beenden");
        undoButton = new JButton("Rückgängig");

        buttonPanel.add(saveButton, BorderLayout.WEST);
        buttonPanel.add(undoButton, BorderLayout.EAST);

        this.add(buttonPanel, BorderLayout.SOUTH);

    }

    /**
     * 
     * @return Speicher-Button
     */
    public JButton getSaveButton(){
        return saveButton;
    }

    /**
     * 
     * @return Rückgängig-Button
     */
    public JButton getUndoButton(){
        return undoButton;
    }

    /**
     * 
     * @return XML-Textfeld
     */
    public JTextPane getTextField(){
        return textField;
    }
}