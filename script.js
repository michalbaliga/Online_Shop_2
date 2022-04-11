let products = [];
let status = [];

document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector("#menu");
    var menuList = document.querySelector(".menu-list");
    menuButton.addEventListener("click", function () {
        var currentDisplayStyle = menuList.style.display;
        if (currentDisplayStyle === "block") {
            menuList.style.display = "none";
        } else {
            menuList.style.display = "block";
        }
    });
});

async function getProducts() {
    const res = await fetch('./products.json', { method: 'GET' })
    products = await res.json()
    console.log(products)
}

function showProducts() {
    const container = document.querySelector('.container');
    container.innerHTML =
        `${Object.values(products).map(el => typeof el === "object" ?

            `<div class='card'> 
    <div class='status-list'>${el.prod_status.split(",").map(v => v !== "" ? `<button id='full-status'>${v}</button>` : `<span id='empty'>empty</span>`)}</div>
    <div class='img'>
    <img alt='Miejsce na zdjęcie'></img>
    </div>
    <div class='details'>
    <span id='prod-name'>${el.prd_name}</span>
    <hr id="space"></hr>
    <span id='prod-price'>${el.prod_buy_price}</span>
    </div>
    </div>` : '').join("")
        }`;
}


function setStatus() {
    let allStatus = ['select'];
    for (i in products) {
        if (i !== 'response_code') {
            for (prodStatus of products?.[i]?.['prod_status']?.split(",")) {
                allStatus.push(prodStatus)
            }
        }
    }
    status = new Set(allStatus)
}

function generateSelect(value) {
    let myParent = document.querySelector('.nav-select');
    let check = true;

    if (check && !value) {
        let selectList = document.createElement('select')
        selectList.id = "mySelect";
        selectList.setAttribute("onChange", "getSelectedProducts()")
        myParent.appendChild(selectList);

        for (let i of status) {
            if (i !== '') {
                let option = document.createElement('option');
                option.value = i;
                option.text = i;
                selectList.appendChild(option)
            }
        }
        check = false;
    } console.log(check)
}

async function loading(check) {
    await getProducts()
    await showProducts()
    await setStatus()
    await generateSelect(check)

}

loading()

function getSelectedProducts() {
    getProducts()
    let result = [];
    const value = document.querySelector('#mySelect').value;

    for (i in products) {
        if (products[i]?.['prod_status']?.includes(value)) {
            result.push(products[i])
        }
    }
    if (value === 'select') loading(true)

    products = result
    showProducts()
}