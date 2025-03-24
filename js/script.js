const productContainer = document.getElementById("products");//c'est le row
//const cartContainer = document.getElementById("cart");//le panier
const totalContainer = document.getElementById("total");// prix total
//const cartCount = document.getElementById("cart-count");//nombre d'articles

const clearCartButton = document.getElementById("clear-cart");//bouton vider le panier
let productshtml = [];//tableau de produits dans le html

let cart= JSON.parse(localStorage.getItem("cart"))||[];//stocke dans le tableau cart ou rien

let listCartHTML = document.querySelector('.listCart');//liste ul du panier
let listProductHTML = document.querySelector('.listeprduits');//liste des produits
let iconCartSpan = document.querySelector('.icon-cart span');//icone du nombre d'article en panier
let body = document.querySelector('body');

fetch("../produits.json")
.then(response => response.json())// convertit la reponse en json
.then( products => {
        products.forEach(product =>
        {
        productshtml.push(product)  ;//on rempli le tableau de produits
       console.log(cart.length);
        const productCard = document.createElement('div');
        productCard.classList.add("col-md-4");
        productCard.innerHTML = 
        `
        <div class="card shadow-lg mb-4"> 
            <img src="${product.img}" class="card-img-top img-fluid ${product.categorie} " alt="${product.nom}">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title py-2">${product.nom}</h5>
                <div.buttons class="d-flex justify-content-between align-items-center">
                    <button data-id="${product.id}" 
                            data-nom="${product.nom}"
                            data-prix="${product.prix}"
                            data-img ="${product.img}"
                            data-description = "${product.description}" 
                            data-categorie = "${product.categorie}" 
                            class="btn btn-primary voir-details me-1"  
                            data-bs-toggle="modal" 
                            data-bs-target="#productModal">Voir Détails 
                    </button>

                    <button data-id="${product.id}" 
                            data-nom="${product.nom}"
                            data-prix="${product.prix}$"
                            data-img ="${product.img}"
                            data-description = "${product.description}" 
                            data-categorie = "${product.categorie}" 
                            class="btn btn-primary add-to-cart ms-1">Ajouter au Panier 
                            
                    </button>  
                </div>      
            </div>
        </div>
        `;
        productContainer.appendChild(productCard);
       
      
        });//fin forEach
        addCartToHTML();

document.querySelectorAll('.voir-details').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const id = e.target.getAttribute("data-id");
            const nom = e.target.getAttribute("data-nom");
            const prix = e.target.getAttribute("data-prix");
            const description=e.target.getAttribute("data-description");
            const img=e.target.getAttribute("data-img");

            //fonction qui va gerer l'affichage des données
          showProductModal(id,nom,prix,img,description);
         

        });//fin addeventlistner
})//fin queryselector

document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        const id = e.target.getAttribute("data-id");
        addToCart(id);   
      
    });//fin addeventlistner
})//fin queryselector

//Ajout dans le tableau de panier
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id === product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();//afficher le tableau dans le modal de panier
    addCartToMemory();//enregistrer en localstorage le panier
}


const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}



//Ajouter les elements au panier



