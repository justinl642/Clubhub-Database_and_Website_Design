
fetch("./restaurants.json")
    .then(response => response.json())
    .then(restaurants => {
        
      
        const container = document.getElementById("restaurant-container");
        
        
        let allCardsHTML = "";

        
        for (let i = 0; i < restaurants.length; i++) {
            let shop = restaurants[i];

            
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

       
        container.innerHTML = allCardsHTML;

    })
    .catch(error => {
        console.error("Error loading restaurants:", error);
    });
