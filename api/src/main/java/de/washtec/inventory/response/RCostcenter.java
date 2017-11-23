package de.washtec.inventory.response;

import de.washtec.inventory.helper.Costcenter;

import java.util.List;

/**
 * Created by afischer on 22.11.2017.
 */
public class RCostcenter {

    // Variablen deklarieren (public da später zum Serialisieren genutzt)
    public final String action;
    public final List<Costcenter> list;

    // Konstruktor
    public RCostcenter(String action, List<Costcenter> list) {
        this.action = action;
        this.list = list;
    }
}
