let users = [];
let memberships = [];
let restaurants = [];
let events = [];
let announcements = [];

let link = "https://psychic-guide-4j95wv9qvprqf575w-8500.app.github.dev";

async function loadJson(route) {
  let info = await fetch(link + route);
  return await info.json();
}

let usersRoute = "users";
let membershipsRoute = "memberships";
let restaurantsRoute = "restaurants";
let eventsRoute = "events";
let announcementsRoute = "announcements";
let analysisRoute = "analysis";

async function loadUsers() {
  let users = await (await fetch(link + usersRoute)).json();
  console.log(users);
}

async function loadMemberships() {
  let memberships = await (await fetch(link + membershipsRoute)).json();
  console.log(memberships);
}

async function loadRestaurants() {
  let restaurants = await (await fetch(link + restaurantsRoute)).json();
  console.log(restaurants);
}

async function loadEvents() {
  let events = await (await fetch(link + eventsRoute)).json();
  console.log(events);
}

async function loadAnnouncements() {
  let announcements = await (await fetch(link + announcementsRoute)).json();
  console.log(announcements);
}

async function loadAnalysis() {
  let analysis = await (await fetch(link + analysisRoute)).json();
  console.log(analysis);
}

function uniqueValues(arr){
  let out = [];
  for(let i = 0; i < arr.length; i++){
    if(out.indexOf(arr[i]) == -1){
      out[out.length] = arr[i];
    }
  }
  out.sort();
  return out;
}


function applyRestaurantFilters(){
  let search = document.getElementById("restaurant-search").value.trim().toLowerCase();
  let category = document.getElementById("restaurant-category").value;
  let location = document.getElementById("restaurant-location").value;
  let popularityValue = document.getElementById("restaurant-popularity").value;
  let sortValue = document.getElementById("restaurant-sort").value;
  let minMembers = 0;
  if(popularityValue != "all"){
    minMembers = Number(popularityValue || 0);
  }

  let filtered = [];
  for(let i = 0; i < restaurants.length; i++){
    let restaurant = restaurants[i];
    let nameMatch = restaurant.name.toLowerCase().indexOf(search) != -1;
    let categoryMatch = category == "all" || restaurant.category == category;
    let locationMatch = location == "all" || restaurant.location == location;
    let popularMatch = Number(restaurant.member_count) >= minMembers;
    if(nameMatch && categoryMatch && locationMatch && popularMatch){
      filtered[filtered.length] = restaurant;
    }
  }

  if(sortValue == "name"){
    filtered.sort(function(a, b){ return a.name.localeCompare(b.name); });
  } else if(sortValue == "events"){
    filtered.sort(function(a, b){ return Number(b.event_count) - Number(a.event_count); });
  } else {
    filtered.sort(function(a, b){ return Number(b.member_count) - Number(a.member_count); });
  }

  let grid = document.getElementById("restaurant-grid");
  let count = document.getElementById("restaurant-count");
  count.textContent = filtered.length + " restaurants";

  let cards = "";
  for(let i = 0; i < filtered.length; i++){
    let restaurant = filtered[i];
    cards += '<div class="restaurant-card">';
    cards += '<div class="restaurant-card-inner">';
    cards += '<div class="restaurant-card-face restaurant-card-front">';
    cards += '<div class="restaurant-badge">' + restaurant.category + '</div>';
    cards += '<h3>' + restaurant.name + '</h3>';
    cards += '<p class="restaurant-description">' + restaurant.description + '</p>';
    cards += '<div class="restaurant-meta">';
    cards += '<div>' + restaurant.member_count + ' members</div>';
    cards += '<div>' + restaurant.location + '</div>';
    cards += '</div></div>';
    cards += '<div class="restaurant-card-face restaurant-card-back">';
    cards += '<div class="restaurant-meet">' + restaurant.meeting_day + ' • ' + restaurant.meeting_time + '</div>';
    cards += '<p class="small-note">Contact: ' + restaurant.contact_email + '</p>';
    cards += '<p class="small-note">' + restaurant.event_count + ' upcoming events</p>';
    cards += '<a class="join-link" href="' + restaurant.join_url + '">Connect</a>';
    cards += '</div></div></div>';
  }

  grid.innerHTML = cards || '<p class="small-note">No restaurants match this filter.</p>';
}

