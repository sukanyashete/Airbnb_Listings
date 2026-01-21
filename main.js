function MainModule(listingsID = "#listings") {
  const me = {};

  const listingsElement = document.querySelector(listingsID);

  function getListingCode(listing) {
    let amenitiesList = '';
    try {
      const amenitiesArray = JSON.parse(listing.amenities);
      amenitiesList = amenitiesArray.slice(0, 5).join(', ');
    } catch (e) {
      amenitiesList = 'Not available';
    }

    const cleanDescription = listing.description
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .substring(0, 200) + '...';

    return `<div class="col-lg-4 col-md-6 mb-4">
    <div class="listing card h-100">
      <img
        src="${listing.picture_url}"
        class="card-img-top"
        alt="${listing.name}"
        style="height: 250px; object-fit: cover;"
        onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'"
      />
      <div class="card-body">
        <h5 class="card-title">${listing.name}</h5>
        
        <!-- Host Info -->
        <div class="host-info d-flex align-items-center mb-3">
          <img 
            src="${listing.host_picture_url}" 
            alt="${listing.host_name}"
            class="rounded-circle me-2"
            style="width: 40px; height: 40px; object-fit: cover;"
            onerror="this.src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'"
          />
          <small class="text-muted">Hosted by ${listing.host_name}</small>
        </div>
        
        <!-- Price -->
        <p class="text-primary fw-bold fs-5">${listing.price} / night</p>
        
        <!-- Description -->
        <p class="card-text small">
          ${cleanDescription}
        </p>
        
        <!-- Amenities -->
        <div class="amenities mb-2">
          <strong class="small">Amenities:</strong>
          <small class="text-muted d-block">${amenitiesList}</small>
        </div>
        
        <a href="${listing.listing_url}" target="_blank" class="btn btn-primary btn-sm">See More</a>
      </div>
    </div>
  </div>`;
  }

  function redraw(listings) {
    listingsElement.innerHTML = "";
    // for (let i = 0; i < listings.length; i++) {
    //   listingsElement.innerHTML += getListingCode(listings[i]);
    // }

    // for (let listing of listings) {
    //   console.log("listing", listing );
    //   listingsElement.innerHTML += getListingCode(listing);
    // }

    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitReview');

    if (submitButton) {
      submitButton.addEventListener('click', function () {
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const rating = document.getElementById('userRating').value;
        const message = document.getElementById('userMessage').value;

        if (name && email && rating && message) {
          alert('Thank you ' + name + '! Your review has been submitted.');

          // Reset form
          document.getElementById('reviewForm').reset();

          // Close modal using Bootstrap's JavaScript API
          const modalElement = document.getElementById('reviewModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        } else {
          alert('Please fill out all fields!');
        }
      });
    }
  });


  async function loadData() {
    const res = await fetch("./airbnb_sf_listings_500.json");
    const listings = await res.json();

    const first50 = listings.slice(0, 50);

    // Calculate price range
    const prices = first50.map(listing => parseFloat(listing.price.replace('$', '').replace(',', '')));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Update the stats display
    document.getElementById('listing-count').textContent = first50.length;
    document.getElementById('price-range').textContent = `$${minPrice} - $${maxPrice}`;

    me.redraw(first50);
  }

  me.redraw = redraw;
  me.loadData = loadData;

  return me;
}

const main = MainModule();
main.loadData();