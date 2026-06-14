// 1. Fetch the static JSON data file
fetch("./restaurants.json")
    .then(response => response.json())
    .then(restaurants => {
        
        // Find the container container in the HTML
        const container = document.getElementById("restaurant-container");
        
        // This variable will hold all of our card HTML blocks
        let allCardsHTML = "";

        // 2. Loop through each restaurant inside your list using a simple loop
        for (let i = 0; i < restaurants.length; i++) {
            let shop = restaurants[i];

            // Setup a simple if-statement to handle the Open/Closed text and styling
            let statusText = "Closed";
            let statusClass = "closed";
            
            if (shop.is_open_now === true) {
                statusText = "Open Now";
                statusClass = "open";
            }

            // 3 & 4. Build the HTML block for this specific card
            allCardsHTML += `
                <div class="restaurant-card">
                    <h3>${shop.name}</h3>
                    <p><strong>Cuisine:</strong> ${shop.cuisine_type}</p>
                    <p><strong>Address:</strong> ${shop.address}</p>
                    <p><strong>Rating:</strong> ⭐ ${shop.rating}</p>
                    <p class="${statusClass}">${statusText}</p>
                </div>
            `;
        }

        // 5. Inject all the generated cards directly into your container without using append
        container.innerHTML = allCardsHTML;

    })
    .catch(error => {
        console.error("Error loading restaurants:", error);
    });
