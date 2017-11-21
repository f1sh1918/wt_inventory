package de.washtec.inventory.helper;

/**
 * Created by afischer on 21.11.2017.
 */
public class Asset {
    public String barcode;
    public int amount;
    public int costcenterId;
    public Asset (){


    }

    public Asset(String barcode, int amount, int costcenterId) {
        this.barcode = barcode;
        this.amount = amount;
        this.costcenterId = costcenterId;
    }
}
