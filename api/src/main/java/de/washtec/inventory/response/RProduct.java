package de.washtec.inventory.response;

import de.washtec.inventory.helper.Product;

import java.util.List;

/**
 * Created by afischer on 29.11.2017.
 */
public class RProduct {

    public final List<Product> data;

    public RProduct(List<Product>data){
        this.data=data;
    }
}
