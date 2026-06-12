import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

//For compiling on the shell on repl: Same on mac
//javac -cp sqlite-jdbc-3.23.1.jar: Main.java
//java -cp sqlite-jdbc-3.23.1.jar: Main

//Use for windows
//javac -cp sqlite-jdbc-3.23.1.jar; Main.java
class Main {
  public static void main(String[] args) throws IOException{
    (new Main()).init();
  }

  void print(Object o){System.out.println(o);}
  void printt(Object o){System.out.print(o);}

  void init() throws IOException{
    // create a port - our Gateway
    int port = 8500;

    //create the HTTPserver object
    HttpServer server = HttpServer.create(new InetSocketAddress(port),0);

    //create the database object
    Database db = new Database("jdbc:sqlite:restaurant.db");

    // Users
String usersSQL = "SELECT * FROM users";
server.createContext("/users", new RouteHandler(db, usersSQL));

// Memberships
String membershipsSQL = "SELECT * FROM memberships";
server.createContext("/memberships", new RouteHandler(db, membershipsSQL));

// Restaurants
String restaurantsSQL = "SELECT * FROM restaurants";
server.createContext("/restaurants", new RouteHandler(db, restaurantsSQL));

// Promotions
String promotionsSQL = "SELECT * FROM promotions";
server.createContext("/promotions", new RouteHandler(db, promotionsSQL));

// Announcements
String announcementsSQL = "SELECT * FROM announcements";
server.createContext("/announcements", new RouteHandler(db, announcementsSQL));

// Analysis
String analysisSQL =
    "SELECT category, member_count FROM restaurants";
server.createContext("/analysis", new RouteHandler(db, analysisSQL));
    
    //Start the server
    server.start();

    System.out.println("Server is listening on port "+port);
  }
}