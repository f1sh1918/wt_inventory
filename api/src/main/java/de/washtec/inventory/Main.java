package de.washtec.inventory;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.Gson;
import de.washtec.inventory.helper.*;
import de.washtec.inventory.response.RAuth;
import de.washtec.inventory.response.RCostcenter;
import de.washtec.inventory.response.RProduct;
import org.apache.log4j.Logger;
import spark.Request;
import spark.Response;

import javax.naming.AuthenticationException;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.io.UnsupportedEncodingException;
import java.sql.*;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import static spark.Spark.*;

public class Main {

    // Logger zum Schreiben in die Console sowie Speichern in eine Datei (siehe log4j.properties)
    private static final Logger logger = Logger.getLogger(Main.class);
    private static final String UID = "UID";
    // Caching
    private static List<Costcenter> COSTCENTERS;
    private static List<Product> PRODUCTS;
    public static void main(String[] args) {



        // Costcenter cachen
        COSTCENTERS = getCostcenters();
        PRODUCTS = getProducts();
        // gson Instanz für JSON
        Gson gson = new Gson();
        // Port setzen
        port(Config.PORT);
        // Cross-Origin für alle Seiten zulassen
        initCors("*", "*", "*");

        post("/authenticate", (request, response) -> {

            Auth auth = null;
            boolean error = false;

            try {

                auth = gson.fromJson(request.body(), Auth.class);
                auth.username = auth.username.toLowerCase().trim();

            } catch (Exception e) {
                logger.error(e.getMessage());
                error = true;
            }

            if (auth == null || error) {
                halt(Config.BAD_REQUEST);
            }

            if (!validateLogin(auth.username, auth.password)) {
                halt(Config.UNAUTHORIZED);
            }

            String token = null;

            try {

                // Token mit HMAC256 erstellen
                Algorithm algorithm = Algorithm.HMAC256(Config.JWT_SECRET);

                token = JWT.create()
                        .withIssuer(Config.JWT_ISSUER)
                        .withIssuedAt(new java.util.Date())
                        .withSubject(Config.JWT_SUBJECT)
                        .sign(algorithm);

            } catch (UnsupportedEncodingException | JWTCreationException exception) {
                error = true;
            }

            // Bei einem Fehler abbrechen
            if (error) {
                halt(Config.SERVER_ERROR);
            }

            // Datenbank Variablen anlegen
            Connection connection = null;
            PreparedStatement statement = null;

            // Token in Datenbank schreiben
            try {

                // Treiber finden
                Class.forName("org.postgresql.Driver");
                // Verbindung aufbauen
                connection = DriverManager.getConnection("jdbc:postgresql://" + Config.APP_HOST + "/" + Config.APP_DATABASE, Config.APP_USERNAME, Config.APP_PASSWORD);
                // Nicht automatisch commiten
                connection.setAutoCommit(false);

                // Neues Token in Datenbank einfügen
                statement = connection.prepareStatement("INSERT INTO \"" + Config.TABLE_TOKEN + "\" (\"" +
                        Config.COL_TOKEN_ACCOUNT + "\", \"" +
                        Config.COL_TOKEN_DESCRIPTION + "\", \"" +
                        Config.COL_CMDB_ACTIVE + "\", \"" +
                        Config.COL_ASSET_CREATED + "\") VALUES (?, ?, ?, NOW())");

                // Parameter setzen
                statement.setString(1, auth.username);
                statement.setString(2, token);
                statement.setBoolean(3, Config.CMDB_ACTIVE);

                // Datensatz einfügen und commiten
                statement.executeUpdate();
                connection.commit();

            } catch (Exception e) {
                logger.error(e.getMessage());
                error = true;
            } finally {
                // Verbindung schließen
                closeConnection(connection, statement, null);
            }

            // Bei einem Fehler abbrechen
            if (error) {
                halt(Config.SERVER_ERROR);
            }


            auth.password = null;
            auth.authToken = token;

            // Rückgabe des neu generierten Tokens
            logger.info("[AUTH] account: " + auth.username + ", token: " + auth.authToken);
            response.status(Config.CREATED);
            response.type("application/json");
            return new RAuth(auth);

        }, gson::toJson);

        get("/costcenters", (request, response) -> {
            // Prüfen ob Token gültig ist
           if (!validateRequest(request, response)) {
                halt(Config.UNAUTHORIZED);
            }

            // Bei einem Fehler abbrechen
            if (COSTCENTERS == null) {
                halt(Config.SERVER_ERROR);
            }

            // Liste zurückgeben
            logger.info("SEND COSTCENTERS (count: " + COSTCENTERS.size() + ")");
            // Status der Antwort setzen
            response.status(Config.OK);
            return new RCostcenter(COSTCENTERS);
        }, gson::toJson);

        get("/products", (request, response) -> {
            // Prüfen ob Token gültig ist
            if (!validateRequest(request, response)) {
                halt(Config.UNAUTHORIZED);
            }

            // Bei einem Fehler abbrechen
            if (PRODUCTS == null) {
                halt(Config.SERVER_ERROR);
            }

            // Liste zurückgeben
            logger.info("SEND PRODUCTS (count: " + PRODUCTS.size() + ")");
            // Status der Antwort setzen
            response.status(Config.OK);
            return new RProduct(PRODUCTS);
        }, gson::toJson);

        post("/transaction", (request, response) -> {
            if (!validateRequest(request, response)) {
                halt(Config.UNAUTHORIZED);
            }
            Transaction transaction= null;
            boolean error = false;
            try {

                transaction = gson.fromJson(request.body(), Transaction.class);

            } catch (Exception e) {
                logger.error(e.getMessage());
                error = true;
            }
            if (transaction == null || error) {
                halt(Config.BAD_REQUEST);
            }
          for (Asset asset:transaction.data)  {

              // Datenbank Variablen anlegen
              Connection connection = null;
              PreparedStatement statement = null;


              try {

                  // Treiber suchen
                  Class.forName("org.postgresql.Driver");
                  // Verbindung aufbauen
                  connection = DriverManager.getConnection("jdbc:postgresql://" + Config.CMDB_HOST + "/" + Config.CMDB_DATABASE, Config.CMDB_USERNAME, Config.CMDB_PASSWORD);

                  // Token mit übergebener ID auswählen
                  statement = connection.prepareStatement("INSERT INTO \"" + Config.TABLE_TRANSACTION +
                          "\" ( \"" +
                          Config.COL_ASSET_CREATED + "\", \"" +
                          Config.COL_CMDB_CISTATE + "\", \"" +
                          Config.COL_TRANSACTION_AMOUNT + "\", \"" +
                          Config.COL_TRANSACTION_COSTCENTER + "\", \"" +
                          Config.COL_TRANSACTION_PRODUCT + "\", \"" +
                                  Config.COL_TRANSACTION_USERNAME + "\", \"" +
                                  Config.COL_TRANSACTION_PRICE + "\", \"" +
                          Config.COL_TRANSACTION_TRANSFERED + "\") VALUES (NOW(),?,?,?,(SELECT \"" +
                          Config.COL_PRODUCT_ID  + "\" from \"" +
                                  Config.TABLE_PRODUCT + "\" WHERE \"" +
                                  Config.COL_PRODUCT_DESCRIPTION  + "\" = ? AND \""+Config.COL_CMDB_STATUS+"\"=?),?,?,? )"
                          );


                  // Parameter setzen
                  statement.setInt(1, Config.CMDB_CISTATE);
                  statement.setInt(2, asset.amount);
                  statement.setInt(3, asset.costcenterId);
                  statement.setString(4, asset.barcode);
                  statement.setString(5, Config.CMDB_STATUS);
                  statement.setString(6, request.attribute(UID));
                  statement.setFloat(7, asset.price);
                  statement.setInt(8, Config.CMDB_TRANSACTION_TRANSFERED);

              statement.execute();
                  logger.info("[TRANSACTION] : "+ asset.barcode +" by " + request.attribute(UID) + " was sent");


              } catch (Exception e) {
                  logger.error(e.getMessage());
                  error = true;

              } finally {
                  // Verbindung schließen
                  closeConnection(connection, statement, null);
              }

          }
          return error;
        }, gson::toJson);

    }

