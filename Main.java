import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.sql.*;

import java.net.InetSocketAddress;
import java.util.Map;

// javac -cp sqlite-jdbc-3.36.0.3.jar: Main.java
// java -cp sqlite-jdbc-3.36.0.3.jar: Main
class Main {

 public static void main(String[] args)throws IOException{
    (new Main()).init();
  }


  void print(Object o){ System.out.println(o);}
  void printt(Object o){ System.out.print(o);}

  void init() throws IOException{

    // create a port - our Gateway
    int port = 8500;
      
    //create the HTTPserver object
    HttpServer server = HttpServer.create(new InetSocketAddress(port),0);

    // create the database object
    Database db = new Database("jdbc:sqlite:Clubhub.db");

    server.createContext("/", new RouteHandler("index.html", true));
    server.createContext("/index.html", new RouteHandler("index.html", true));
    server.createContext("/clubs.html", new RouteHandler("clubs.html", true));
    server.createContext("/activity.html", new RouteHandler("activity.html", true));
    server.createContext("/about.html", new RouteHandler("about.html", true));
    server.createContext("/style.css", new RouteHandler("style.css", true));
    server.createContext("/script.js", new RouteHandler("script.js", true));


    //Start the server
    server.start();

    System.out.println("Server is listening on port "+port);
       
      
    }    
}


