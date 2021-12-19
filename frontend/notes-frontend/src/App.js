import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';
import Footer from './components/Footer';
import noteService from './services/notes';
import loginService from './services/login';
/*eslint no-unused-vars: "error"*/

const App = () => {
  const [notes, setNotes] = useState([]);
  // const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [loginVisible, setLoginVisible] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = noteObject => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote));
    });
  };

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)));
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server... ${error}`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      noteService.setToken(user.token);
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel='log in'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />{' '}
    </Togglable>
  );

  const handleLogOut = async event => {
    event.preventDefault();
    try {
      window.localStorage.removeItem('loggedBlogappUser');
      setUser(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  const noteFormRef = useRef();

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />{' '}
    </Togglable>
  );

  const logOutForm = () => (
    <form onSubmit={handleLogOut}>
      <button type='submit'> Logout </button>{' '}
    </form>
  );

  return (
    <div>
      <h1> Notes </h1> <Notification message={errorMessage} />{' '}
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p> {user.name} {' '} logged in</p> {logOutForm()} {noteForm()}{' '}
        </div>
      )}{' '}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}{' '}
        </button>{' '}
      </div>{' '}
      <ul>
        {' '}
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}{' '}
      </ul>{' '}
      <Footer />
    </div>
  );
};

export default App;