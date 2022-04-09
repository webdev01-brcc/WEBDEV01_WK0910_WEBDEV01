
let itemsArray = []
let todos = []
const newItemButton = document.getElementById('newItemButton');
const newItemSaveButton = document.getElementById('newItemSave');
const newTodoItems = document.getElementById('newTodoItems');
const newTodoName = document.getElementById('newTodoName');
const todoBody = document.getElementById('todo-body');
const offCanvasEdit = document.getElementById('offCanvasEdit');
const bsOffcanvasEdit = new bootstrap.Offcanvas(offCanvasEdit);
const offCanvasEditLabel = document.getElementById('offCanvasEditLabel');
const offCanvasEditBody = document.getElementById('offCanvasEditBody');
const deleteTodosButton = document.getElementById('deleteTodosButton');

const addNewTodoItem = (container, todoItemsArray) => {
    const timeStamp = Date.now()
    const newItem = (value) => `
    <div 
        class="input-group mb-3 newTodoItem" 
        id="todoItem-${timeStamp}"
    >
        <input 
            type="text" 
            class="form-control" 
            placeholder="Item Name" aria-label="Item" 
            aria-describedby="button-addon2"
            value="${value}"
            id="newTodoInput-${timeStamp}"
            onInput="updateItemValue(event)"
        >
        <button 
            class="btn btn-outline-danger" 
            type="button" 
            id="newTodoRemove-${timeStamp}" 
            onClick="removeItem(event)"
        >
            Remove
        </button>
    </div>`

    todoItemsArray.push({
        id: timeStamp,
        value: '',
        complete: false,
        item: newItem
    })

    container.innerHTML =
        todoItemsArray.map(item => item.item(item.value)).join('')

    const activeItem =
        container.children.item(todoItemsArray.length - 1)
            .children.item(0)
    activeItem.focus()
    const length = activeItem.value.length
    activeItem.setSelectionRange(length, length)
}

const removeItem = (event) => {
    const id = event.target.id.split('-')[1]
    console.log(id)
    itemsArray = itemsArray.filter(i => i.id != id)
    newTodoItems.innerHTML =
        itemsArray.map(item => item.item(item.value)).join('')
}

const updateItemValue = (event) => {
    const value = event.target.value
    const id = event.target.id.split('-')[1]
    const itemIndex = itemsArray.findIndex(item => item.id == id)

    itemsArray = itemsArray.map(item => {
        if (item.id == id) {
            return { ...item, value }
        }

        return item
    })

    newTodoItems.innerHTML =
        itemsArray.map(item => item.item(item.value)).join('')

    const activeItem = newTodoItems.children.item(itemIndex)
        .children.item(0)
    activeItem.focus()
    const length = activeItem.value.length
    activeItem.setSelectionRange(length, length)
}

const saveNewTodoItem = () => {
    if (!newTodoName.value) {
        alert('Must Include a Name.')
        return;
    }
    if (!itemsArray.length) {
        alert('Must have items in the todo list.')
        return;
    }

    const todoItem = {
        id: Date.now(),
        name: newTodoName.value,
        items: itemsArray
    }

    todos.push(todoItem)

    newTodoName.value = ''
    itemsArray = []
    newTodoItems.innerHTML = itemsArray

    updateTodosList()
    console.log(todos)
}

const updateTodosList = () => {
    modifyTodos(todos)
    const list = []
    for (const [i, todo] of todos.entries()) {
        const completes = todo.items.map(item => item.complete)
        const status = completes.every(item => item == false)
            ? 'Pending'
            : completes.every(item => item == true)
                ? 'Complete'
                : 'Incomplete'

        list.push(`<tr id="todo-${todo.id}">
        <th scope="row">${i + 1}</th>
        <td>${todo.name}</td>
        <td>${status}</td>
        <td>${dayjs(todo.id).format('MMM DD, YYYY')}</td>
        <td align="right">
            <button 
                type="button" 
                class="btn btn-secondary btn-sm" 
                id="todoEdit-${todo.id}" 
                onclick="editTodo(event)"
            >
                Edit
            </button>
            <button 
                type="button" 
                class="btn btn-danger btn-sm" 
                id="todoRemove-${todo.id}" 
                onClick="removeTodo(event)"
            >
                Remove
            </button>
        </td>
    </tr>`)
    }

    todoBody.innerHTML = list.join('')
}

const removeTodo = (event) => {
    const id = event.target.id.split('-')[1]
    todos = todos.filter(item => item.id != id)
    console.log(todos)
    updateTodosList()
}

const editTodo = (event) => {
    editTodoInternal(event);
    bsOffcanvasEdit.show();
}

const editTodoInternal = (event) => {
    const id = event.target.id.split('-')[1]
    const todo = todos.find(item => item.id == id)
    const array = []
    offCanvasEditLabel.innerText = todo.name

    for (const item of todo.items) {
        array.push(`
        <div class="form-check">
            <input 
                class="form-check-input" 
                type="checkbox" 
                value="${item.complete}" 
                id="flexCheck-${item.id}"
                data-todoid="${id}"
                data-itemid="${item.id}"
                onchange="updateItemStatus(event)"
                ${item.complete ? 'checked' : ''}
            >
            <label class="form-check-label" for="flexCheck-${item.id}">
                ${item.value}
            </label>
        </div>
    `)
    }

    offCanvasEditBody.innerHTML = array.join('')
}

const updateItemStatus = (event) => {
    const todoid = event.target.dataset.todoid
    const itemid = event.target.dataset.itemid
    const value = event.target.value

    const newTodos = todos.map(item => {
        if (item.id == todoid) {
            const items = item.items.map(i => {
                if (i.id == itemid) {
                    return { ...i, complete: value == 'false' ? true : false }
                }
                return i
            })

            return { ...item, items }
        }

        return item
    })

    todos = newTodos
    // console.log(newTodos)
    updateTodosList()
}

const getTodos = () => {
    return JSON.parse(localStorage.getItem('todos'))
}

const createTodos = () => {
    localStorage.setItem('todos', JSON.stringify([]))
    return getTodos()
}

const modifyTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const deleteTodos = () => {
    // localStorage.setItem('todos', JSON.stringify([]))
    todos = createTodos()
    updateTodosList()
}

window.addEventListener('DOMContentLoaded', function () {
    newItemButton.addEventListener(
        'click',
        () => addNewTodoItem(newTodoItems, itemsArray)
    );

    newItemSaveButton.addEventListener('click', saveNewTodoItem);
    deleteTodosButton.addEventListener('click', deleteTodos);

    todos = getTodos() ?? createTodos()
    updateTodosList()
});
