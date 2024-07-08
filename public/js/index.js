
//ACA VA TODO LO que necesita escuhar o enviar el front y trae el DOM
const socket= io();

const productList = document.getElementById ("productList");
const addForm= document.getElementById("addForm");
const title= document.getElementById ("title");
const price= document.getElementById ("price");
const description= document.getElementById ("description");
const deleteForm= document.getElementById("deleteForm")
socket.on ("products", (data)=>{
    console.log(data);
// Antes de traer cualquier tipo de producto
//primero nos aseguramos que si habia algo en el dom, lo borre y quede limpio
//porque si no lo limpio, me trae los 5 productos que tenia en el array y me sobreescribe el nuevo
productList.innerHTML="";

//For each de la data que tenemos (cada elemento de nuestro array es un product)
data.forEach(product => {
    const card= document.createElement("div");
    card.classList.add ("card");
    card.innerHTML= `<div class="card-body">
        <h5 class="card-title">${product.title}</h5>
         <p class="card-text">${product.id}</p>
        <p class="card-text">${product.description}</p>
        <p class="card-text">${product.price}</p>
      </div>`;
      productList.appendChild(card);
});
});

//Aca estamos enviando lo que escribimos al backend
addForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  //fetch es una función que se utiliza para hacer peticiones HTTP. En este caso, estamos haciendo una petición POST al endpoint /realtimeproducts.
    await fetch("/realtimeproducts", {
      method: "POST",
    // Indicar que el cuerpo de la petición es JSON.
      headers: {
        "Content-Type": "application/json",
      },
    // El cuerpo de la petición es un JSON que contiene los valores de los campos del formulario (title, price, description). 
    //JSON.stringify convierte un objeto JavaScript en una cadena JSON.
      body: JSON.stringify({ title: title.value, price: price.value, description: description.value }),
    });
  });
  
  deleteForm.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const id= document.getElementById("deleteId");
    console.log(id);
    await fetch ("realtimeproducts", {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({id:id.value}),
    });

  })