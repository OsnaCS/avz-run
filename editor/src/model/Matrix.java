package model;

import java.awt.geom.Point2D;

import model.drawables.Point;

/**
 * Repr��sentiert eine nxm-Matrix
 * 
 * @author Nicolas Neubauer
 * 
 */
public class Matrix {

	private double[][] elements;

	/**
	 * ��bernimmt die Referenz auf das 2-Dimensionale Array in Form von
	 * array[zeilen][spalten].
	 * 
	 * @param elements
	 *            die Elemente der Matrix
	 */
	public Matrix(double[][] elements) {
		this.elements = elements;
	}

	/**
	 * Erzeugt eine Einheitsmatrix mit rows Zeilen und Spalten
	 * 
	 * @param rows
	 *            Anzahl der Zeilen/Spalten
	 * @return eine neue Einheitsmatrix
	 */
	public static Matrix createIdentity(int rows) {
		double[][] identity = new double[rows][rows];

		for (int i = 0; i < rows; i++)
			identity[i][i] = 1;

		return new Matrix(identity);
	}

	/**
	 * Gibt die Matrix als String zur��ck.
	 */
	public String toString() {
		String r = "{";
		// Durch alle Textfelder gehen und Doubles rausziehen
		for (int row = 0; row < elements.length; row++) {
			r += "{";
			for (int col = 0; col < elements[row].length; col++) {
				r += (col + 1 == elements[row].length) ? elements[row][col]
						: elements[row][col] + ", ";
			}
			r += (row + 1) == elements.length ? "}" : "}, \n";
		}

		return r + "}";
	}

	/**
	 * @return Anzahl der Zeilen
	 */
	public int getRows() {
		return elements.length;
	}

	/**
	 * @return Anzahl der Spalten
	 */
	public int getCols() {
		return elements[0].length;
	}

	/**
	 * Der Wert der Matrix an der Stelle (row,col)
	 * 
	 * @param row
	 *            Zeile
	 * @param col
	 *            Spalte
	 * @return Wert in der Matrix
	 */
	public double getValue(int row, int col) {
		return elements[row][col];
	}

	/**
	 * Multipliziert diese Matrix von links mit der ��bergebenen Matrix m und
	 * gibt das Ergebnis als neue Matrix zur��ck. (seiteneffektfrei)
	 * 
	 * this * m = ergebnismatrix
	 * 
	 * @param m
	 *            die Matrix mit der diese multipliziert werden soll.
	 * @return die Ergebnismatrix
	 */
	public Matrix multiply(Matrix m) {

		if (this.getCols() != m.getRows())
			throw new ArithmeticException(
					"Eine a x b-Matrix kann nur mit einer b x c-Matrix multipliziert werden!");

		double[][] result = new double[this.getRows()][m.getCols()];

		for (int curRow = 0; curRow < this.getRows(); curRow++) {
			for (int mCol = 0; mCol < m.getCols(); mCol++) {
				for (int curCol = 0; curCol < this.getCols(); curCol++) {
					result[curRow][mCol] += this.getValue(curRow, curCol)
							* m.getValue(curCol, mCol);
				}
			}
		}

		return new Matrix(result);

	}

	/**
	 * Multipliziert diese Matrix von links mit dem ��bergebenen Punkt. Dazu muss
	 * der Punkt unter Umst��nden als 3-elementiger Vector aufgefasst werden,
	 * wobei die homogene Koordinate 1.0 in der dritten Komponente erg��nzt
	 * werden kann.
	 * 
	 * @param p
	 *            der Punkt
	 * @return das Ergebnis dieser Matrix * den Punkt
	 */
	public Point multiply(Point p) {
		// Betrachte Punkt als 3x1 Matrix
		double[][] vector = new double[3][1];
		vector[0][0] = p.x;
		vector[1][0] = p.y;
		vector[2][0] = 1.0; // homogene Koordinate

		Matrix r = this.multiply(new Matrix(vector));
		return new Point((int) (r.getValue(0, 0) / r.getValue(2, 0)), (int) (r
				.getValue(1, 0) / r.getValue(2, 0)));
	}
	
	public Point2D.Double multiplyDouble(Point2D.Double p) {
		// Betrachte Punkt als 3x1 Matrix
		double[][] vector = new double[3][1];
		vector[0][0] = p.x;
		vector[1][0] = p.y;
		vector[2][0] = 1.0; // homogene Koordinate

		Matrix r = this.multiply(new Matrix(vector));
		return new Point2D.Double((r.getValue(0, 0) / r.getValue(2, 0)), (r
				.getValue(1, 0) / r.getValue(2, 0)));
	}

}
