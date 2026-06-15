fetch("./restaurants.json")
    .then(response => response.json())
    .then(restaurants => {
        
        const container = document.getElementById("restaurant-container");
        const searchInput = document.getElementById("search-bar");

        function renderCards(filterText) {
            let allCardsHTML = "";

            for (let i = 0; i < restaurants.length; i++) {
                let shop = restaurants[i];
                
                if (!shop || !shop.name) {
                    continue; 
                }

                let shopName = shop.name.toLowerCase();
                let shopCuisine = shop.cuisine_type ? shop.cuisine_type.toLowerCase() : "";
                let searchText = filterText.toLowerCase();

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
                            <p><strong>Cuisine:</strong> ${shop.cuisine_type || "N/A"}</p>
                            <p><strong>Address:</strong> ${shop.address || "N/A"}</p>
                            <p><strong>Rating:</strong> ⭐ ${shop.rating || "0"}</p>
                            <p class="${statusClass}">${statusText}</p>
                        </div>
                    `;
                }
            }
            
            container.innerHTML = allCardsHTML;
        }

        renderCards("");

        searchInput.addEventListener("input", (event) => {
            renderCards(event.target.value);
        });

    })
    .catch(error => {
        console.error("Error reading your restaurants.json data:", error);
    });