async function renderHome(){
  restaurants = await loadJson("/restaurants");
  events = await loadJson("/events");
  announcements = await loadJson("/announcements");
  users = await loadJson("/users");
  memberships = await loadJson("/memberships");

  let totalRestaurants = restaurants.length;
  let totalMembers = users.length;
  let totalMemberships = memberships.length;
  let totalEvents = events.length;
  let topRestaurant = restaurants[0] || { name: "N/A", category: "" };

  for(let i = 1; i < restaurants.length; i++){
    if(Number(restaurants[i].member_count) > Number(topRestaurant.member_count)){
      topRestaurant = restaurants[i];
    }
  }

  let stats = "";
  stats += '<div class="stat-card"><p class="eyebrow">Restaurants</p><div class="stat-value">' + totalRestaurants + '</div><p class="small-note">Active groups on campus</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Members</p><div class="stat-value">' + totalMembers + '</div><p class="small-note">Students in the database</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Memberships</p><div class="stat-value">' + totalMemberships + '</div><p class="small-note">Restaurants joined by students</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Events</p><div class="stat-value">' + totalEvents + '</div><p class="small-note">Upcoming activities listed</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Top restaurant</p><div class="stat-value">' + topRestaurant.name + '</div><p class="small-note">' + topRestaurant.category + '</p></div>';
  document.getElementById("home-stats").innerHTML = stats;

  let eventList = "";
  for(let i = 0; i < events.length && i < 5; i++){
    let event = events[i];
    eventList += '<div class="event-row">';
    eventList += '<div class="event-title">' + event.name + '</div>';
    eventList += '<div class="small-note">' + event.restaurant_name + ' • ' + formatDate(event.date) + ' • ' + event.time + '</div>';
    eventList += '<div class="small-note">' + event.location + '</div>';
    eventList += '</div>';
  }
  document.getElementById("home-events").innerHTML = eventList;

  let announcementList = "";
  for(let i = 0; i < announcements.length && i < 5; i++){
    let item = announcements[i];
    let open = item.pinned == "1" || item.pinned == 1 ? " open" : "";
    announcementList += '<div class="announcement-row">';
    announcementList += '<details' + open + '>';
    announcementList += '<summary>' + item.title + '</summary>';
    announcementList += '<p class="small-note">' + item.restaurant_name + ' • ' + formatDate(item.posted_date) + '</p>';
    announcementList += '<p>' + item.message + '</p>';
    announcementList += '</details></div>';
  }
  document.getElementById("home-announcements").innerHTML = announcementList;
}

async function renderRestaurants(){
  restaurants = await loadJson("/Restaurants");

  let categoryList = [];
  let locationList = [];
  for(let i = 0; i < restaurants.length; i++){
    categoryList[categoryList.length] = restaurants[i].category;
    locationList[locationList.length] = restaurants[i].location;
  }
  let categories = uniqueValues(categoryList);
  let locations = uniqueValues(locationList);
  fillSelect(document.getElementById("restaurant-category"), categories);
  fillSelect(document.getElementById("restaurant-location"), locations);

  document.getElementById("restaurant-search").addEventListener("input", applyRestaurantFilters);
  document.getElementById("restaurant-category").addEventListener("change", applyRestaurantFilters);
  document.getElementById("restaurant-location").addEventListener("change", applyRestaurantFilters);
  document.getElementById("restaurant-popularity").addEventListener("change", applyRestaurantFilters);
  document.getElementById("restaurant-sort").addEventListener("change", applyRestaurantFilters);
  applyRestaurantFilters();
}

async function renderActivity(){
  summary = await loadJson("/analysis");
  restaurants = await loadJson("/restaurants");
  events = await loadJson("/events");
  memberships = await loadJson("/memberships");
  users = await loadJson("/users");

  let totalRestaurants = restaurants.length;
  let totalMembers = users.length;
  let totalMemberships = memberships.length;
  let totalEvents = events.length;
  let topCategory = summary[0] || { category: "N/A", restaurant_count: 0 };
  let maxMembers = 0;

  for(let i = 0; i < summary.length; i++){
    if(Number(summary[i].total_members) > Number(maxMembers)){
      maxMembers = summary[i].total_members;
      topCategory = summary[i];
    }
  }

  let stats = "";
  stats += '<div class="stat-card"><p class="eyebrow">Total restaurants</p><div class="stat-value">' + totalRestaurants + '</div><p class="small-note">Across all categories</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Total members</p><div class="stat-value">' + totalMembers + '</div><p class="small-note">Student records stored</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Total memberships</p><div class="stat-value">' + totalMemberships + '</div><p class="small-note">Joined restaurant records</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Total events</p><div class="stat-value">' + totalEvents + '</div><p class="small-note">Upcoming events listed</p></div>';
  stats += '<div class="stat-card"><p class="eyebrow">Top category</p><div class="stat-value">' + topCategory.category + '</div><p class="small-note">' + topCategory.restaurant_count + ' restaurants</p></div>';
  document.getElementById("activity-stats").innerHTML = stats;

  let breakdown = "";
  for(let i = 0; i < summary.length; i++){
    let item = summary[i];
    let width = maxMembers == 0 ? 0 : Math.round((item.total_members / maxMembers) * 100);
    breakdown += '<div class="bar-row">';
    breakdown += '<div class="bar-title">' + item.category + '</div>';
    breakdown += '<div class="small-note">' + item.restaurant_count + ' restaurants • ' + item.total_members + ' members • ' + item.total_events + ' events</div>';
    breakdown += '<div class="bar-track"><div class="bar-fill" style="width:' + width + '%"></div></div>';
    breakdown += '</div>';
  }
  document.getElementById("activity-breakdown").innerHTML = breakdown;

  let eventList = "";
  for(let i = 0; i < events.length && i < 6; i++){
    let event = events[i];
    eventList += '<div class="event-row">';
    eventList += '<div class="event-title">' + event.name + '</div>';
    eventList += '<div class="small-note">' + event.restaurant_name + ' • ' + formatDate(event.date) + ' • ' + event.time + '</div>';
    eventList += '<div class="small-note">' + event.location + '</div>';
    eventList += '</div>';
  }
  document.getElementById("activity-events").innerHTML = eventList;

  let membershipList = "";
  for(let i = 0; i < memberships.length && i < 6; i++){
    let item = memberships[i];
    membershipList += '<div class="event-row">';
    membershipList += '<div class="event-title">' + item.first_name + ' ' + item.last_name + '</div>';
    membershipList += '<div class="small-note">' + item.restaurant_name + ' • Joined ' + formatDate(item.joined_date) + '</div>';
    membershipList += '</div>';
  }
  document.getElementById("activity-memberships").innerHTML = membershipList;

  let galleryList = "";
  for(let i = 0; i < events.length && i < 4; i++){
    let event = events[i];
    galleryList += '<div class="gallery-card">';
    galleryList += '<div class="gallery-thumb"><img src="pic/' + event.featured_image + '.jpg" width="200" height="100" style="object-fit:cover; display:block; margin-bottom:4px;"></div>';
    galleryList += '<div class="gallery-title">' + event.name + '</div>';
    galleryList += '<div class="small-note">' + event.restaurant_name + '</div>';
    galleryList += '</div>';
  }
  document.getElementById("activity-gallery").innerHTML = galleryList;
}

