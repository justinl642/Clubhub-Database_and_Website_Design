
// 1. Fetch the static restaurant data from your folder
fetch("./restaurants.json")
    .then(response => response.json())
    .then(restaurants => {
        
        const container = document.getElementById("restaurant-container");
        const searchInput = document.getElementById("search-bar");

        // 2. Build a clear function to generate card layouts dynamically
        function renderCards(filterText) {
            let allCardsHTML = "";

            for (let i = 0; i < restaurants.length; i++) {
                let shop = restaurants[i];
                
                // Convert text parameters to lowercase to eliminate capitalization typos
                let shopName = shop.name.toLowerCase();
                let shopCuisine = shop.cuisine_type.toLowerCase();
                let searchText = filterText.toLowerCase();

                // Check if the query matches either the restaurant name OR the cuisine type
                if (searchText === "" || shopName.includes(searchText) || shopCuisine.includes(searchText)) {
                    
                    let statusText = "Closed";
                    let statusClass = "closed";
                    
                    if (shop.is_open_now === true) {
                        statusText = "Open Now";
                        statusClass = "open";
                    }

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
            }
            
            // Set the filtered card outputs to display inside our page div
            container.innerHTML = allCardsHTML;
        }

        // 3. Populate all cards immediately when loading up the page
        renderCards("");

        // 4. Update the card grid instantly as you type into the search bar
        searchInput.addEventListener("input", (event) => {
            renderCards(event.target.value);
        });

    })
    .catch(error => {
        console.error("Error reading your restaurants.json data:", error);
    });

