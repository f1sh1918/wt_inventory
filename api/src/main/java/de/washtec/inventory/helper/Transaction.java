package de.washtec.inventory.helper;

import java.util.List;

/**
 * Created by afischer on 21.11.2017.
 */
public class Transaction {

    public List<Asset> data;

    public Transaction(){

    }

    public Transaction (List<Asset>data){
        this.data=data;

    }

}
