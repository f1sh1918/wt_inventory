package de.washtec.inventory;

public class Config {

    // Token Secret
    static final String JWT_SECRET = "hFscy@m2CBGkYJYS?RQrbuwVk*c*%UnC";
    static final String JWT_ISSUER = "WashTecHolding";
    static final String JWT_SUBJECT = "WT Inventory";

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
    static final int PORT = 12345;

    // Daten des Active Directories
    static final String LDAP_HOST = "172.18.4.150";
    static final int LDAP_PORT = 389;
    static final String LDAP_AUTH_LEVEL = "simple";



    // Daten zur Postgres-Datenbank der API
    static final String APP_HOST = "127.0.0.1";
    static final String APP_DATABASE = "hse_q";
    static final String APP_USERNAME = "wt_inventory";
    static final String APP_PASSWORD = "DZy]F#~)";

    // Daten zur Postgres-Datenbank der Prod-CMDB
    static final String CMDB_HOST = "172.18.4.84";
    static final String CMDB_DATABASE = "cmdbv2";
    static final String CMDB_USERNAME = "wt_inventory";
    static final String CMDB_PASSWORD = "DZy]F#~)";

    // Status für jede CMDB
    static final String CMDB_STATUS = "A";
    // CIState aus der Prod-CMDB
    static final int CMDB_CISTATE = 92074366;
    // Active aus der Api-CMDB
    static final boolean CMDB_ACTIVE = true;

    // ALLGEMEIN-CMDB
    static final String COL_CMDB_ACTIVE = "Active";
    static final String COL_CMDB_STATUS = "Status";
    static final String COL_CMDB_CISTATE = "CIState";
    static final String COL_ASSET_CREATED = "AssetCreated";

    // APP-CMDB
    // Token-Tabelle
    static final String TABLE_TRANSACTION = "Inventory_Transaction";
    static final String TABLE_PRODUCT = "Inventory_Product";
    static final String TABLE_TOKEN = "Token_Inventory";
    static final String COL_TOKEN_ACCOUNT = "Account";
    static final String COL_TOKEN_DESCRIPTION = "Description";

    //Transaction Table
    static final String COL_TRANSACTION_AMOUNT = "Amount";
    static final String COL_TRANSACTION_COSTCENTER = "CostCenter";
    static final String COL_TRANSACTION_PRODUCT = "Product";
    static final String COL_TRANSACTION_USERNAME = "Username";

//Product Table

    static final String COL_PRODUCT_ID = "Id";
    static final String COL_PRODUCT_DESCRIPTION = "Description";


}
