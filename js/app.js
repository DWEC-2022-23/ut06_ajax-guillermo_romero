document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');
  
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');
  
  filterLabel.textContent = "Ocultar los que no hayan respondido";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);
  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;
    if(isChecked) {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        if (li.className === 'responded') {
          li.style.display = '';  
        } else {
          li.style.display = 'none';                        
        }
      }
    } else {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        li.style.display = '';
      }                                 
    }
  });
  
  function createLI(text) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);  
      element[property] = value; 
      return element;
    }
    
    function appendToLI(elementName, property, value) {
      const element = createElement(elementName, property, value);     
      li.appendChild(element); 
      return element;
    }
    
    const li = document.createElement('li');
    appendToLI('span', 'textContent', text);     
    appendToLI('label', 'textContent', 'Confirmed')
      .appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
    return li;
  } 
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    const li = createLI(text);
    ul.appendChild(li);

    let data = JSON.parse(localStorage.getItem("data"));
    data.push({id:11,name:li.firstElementChild.textContent,confirmed:"true"})
    localStorage.setItem("data",JSON.stringify(data));
  });
    
  ul.addEventListener('change', (e) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;
    
    if (checked) {
      listItem.className = 'responded';
      confirmacion(listItem,"true");
    } else {
      listItem.className = '';
      confirmacion(listItem,"false");
    }
  });
    
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove: () => {
          eliminarInvitado(li);
          ul.removeChild(li);
        },
        edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'save';
          localStorage.setItem('editName',span.textContent);
        },
        save: () => {
          const input = li.firstElementChild;
          const span = document.createElement('span');
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = 'edit';
          
          guardarCambios(span.textContent);
        }
      };
      
      // select and run action in button's name
      nameActions[action]();
    }
  }); 
  
 
  //debido a problemas varios la carga del archivo local novios.json no me ha sido posible
  //la resolución se realiza guardando una copia de la lista de objetos de jsonPlaceholder
  //en localStorage, para su edición y uso

  //carga datos del json
  async function xhrResolve(url,callback){
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET",url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == "200") {
            callback(xhr.responseText);
        }
    }
    xhr.send();
  }

  xhrResolve("https://jsonplaceholder.typicode.com/users",(text)=>{
    let data = JSON.parse(text);
    data.forEach(element => {
      let li = createLI(element.name);
      let checkLI = li.children[1].childNodes[1];
      if(element.confirm == "true")checkLI.checked = "true";
      ul.appendChild(li);
    });
    localStorage.setItem('data',JSON.stringify(data));
  });


  function confirmacion(obj,bool){
    //recibe un LI
    let nombre = obj.firstElementChild.textContent;
    let data = JSON.parse(localStorage.getItem("data"));
    data.forEach(person => {
      if(person.name == nombre){
        person.confirm = bool;
      }
    });
    localStorage.setItem("data",JSON.stringify(data));
  }

  function guardarCambios(nombreNuevo){
    let data = JSON.parse(localStorage.getItem("data"));
    console.log(data);
    data.forEach(person => {
      if(person.name == localStorage.getItem("editName")){
        person.name = nombreNuevo;
      }
    });
    localStorage.setItem("data",JSON.stringify(data));
    localStorage.removeItem("editName");
  }

  function eliminarInvitado(li){
    let data = JSON.parse(localStorage.getItem("data"));
    let index = data.indexOf(li.firstElementChild.textContent);
    data.splice(index,1);
    localStorage.setItem("data",JSON.stringify(data));
  }

});  
  
  
  
  

  
  
  
  
