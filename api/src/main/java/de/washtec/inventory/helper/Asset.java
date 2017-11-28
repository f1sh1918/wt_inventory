package de.washtec.inventory.helper;

/**
 * Created by afischer on 21.11.2017.
 */
public class Asset {
    public String barcode;
    public int amount;
    public int costcenterId;
    public float price;
    public Asset (){


    }

    public Asset(String barcode, int amount, int costcenterId, float price) {
        this.barcode = barcode;
        this.amount = amount;
        this.costcenterId = costcenterId;
        this.price = price;
    }
}