function addCartToHTML() {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let total = 0;
   
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
                     
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;           
            let positionProduct = productshtml.findIndex((value) => value.id == item.product_id);
            let info = productshtml[positionProduct];
            
            newItem.innerHTML = `
            <div class="imgCart">
                    <img src="${info.img}" class="img-fluid">
            </div>
                <div class="name">
                ${info.nom}
                </div>
                <div class="totalPrice">$${info.prix * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            total += `${info.prix}` * item.quantity;
            listCartHTML.appendChild(newItem);
            
       
           
        })
    totalContainer.textContent=total;
    iconCartSpan.innerText = totalQuantity;
    displayClearCartButton();
 
}//fin addcartohtml
//Pour specifier la fleche cliquée plus ou moins
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})

//mettre a jour la quantite des produits dans le panier
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
               info.quantity = info.quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}


document.querySelector('#clear-cart').addEventListener('click',()=>{
    
    if(confirm("Voulez vous vraiment vider votre panier?"))
        {
            clearCart();
        }

})



//affichage par categorie
const buttons = document.querySelectorAll('.categories button');

const cols = document.querySelectorAll('#products .col-md-4');

buttons.forEach(btn => 
{
btn.addEventListener('click',()=> {
    const categorie = btn.getAttribute('data-filter');
    console.log(categorie)
        cols.forEach(col => {
        const img =col.querySelector('.card-img-top');
        if(img)
        {
            if(categorie!=='all')
            {
                if(img.classList.contains(categorie))
                {
                   col.classList.remove('hide');
                    col.classList.add('show');
                }
                else
                {
                
                    col.classList.remove('show');
                    col.classList.add('hide');
                }
            }
            else{
                col.classList.add('show');
                col.classList.remove('hide');
            }
        }
                            });

                    });
});


//activer/desactiver bouton vider panier
function displayClearCartButton()
{
    if(cart.length > 0)
    {
clearCartButton.style.display="block";
    }
    else{
        clearCartButton.style.display = "none";
    }
}
function clearCart()
{
    cart=[];
    addCartToMemory();
    updateCart();
}
clearCartButton.addEventListener("click",()=>{
    if(confirm("Voulez vous vraiment vider votre panier?"))
    {
        clearCart();
    }
                                            });
function clearCart()
{
    cart=[];
    addCartToMemory();
    addCartToHTML();
}

})//fin du fetch
 




 function showProductModal(id,nom,prix,img,description)
{
    const modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = nom;
    modalTitle.style.fontWeight="bold";
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML= `<img src="${img}" class="img-fluid modal-img mb-3" alt="${nom}">
                          <p class="text-center fw-bold">Prix : ${prix}$</p>
                          <p class="text-center">Description : ${description}</p>    
                            `;
    /* const myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show(); */
}  


  //bouton retour en haut
  const boutonRetour = document.querySelector(".backUp");

window.addEventListener('scroll', () =>{

if(window.scrollY > 100) {

    boutonRetour.classList.add('display');
}
else {

    boutonRetour.classList.remove('display');
}
})

boutonRetour.addEventListener('click', () =>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})



//VALIDATION FORMULAIRE
function validateForm()
{

    function showError(input,message)
    {
        const feedBack = input.nextElementSibling;
        input.classList.add('is-invalid')//class bootstrap
        input.classList.remove('is-valid');
        feedBack.textContent = message;
    }

    function showSuccess(input)
    {
        const feedBack = input.nextElementSibling;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid')//class bootstrap
        feedBack.textContent = '';
    }


    let isValid = true;
    //validation du nom
    const nom = document.getElementById('nom');
    if(nom.value.trim()==="" ||nom.value.trim().length < 3 )
    {
        showError(nom,"Veuillez entrer votre nom composé minimum de 3 caractéres");
        isValid = false;
    }
    else
    {
        showSuccess(nom);
    }
    // validation du courriel
    const email= document.getElementById('email');
    const emailPattern =/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,3}$/;
    if(!emailPattern.test(email.value))
    {
        showError(email,"Veuillez entrer une adresse mail valide");
        isValid = false;
    }
    else
    {
        showSuccess(email);
    }

    //Validation du textArea
    const msg = document.getElementById('msg');
    if(msg.value.trim()===''|| msg.value.trim().length < 10)
    {
        showError(msg,"Veuillez saisir votre message composé minimum de 10 caractéres");
        isValid=false;
    }
    else
    {
        showSuccess(msg);
    }
 
return isValid;
}




document.addEventListener("DOMContentLoaded",function() 
{
const form = document.getElementById("signupForm");
    form.addEventListener('submit',function(e){
        e.preventDefault();//pour ne pas l'envoyer sans la validation
        if(validateForm())
        {
            setTimeout(function() {
                alert('Formulaire soumis avec succes !');
            }, 1000);
        form.reset(); 
        }
        
    })

}
)

