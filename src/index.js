let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Step 1: Fetch Andy's Toys
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    })
    .catch(error => console.error("Error fetching toys:", error));

  // Step 2: Render Toy Function
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.id = toy.id;
    likeBtn.textContent = "Like ❤️";
    likeBtn.addEventListener("click", () => likeToy(toy.id)); // Step 4: Like Button Event Listener

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(likeBtn);

    toyCollection.appendChild(card);
  }

  // Step 3: Add Toy Form Submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0 // Initial likes count for a new toy
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newToy => {
        renderToy(newToy); // Render the new toy card
      })
      .catch(error => console.error("Error creating toy:", error));

    toyForm.reset();
  });

  // Step 4: Like Toy Function
  function likeToy(toyId) {
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: parseInt(document.getElementById(toyId).previousElementSibling.textContent) + 1
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        document.getElementById(toyId).previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error liking toy:", error));
  }
});