async function renderAnalysis(){
  summary = await loadJson("/analysis");
  events = await loadJson("/events");
  memberships = await loadJson("/memberships");

  let maxMembers = 0;
  for(let i = 0; i < summary.length; i++){
    if(Number(summary[i].total_members) > Number(maxMembers)){
      maxMembers = summary[i].total_members;
    }
  }

  let stats = "";
  for(let i = 0; i < summary.length; i++){
    let item = summary[i];
    stats += '<div class="stat-card">';
    stats += '<p class="eyebrow">' + item.category + '</p>';
    stats += '<div class="stat-value">' + item.restaurant_count + ' restaurants</div>';
    stats += '<p class="small-note">' + item.total_members + ' members</p>';
    stats += '</div>';
  }
  document.getElementById("analysis-stats").innerHTML = stats;

  let breakdown = "";
  for(let i = 0; i < summary.length; i++){
    let item = summary[i];
    let width = maxMembers == 0 ? 0 : Math.round((item.total_members / maxMembers) * 100);
    breakdown += '<div class="bar-row">';
    breakdown += '<div class="bar-title">' + item.category + '</div>';
    breakdown += '<div class="small-note">' + item.restaurant_count + ' restaurants • ' + item.total_members + ' members • ' + item.total_events + ' events</div>';
    breakdown += '<div class="bar-track"><div class="bar-fill" style="width:' + width + '%"></div></div>';
    breakdown += '</div>';
  }
  document.getElementById("analysis-breakdown").innerHTML = breakdown;

  let eventList = "";
  for(let i = 0; i < events.length && i < 6; i++){
    let event = events[i];
    eventList += '<div class="event-row">';
    eventList += '<div class="event-title">' + event.name + '</div>';
    eventList += '<div class="small-note">' + event.restaurant_name + ' • ' + formatDate(event.date) + ' • ' + event.time + '</div>';
    eventList += '<div class="small-note">' + event.location + '</div>';
    eventList += '</div>';
  }
  document.getElementById("analysis-events").innerHTML = eventList;

  let membershipList = "";
  for(let i = 0; i < memberships.length && i < 6; i++){
    let item = memberships[i];
    membershipList += '<div class="event-row">';
    membershipList += '<div class="event-title">' + item.first_name + ' ' + item.last_name + '</div>';
    membershipList += '<div class="small-note">' + item.restaurant_name + ' • Joined ' + formatDate(item.joined_date) + '</div>';
    membershipList += '</div>';
  }
  document.getElementById("analysis-memberships").innerHTML = membershipList;

  let galleryList = "";
  for(let i = 0; i < events.length && i < 4; i++){
    let event = events[i];
    galleryList += '<div class="gallery-card">';
    galleryList += '<div class="gallery-thumb"><img src="pic/' + event.featured_image + '.jpg" width="200" height="100" style="object-fit:cover; display:block; margin-bottom:4px;"></div>';
    galleryList += '<div class="gallery-title">' + event.name + '</div>';
    galleryList += '<div class="small-note">' + event.restaurant_name + '</div>';
    galleryList += '</div>';
  }
  document.getElementById("analysis-gallery").innerHTML = galleryList;
}