    // Prüfen ob es sich um gültige LDAP Credentials (ad@washtec.domain) handelt
    private static boolean validateLogin(String username, String password) {

        // Nutzername um washtec domain erweitern
        username = username + "@washtec";

        // Umgebungsvariablen für LDAP Verbindung setzen
        Hashtable<String, String> env = new Hashtable<>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, "ldap://" + Config.LDAP_HOST + ":" + Config.LDAP_PORT);
        env.put(Context.SECURITY_AUTHENTICATION, Config.LDAP_AUTH_LEVEL);
        env.put(Context.SECURITY_PRINCIPAL, username);
        env.put(Context.SECURITY_CREDENTIALS, password);

        DirContext ctx;
        try {
            // Verbindung aufbauen
            ctx = new InitialDirContext(env);
            // Verbindung schließen
            ctx.close();
            logger.info("[LDAP] valid: " + username);
            // Da kein Fehler -> erfolgreicher Login
            return true;
        } catch (AuthenticationException e) {
            logger.error(e.getMessage());
            logger.error("[LDAP] no_auth: " + username);
        } catch (NamingException e) {
            logger.error(e.getMessage());
            logger.error("[LDAP] naming: " + username);
        } catch (Exception e) {
            logger.error(e.getMessage());
            logger.error("[LDAP] exception: " + username);
        }

