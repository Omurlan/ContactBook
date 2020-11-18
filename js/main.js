let nameInp = $('.name-input'),
    surnameInp = $('.surname-input'),
    numInp = $('.number-input'),
    btnAdd = $('.btn'),
    contacts = $('.contacts'),
    page = 1,
    itemCount = 1,
    pageCount = 1,
    searchValue = '';



function getPagination() {
    fetch('http://localhost:3000/contacts')
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 4);
            $('.pagination-page').remove()
            for (let i = pageCount; i >= 1; i--) {
                console.log(i)
                $('.previous-btn').after(`
                <span class="pagination-page">
                <button class="links" alt="....">
                ${i}
                </button>
                </span>
                `)
            }
        });
}
$('.search').on('input', function(event) {
    
    searchValue = event.target.value
    render();
})

$('body').on('click', '.links', (e) => {
    console.log(e.target.innerText)
    page = e.target.innerText
    render()
})

btnAdd.on('click', function () {
    if (!nameInp.val().trim() || !surnameInp.val().trim() || !numInp.val().trim()) {
        alert('Заполните поля');
    }
    let newInfo = {
        name: nameInp.val(),
        surname: surnameInp.val(),
        number: numInp.val()
    }
    postNewInfo(newInfo);
    nameInp.val('');
    surnameInp.val('');
    numInp.val('');
    render()
})

function postNewInfo(newInfo) {
    fetch('http://localhost:3000/contacts', {
        method: "POST",
        body: JSON.stringify(newInfo),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
}



function render() {
    fetch(`http://localhost:3000/contacts?_page=${page}&_limit=4&q=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            getPagination()
            contacts.html('');
            data.forEach(item => {
                contacts.append(`<li id="${item.id}">${item.name} ${item.surname} ${item.number}<button class="btn-delete">Удалить</button><button class="btn-edit">Редактировать</button></li>`)
            })
        })
}


$('body').on('click', '.btn-delete', function (event) {
    let id = (event.currentTarget.parentElement.id);
    fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'DELETE'
    })
        .then(() => render())
})
$('body').on('click', '.btn-edit', function (event) {
    let id = (event.target.parentNode.id);
    fetch(`http://localhost:3000/contacts/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            $('.inp-edit').val(data.name);
            $('.inp-edit2').val(data.surname);
            $('.inp-edit3').val(data.number);
            $('.btn-save').attr('id', id);
            $('.main-modal').css('display', 'block');
        })
})
$('.btn-save').on('click', function (event) {
    let id = event.target.id
    console.log(id)
    let newName = $('.inp-edit').val();
    let newSurname = $('.inp-edit2').val();
    let newNumber = $('.inp-edit3').val();
    let newValues = {
        name: newName,
        surname: newSurname,
        number: newNumber
    }
    fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newValues),
        headers: { 'Content-type': 'application/json' }
    })
        .then(() => {
            render()
            $('.main-modal').css('display', 'none');
        })
})
$('.btn-closer').on('click', function() {
    $('.main-modal').css('display', 'none');
})
$('.next-btn').on('click', function () {
    if (page >= pageCount) return;
    page++;
    render();
})
$('.previous-btn').on('click', function () {
    if (page <= 1) return;
    page--;
    render();
})


// });
render();


