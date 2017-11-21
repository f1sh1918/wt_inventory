package de.washtec.inventory.helper;

/**
 * Created by rgriesbaum on 06.06.2017.
 */
public class Auth {


    public String username, password, authToken;

    public Auth() {
    }

    public Auth(String username, String password, String authToken) {
        this.username = username;
        this.password = password;
        this.authToken = authToken;
    }

}
