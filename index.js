//Different lists for todo's
// list will have items and price
class List {
    constructor(listName){
        this.listName = listName;
        this.listOfAllItems = [];
        //add id to list
    }
    addListItem(item, price){
        this.listOfAllItems.push(new Items(item, price));
    }
}

class Items{
    constructor(item, price){
        this.item = item;
        this.price = price;
        //add id to item
    }
}

//API calls
//get request
//console.log
class ListService {
    static url = "https://64092d096ecd4f9e18aa1900.mockapi.io/ShoppingList/";

    static getAllLists() {
        return $.get(this.url);
    }

    static getList(id){
        return $.get(this.url + `/${id}`);
    }

    static createList(listName){
        return $.post(this.url, listName);
    }

    static updateList(list){

            return $.ajax({
            url: this.url + `/${list.id}`,
            dataType: 'json',
            data: JSON.stringify(list),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteList(id){ //not getting the id
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static lists;

    static getAllLists(){
        ListService.getAllLists().then(lists => this.render(lists));
    }
    static deleteList(id){
        ListService.deleteList(id)
        .then(() => {
            return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }

    static createList(listName){
        ListService.createList(new List(listName))
        .then(() => {
            return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }

    static addListItem(id){
        for (let list of this.lists){
            // console.log(list + 'add items stuff')
            if(list.id == id){
                // console.log(list.id)
                list.listOfAllItems.push(new Items($(`#${list.id}-item-name`).val(), $(`#${list.id}-item-price`).val()));
                ListService.updateList(list)
                .then(() => {
                    return ListService.getAllLists();
                })
                .then((lists) => this.render(lists));
            }
            
        }
    }

    static deleteItem(listId, itemId){
        for (let list of this.lists){
            console.log(list)
            if(list.id == listId){
                console.log(list.id, listId, "Matching? Yes then move on")
                for (let item of list.listOfAllItems){
                    console.log(item)
                    if (item.id == itemId){ //!not getting itemId
                        console.log(item.id,'matching?' ,itemId)
                        list.listOfAllItems.splice(list.listOfAllItems.indexOf(item), 1);
                        console.log('delete items')
                        ListService.updateList(list)
                        .then(() => {
                            return ListService.getAllLists();
                        })
                        .then((lists) => this.render(lists));
                    }
                }
            }
        }
    }

    static render(lists){
        this.lists = lists;
        $('#app').empty();
        for (let list of lists){
            console.log(list, 'name of lists')
            $('#app').prepend(
                `<div id="${list.id}" class="card">
                    <div class="card-header">
                    <h2>${list.listName}</h2>
                    <button class="btn btn-dark" onclick="DOMManager.deleteList('${list.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${list.id}-item-name" class="form-control" placeholder="Item Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${list.id}-item-price" class="form-control" placeholder="Item Price">
                                </div>
                            </div>
                            <button id="${list.id}-new-item" onclick="DOMManager.addListItem('${list.id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div> <br>
                `  
                );
                for (let item of list.listOfAllItems) {
                    $(`#${list.id}`).find('.card-body').append(
                        `<p>
                        <span id="item-${item.id}"><strong>Item Name: </strong> ${item.item}</span>
                        <span id="price-${item.id}"><strong>Item Price: </strong> ${item.price}</span>
                        <button class="btn btn-dark" onclick="DOMManager.deleteItem('${list.id}', '${item.id}')">Delete Item</button>
                        </p>
                        `
                    )
                }
        }
   }
 }
$('#create-new-list').on('click', () => {
    // console.log('click')
    DOMManager.createList($('#new-list-name').val());
    $('#new-list-name').val('');
});

DOMManager.getAllLists();