const addNewNoteBtn = document.getElementById('add-note-btn')
const deleteAllNotesBtn = document.getElementById('delete-all-notes')
const notesList = document.getElementById('notes-list')


// Create note container with text
function createNoteMain() {
    const noteMain = document.createElement('div');
    noteMain.className = 'note-main';
    noteMain.innerHTML = 'Hello World!';

    return noteMain
}


function createHeaderOptionEdit() {
    const headerOptionEdit = document.createElement('span');
    headerOptionEdit.className = 'option';
    headerOptionEdit.setAttribute('data-action', 'edit');
    headerOptionEdit.innerHTML = '<img class="option-img" width="30px" height="30px" src="assets/images/icons8-edit-50.png">';

    return headerOptionEdit
}


function createHeaderOptionDelete() {
    const headerOptionDelete = document.createElement('span');
    headerOptionDelete.className = 'option';
    headerOptionDelete.dataset.action = 'delete'
    headerOptionDelete.innerHTML = '<img class="option-img" width="30px" height="30px" src="assets/images/icons8-delete-50.png">';

    return headerOptionDelete
}


function createNoteHeaderOptions() {
    const noteHeaderOptions = document.createElement('div');
    noteHeaderOptions.className = 'options-container';

    noteHeaderOptions.append(createHeaderOptionEdit());
    noteHeaderOptions.append(createHeaderOptionDelete());

    return noteHeaderOptions
}


// Create header for note with options
function createNoteHeader() {
    const noteHeader = document.createElement('div');
    noteHeader.className = 'note-header d-flex justify-content-between';
    noteHeader.innerHTML = `<span>${getCurrentDate()}</span>`;

    noteHeader.append(createNoteHeaderOptions());

    return noteHeader
}


// Create main note container
function createNoteBox() {
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.id = Date.now();

    noteBox.append(createNoteHeader());
    noteBox.append(createNoteMain());

    return noteBox
}


// Append note to notes list and localStorage
function createNote() {
    const notesContainer = document.querySelector('.notes-container');
    const noteBox = createNoteBox();
    const noteText = 'Hello World!';

    const noteData = {
        id: noteBox.id,
        html: noteBox.innerHTML,
        text: noteText
    };

    saveNoteToLocalStorage(noteData);
    notesContainer.append(noteBox);
}


// Get notes from localStorage and show them with Markdown
function showCurrentNotes() {
    const md = window.markdownit();
    const notesContainer = document.querySelector('.notes-container');
    const savedNotes = JSON.parse(localStorage.getItem('notes'));

    if (savedNotes && savedNotes.length > 0) {
        savedNotes.forEach(noteData => {
            const noteBox = document.createElement('div');
            noteBox.className = 'note-box';
            noteBox.innerHTML = noteData.html;
            noteBox.id = noteData.id;

            let result = md.render(noteBox.querySelector('.note-main').innerHTML);
            noteBox.querySelector('.note-main').innerHTML = result;

            notesContainer.append(noteBox);
        });
    }
}


function editNote(target, editNoteModal) {
    const noteBox = target.closest('.note-box');
    const noteBoxId = Number(noteBox.id);
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find((note) => Number(note.id) === noteBoxId);
    const closeButton = document.getElementById('editClose');
    const saveButton = document.getElementById('saveButton');
    const editTextArea = document.getElementById('editTextArea');
    const alert = document.getElementById('alert');

    saveButton.addEventListener('click', () => {
        const newText = editTextArea.value;
        if (newText !== '') {
            noteBox.querySelector('.note-main').innerHTML = newText;
            note.html = noteBox.innerHTML;
            note.text = newText;
            localStorage.setItem('notes', JSON.stringify(notes));
            editNoteModal.hide();
            deleteAllNotes();
            showCurrentNotes();
        } else {
            alert.style.display = 'block';
        }
    });

    closeButton.addEventListener('click', () => {
        editNoteModal.hide();
    });
}


function deleteNote(target) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteBox = target.closest('.note-box');
    const noteBoxToDeleteId = noteBox.id;

    const filteredNotes = notes.filter((note) => note.id !== noteBoxToDeleteId);

    localStorage.setItem('notes', JSON.stringify(filteredNotes));

    if (noteBox) {
        noteBox.remove();
    }
}


// delete all notes from page and localStorage if true
function deleteAllNotes(deleteFromLocalStorage = false) {
    const notes = document.querySelectorAll('.note-box');
    notes.forEach(note => {
        note.remove();
    });

    if (deleteFromLocalStorage) {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Ошибка при очистке заметок из localStorage:', error);
        }

    }
}


function clearModal(target) {
    const editTextArea = document.getElementById('editTextArea');
    const alert = document.getElementById('alert');
    const noteBox = target.closest('.note-box');

    if (!noteBox) {
        return;
    }

    const noteBoxId = noteBox.id;
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find((note) => note.id === noteBoxId);

    if (!note) {
        return;
    }

    const noteText = note.text || '';

    editTextArea.value = noteText;
    alert.style.display = 'none';
}


function saveNoteToLocalStorage(noteData) {
    try {
        const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
        existingNotes.push(noteData);
        localStorage.setItem('notes', JSON.stringify(existingNotes));
    } catch (error) {
        console.error('Ошибка при сохранении заметки в localStorage:', error);
    }
}


function initBootstrapModal() {
    const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'));

    return editNoteModal
}


function getCurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const currentDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return currentDate
}


notesList.addEventListener('click', (event) => {
    const editNoteModal = initBootstrapModal();
    let target = event.target;

    if (target.dataset.action === 'edit') {
        clearModal(target);
        editNoteModal.show();
        editNote(target, editNoteModal);
    } else if (target.dataset.action === 'delete') {
        deleteNote(target);
    }
});


addNewNoteBtn.addEventListener('click', () => createNote());

deleteAllNotesBtn.addEventListener('click', () => deleteAllNotes(true));

window.addEventListener('load', () => showCurrentNotes());