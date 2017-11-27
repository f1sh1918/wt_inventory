package de.washtec.inventory.response;

import de.washtec.inventory.helper.Costcenter;

import java.util.List;

/**
 * Created by afischer on 22.11.2017.
 */
public class RCostcenter {

    // Variablen deklarieren (public da später zum Serialisieren genutzt)

    public final List<Costcenter> data;

    // Konstruktor
    public RCostcenter(List<Costcenter> data) {
            this.data = data;
    }
}
