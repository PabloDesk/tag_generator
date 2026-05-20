// 1. SELECCIÓN DE ELEMENTOS DEL HTML
const tagInput = document.getElementById('tagInput');
const addBtn = document.getElementById('addBtn');
const tagsContainer = document.getElementById('tagsContainer');
const copyBtn = document.getElementById('copyBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Array global donde guardaremos todas las etiquetas
let tagsList = [];

// 2. FUNCIÓN DE FORMATEO INDIVIDUAL
function formatTag(text) {
    // Pasa a minúsculas, remueve espacios de los extremos y cambia espacios internos por guiones bajos
    return text.toLowerCase().trim().replace(/\s+/g, '_');
}

// 3. FUNCIÓN PARA MOSTRAR LOS TAGS EN PANTALLA
function renderTags() {
    tagsContainer.innerHTML = ''; // Limpiamos el contenedor para no duplicar

    tagsList.forEach((tag, index) => {
        // Creamos la estructura visual de cada etiqueta (chip)
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';

        // Le inyectamos el texto del tag y su propio botón de eliminar
        tagElement.innerHTML = `
            <span>${tag}</span>
            <button class="delete-btn" onclick="deleteTag(${index})">✕</button>
        `;

        tagsContainer.appendChild(tagElement);
    });
}

// 4. FUNCIÓN PARA AGREGAR NUEVOS TAGS (SOPORTA SEPARACIÓN POR COMAS)
function addTag() {
    const rawText = tagInput.value;
    if (rawText.trim() === '') return; // Evita cajas vacías

    // Rompe la cadena de texto cada vez que encuentra una coma ","
    const items = rawText.split(',');

    items.forEach(item => {
        // Verificamos que el fragmento no sea solo espacios en blanco
        if (item.trim() !== '') {
            const formattedText = formatTag(item);
            tagsList.push(formattedText);
        }
    });

    renderTags();        // Actualiza la interfaz visual
    tagInput.value = ''; // Limpia la barra de escritura
    tagInput.focus();    // Devuelve el cursor al input para seguir escribiendo
}

// 5. FUNCIÓN PARA ELIMINAR UN TAG ESPECÍFICO
window.deleteTag = function(index) {
    tagsList.splice(index, 1); // Remueve el elemento en base a su posición en la lista
    renderTags();              // Vuelve a dibujar los tags restantes
}

// 6. DETECTORES DE EVENTOS (LISTENERS)
// Escucha el clic en el botón "Agregar"
addBtn.addEventListener('click', addTag);

// Escucha cuando presionas la tecla "Enter" dentro de la barra de texto
tagInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTag();
    }
});

// Escucha el clic en el botón de copiar todo al portapapeles
copyBtn.addEventListener('click', () => {
    if (tagsList.length === 0) {
        alert("No hay tags para copiar.");
        return;
    }

    // Une todos los tags de la lista separándolos por un espacio común
    const textToCopy = tagsList.join(' ');

    // API nativa del navegador para guardar en el portapapeles
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('¡Tags copiados con éxito!');
    }).catch(err => {
        console.error('Error al intentar copiar: ', err);
    });
});

// Evento para borrar todos los tags de golpe
clearAllBtn.addEventListener('click', () => {
    // Verificamos si realmente hay algo que borrar
    if (tagsList.length === 0) {
        alert("No hay tags para eliminar.");
        return;
    }

    // Preguntamos al usuario por seguridad
    const confirmDelete = confirm("¿Estás seguro de que quieres borrar todos los tags?");

    if (confirmDelete) {
        tagsList = [];  // Vaciamos el array por completo
        renderTags();   // Volvemos a dibujar la pantalla (ahora vacía)
        tagInput.focus(); // Devolvemos el cursor al input
    }
});