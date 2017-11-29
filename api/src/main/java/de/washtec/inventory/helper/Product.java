package de.washtec.inventory.helper;

/**
 * Created by afischer on 29.11.2017.
 */
public class Product {
//Tabelle & Spalten
    public static final String TABLE_PRODUCT = "Inventory_Product";
    public static final String COL_PRODUCT_BARCODE = "Description";
    public static final String COL_PRODUCT_AMOUNT = "Amount";
    //Values
    public final String barcode;
    public final int amount;

    public Product(String barcode, int amount){
        this.barcode=barcode;
        this.amount=amount;
    }
}
