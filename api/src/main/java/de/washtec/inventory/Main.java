package de.washtec.inventory;

import com.google.gson.Gson;
import org.apache.log4j.Logger;

import javax.naming.AuthenticationException;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Hashtable;

import static spark.Spark.*;

public class Main {

    // Logger zum Schreiben in die Console sowie Speichern in eine Datei (siehe log4j.properties)
    private static final Logger logger = Logger.getLogger(Main.class);

    public static void main(String[] args) {

        // gson Instanz für JSON
        Gson gson = new Gson();
        // Port setzen
        port(Config.PORT);
        // Cross-Origin für alle Seiten zulassen
        initCors("*", "*", "*");

        post("/authenticate", (request, response) -> {
            return null;
        }, gson::toJson);

        get("/items", (request, response) -> {
            return null;
        }, gson::toJson);

        post("/items", (request, response) -> {
            return null;
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

}
