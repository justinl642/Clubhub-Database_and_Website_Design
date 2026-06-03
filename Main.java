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
    Database db = new Database("jdbc:sqlite:club.db");

    String usersSQL =
      "SELECT id, osis, first_name, last_name, grade, email, clubs_joined " +
      "FROM users ORDER BY grade DESC, last_name ASC;";
    server.createContext("/users", new RouteHandler(db, usersSQL));


    //memberships
    String membershipsSQL =
      "SELECT m.id, u.first_name, u.last_name, c.name AS club_name, m.joined_date " +
      "FROM memberships m " +
      "INNER JOIN users u ON m.user_id = u.id " +
      "INNER JOIN clubs c ON m.club_id = c.id " +
      "ORDER BY m.joined_date DESC;";
    server.createContext("/memberships", new RouteHandler(db, membershipsSQL));


    //clubs
    String clubsSQL =
      "SELECT c.id, c.name, c.category, c.location, c.meeting_day, c.meeting_time, " +
      "c.description, c.member_count, c.image_file, c.contact_email, c.join_url, " +
      "COUNT(e.id) AS event_count " +
      "FROM clubs c " +
      "INNER JOIN events e ON c.id = e.club_id " +
      "GROUP BY c.id, c.name, c.category, c.location, c.meeting_day, c.meeting_time, " +
      "c.description, c.member_count, c.image_file, c.contact_email, c.join_url " +
      "ORDER BY c.member_count DESC;";
    server.createContext("/clubs", new RouteHandler(db, clubsSQL));


    //events
    String eventsSQL =
      "SELECT e.id, e.name, e.date, e.time, e.location, e.featured_image, " +
      "c.name AS club_name, c.category " +
      "FROM events e " +
      "INNER JOIN clubs c ON e.club_id = c.id " +
      "ORDER BY e.date ASC;";
    server.createContext("/events", new RouteHandler(db, eventsSQL));


    //announcements
    String announcementsSQL =
      "SELECT a.id, a.title, a.message, a.posted_date, a.pinned, c.name AS club_name " +
      "FROM announcements a " +
      "INNER JOIN clubs c ON a.club_id = c.id " +
      "ORDER BY a.pinned DESC, a.posted_date DESC;";
    server.createContext("/announcements", new RouteHandler(db, announcementsSQL));


    //analysis
    String analysisSQL =
      "SELECT c.category, COUNT(DISTINCT c.id) AS club_count, " +
      "SUM(c.member_count) AS total_members, COUNT(e.id) AS total_events " +
      "FROM clubs c " +
      "INNER JOIN events e ON c.id = e.club_id " +
      "GROUP BY c.category " +
      "ORDER BY total_members DESC;";
    server.createContext("/analysis", new RouteHandler(db, analysisSQL));
    
    //Start the server
    server.start();

    System.out.println("Server is listening on port "+port);
  }
}