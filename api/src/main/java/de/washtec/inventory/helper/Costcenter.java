package de.washtec.inventory.helper;

/**
 * Created by afischer on 22.11.2017.
 */
public class Costcenter {

    public static final String TABLE_COSTCENTER = "CostCenter";
    public static final String COL_COSTCENTER_ID = "Id";
    public static final String COL_COSTCENTER_KSTNR = "Description";
    public static final String COL_COSTCENTER_DESCRIPTION = "BezKostenstelle";


    public final int id;
    public final String kstnr,description;

    // Konstruktor
    public Costcenter(int id, String kstnr, String description) {
        this.id = id;
        this.kstnr = kstnr;
        this.description = description;

    }

}