        // Da Fehler -> kein erfolgreicher Login
        return false;

    }

    // Initialisiert Cross-Origin Resource Sharing
    private static void initCors(final String origin, final String methods, final String headers) {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });
        before((request, response) -> {
            response.header("Server", "Jetty");
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
        });
    }

    // Verbindung schließen
    private static void closeConnection(Connection connection, Statement statement, ResultSet resultSet) {
        try {
            // ResultSet schließen
            if (resultSet != null) {
                resultSet.close();
            }
            // Statement schließen
            if (statement != null) {
                statement.close();
            }
            // Verbindung schließen
            if (connection != null) {
                connection.close();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    // Prüft ein Token auf Gültigkeit
    private static String validateToken(String token) {

        // Datenbank Variablen anlegen
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        // Mit null initialisieren, falls später kein Wert gefunden
        String result = null;

        try {

            // Treiber suchen
            Class.forName("org.postgresql.Driver");
            // Verbindung aufbauen
            connection = DriverManager.getConnection("jdbc:postgresql://" + Config.APP_HOST + "/" + Config.APP_DATABASE, Config.APP_USERNAME, Config.APP_PASSWORD);

            // Token mit übergebener ID auswählen
            statement = connection.prepareStatement("SELECT \"" + Config.COL_TOKEN_ACCOUNT +
                    "\" FROM \"" +
                    Config.TABLE_TOKEN + "\" WHERE \"" +
                    Config.COL_TOKEN_DESCRIPTION + "\" = ? AND \"" +
                    Config.COL_CMDB_ACTIVE + "\" = ? AND \"" +
                    Config.COL_CMDB_STATUS + "\" = ?");

            // Parameter setzen
            statement.setString(1, token);
            statement.setBoolean(2, Config.CMDB_ACTIVE);
            statement.setString(3, Config.CMDB_STATUS);

            // Ergebnis in ResultSet zwischenspeichern
            resultSet = statement.executeQuery();

            // Falls ein Eintrag vorhanden -> ID, Land, IsExternal holen
             if (resultSet.next()) {
                 result = resultSet.getString(Config.COL_TOKEN_ACCOUNT);

            }


        } catch (Exception e) {
            logger.error(e.getMessage());
            result = null;
        } finally {
            // Verbindung schließen
            closeConnection(connection, statement, resultSet);
        }

        // Ergebnis zurückgeben
        return result;

    }

    // Prüft ob es sich um eine authorisierte Anfrage handelt
    private static boolean validateRequest(Request request, Response response) {

        // Prüfen ob Authorization Header vorhanden
        if (request.headers("Authorization") == null || request.headers("Authorization").isEmpty()) {
            return false;
        }

        // JWT anlegen
        DecodedJWT jwt;

        // Prüfen ob es sich um ein unverfälschtes Token handelt
        try {

            Algorithm algorithm = Algorithm.HMAC256(Config.JWT_SECRET);

            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(Config.JWT_ISSUER)
                    .withSubject(Config.JWT_SUBJECT)
                    .build();

            jwt = verifier.verify(request.headers("Authorization"));

        } catch (UnsupportedEncodingException | JWTVerificationException exception) {
            jwt = null;
        }

        if (jwt == null) {
            return false;
        }

        // Prüfen ob es sich um ein gültiges Token handelt
        String result = validateToken(jwt.getToken());

        // Bei Fehler oder ungültigem Token -> beenden
        if (result == null) {
            return false;
        }



        // Typ der Antwort setzen
        response.type("application/json");
        // Benutzer-ID in Request hinterlegen
        request.attribute(UID, result);
        // Land des Accounts hinterlegen

        return true;

    }

    private static List<Costcenter> getCostcenters() {

        // Datenbank Variablen sowie Liste für Mitarbeiter anlegen
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        List<Costcenter> costcenters = new ArrayList<>();

        try {

            // Treiber suchen
            Class.forName("org.postgresql.Driver");
            // Verbindung aufbauen
            connection = DriverManager.getConnection("jdbc:postgresql://" + Config.CMDB_HOST + "/" + Config.CMDB_DATABASE, Config.CMDB_USERNAME, Config.CMDB_PASSWORD);

            // Mitarbeiterdaten auslesen
            statement = connection.prepareStatement("SELECT \"" + Costcenter.COL_COSTCENTER_ID + "\", \"" +
                    Costcenter.COL_COSTCENTER_KSTNR + "\", \"" +
                    Costcenter.COL_COSTCENTER_DESCRIPTION + "\" FROM \"" +
                    Costcenter.TABLE_COSTCENTER + "\" WHERE \"" +
                    Config.COL_CMDB_CISTATE + "\" = ? AND \"" +
                    Config.COL_CMDB_STATUS + "\" = ? ORDER BY \""+Costcenter.COL_COSTCENTER_KSTNR+"\"");

            // Parameter setzen
            statement.setInt(1, Config.CMDB_CISTATE);
            statement.setString(2, String.valueOf(Config.CMDB_STATUS));


            // Ergebnis in ResultSet zwischenspeichern
            resultSet = statement.executeQuery();

            // Durch Ergebnis loopen und je einen neuen Nutzer zur Liste hinzufügen
            while (resultSet.next()) {
                int id = resultSet.getInt(Costcenter.COL_COSTCENTER_ID);
                String kstnr = resultSet.getString(Costcenter.COL_COSTCENTER_KSTNR);
                String description = resultSet.getString(Costcenter.COL_COSTCENTER_DESCRIPTION);
                costcenters.add(new Costcenter(id, kstnr,description));
            }

        } catch (Exception e) {
            logger.error(e.getMessage());
        } finally {
            // Verbindung schließen
            closeConnection(connection, statement, resultSet);
        }

        return costcenters;

    }

    private static List<Product> getProducts() {

        // Datenbank Variablen sowie Liste für Mitarbeiter anlegen
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        List<Product> products = new ArrayList<>();

        try {

            // Treiber suchen
            Class.forName("org.postgresql.Driver");
            // Verbindung aufbauen
            connection = DriverManager.getConnection("jdbc:postgresql://" + Config.CMDB_HOST + "/" + Config.CMDB_DATABASE, Config.CMDB_USERNAME, Config.CMDB_PASSWORD);

            // Mitarbeiterdaten auslesen
            statement = connection.prepareStatement("SELECT \"" + Product.COL_PRODUCT_BARCODE + "\", \"" +
                    Product.COL_PRODUCT_AMOUNT + "\" FROM \"" +
                    Product.TABLE_PRODUCT + "\" WHERE \"" +
                    Config.COL_CMDB_CISTATE + "\" = ? AND \"" +
                    Config.COL_CMDB_STATUS + "\" = ? ORDER BY \""+Product.COL_PRODUCT_BARCODE+"\"");

            // Parameter setzen
            statement.setInt(1, Config.CMDB_CISTATE);
            statement.setString(2, String.valueOf(Config.CMDB_STATUS));


            // Ergebnis in ResultSet zwischenspeichern
            resultSet = statement.executeQuery();

            // Durch Ergebnis loopen und je einen neuen Nutzer zur Liste hinzufügen
            while (resultSet.next()) {
                String barcode = resultSet.getString(Product.COL_PRODUCT_BARCODE);
                int amount = resultSet.getInt(Product.COL_PRODUCT_AMOUNT);
                products.add(new Product(barcode,amount));
            }

        } catch (Exception e) {
            logger.error(e.getMessage());
        } finally {
            // Verbindung schließen
            closeConnection(connection, statement, resultSet);
        }

        return products;

    }


}
