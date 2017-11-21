package de.washtec.inventory;

public class Config {

    // Http-Codes
    static final int OK = 200;
    static final int CREATED = 201;
    static final int NOT_MODIFIED = 304;
    static final int BAD_REQUEST = 400;
    static final int UNAUTHORIZED = 401;
    static final int FORBIDDEN = 403;
    static final int NOT_FOUND = 404;
    static final int UNPROCESSABLE_ENTITY = 422;
    static final int SERVER_ERROR = 500;

    // Api Port
    static final int PORT = 1234;

    // Daten des Active Directories
    static final String LDAP_HOST = "172.18.4.150";
    static final int LDAP_PORT = 389;
    static final String LDAP_AUTH_LEVEL = "simple";

}
