import React, { useState } from 'react';
import {
  Typography,
  Container,
  TextField,
  Button,
  Stack,
  ListItem,
  List,
  Checkbox,
  FormControlLabel,
  ListItemText,
  Snackbar,
  SnackbarContent,
  Box,
  CssBaseline,
  Switch,
} from '@mui/material';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import { useFormik } from 'formik';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const App = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editTodo, setEditTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [todosList, setTodos] = useState([]);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const lightTheme = createTheme();
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const [currentTheme, setCurrentTheme] = useState(darkTheme);

  const formik = useFormik({
    initialValues: {
      addTodo: '',
    },
    onSubmit: (values) => {
      if (!values.addTodo || values.addTodo.trim() === '') {
        setSnackbarMessage(`Todo cannot be empty`);
        setOpenSnackbar(true);
        formik.resetForm();

        return;
      }

      if (editingTodo) {

        // Edit the existing todo
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === editingTodo.id ? { ...todo, todo: values.addTodo } : todo
          )
        );
        setEditingTodo(null);
        setSnackbarMessage(`Todo edited`);
      } else {
        // Add a new todo
        setTodos((prevTodos) => [
          ...prevTodos,
          { id: Date.now(), todo: values.addTodo, isCompleted: false },
        ]);
        setSnackbarMessage(`Todo added`);
      }

      setOpenSnackbar(true);
      formik.resetForm();
    },

  });

  // Handle Complete Toggle Functionality
  const handleToggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // Handle Delete  Functionality
  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setSnackbarMessage(`Todo deleted`);
    setOpenSnackbar(true);
  }

  // Handle  Edit Functionality
  const handleEditTodo = (id) => {
    const selectedTodo = todosList.find((todo) => todo.id === id);
    // Set the selected todo for editing
    setEditingTodo(selectedTodo);
  };

  // Handle Delete All Functionality
  const handleDeleteAll = () => {
    setTodos([]);
  };

  // Handle Cancel Edit Functionality
  const handleCancelEdit = () => {
    setEditingTodo(null);
    formik.resetForm();
  };

  // Handle SnackBar Functionality
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Handle Theme Switch Functionality
  const toggleTheme = () => {
    if (currentTheme.palette.mode === 'light') {
      setCurrentTheme(darkTheme);

    }
    else {
      setCurrentTheme(lightTheme);

    }

  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Stack sx={{ alignItems: 'flex-end', marginTop: '2rem', marginRight: '1rem' }}>
        <Typography variant="h6" color="primary">
          Switch Theme
        </Typography>
        <Switch onChange={toggleTheme} />
      </Stack>
      <Container style={{ backgroundColor: currentTheme.palette.background.default }} >
        <Typography textAlign="center" color="danger" variant="h3">
          Todo App
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack
            sx={{ marginTop: '3rem' }}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              fullWidth
              id="addTodo"
              name="addTodo"
              label="Add a Todo"
              variant="outlined"
              value={formik.values.addTodo}
              onChange={formik.handleChange}
            />

            <Button type="submit" variant="contained" color="success">
              {editingTodo ? 'Update Todo' : 'Add Todo'}
            </Button>
            <form onSubmit={formik.handleSubmit}>
              {/* ... other form elements ... */}
              {editingTodo && (
                <Button type="button" variant="outlined" onClick={handleCancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </form>

          </Stack>
        </form>

        <Box >
          {todosList.length > 0 &&
            <Button
              color="error"
              size="small"
              onClick={() => handleDeleteAll()}
              style={{
                margin: 'auto', textAlign: "center", display: 'flex', flexDirection: 'column', height: "40px", marginTop: "10px",
                width: "30%", backgroundColor: "red", color: "white", 
              }}
            >
              Delete All
            </Button>}
          <List sx={{ margin: 'auto' }}>
            {todosList.map((todo, id) => (
              <ListItem
                key={id}
                style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "80%" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={todo.isCompleted}
                      onChange={() => handleToggleComplete(todo.id)}
                    />
                  }
                  label={

                    <ListItemText
                      // primary={todo.todo}
                      primary={todo.todo}
                      style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}
                    />

                  }
                />

                <Button
                  color="primary"
                  size="small"
                  onClick={() => handleEditTodo(todo.id)}
                >
                  Edit
                </Button>

                <Button
                  color="error"
                  size="small"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </Button>



              </ListItem>
            ))}
          </List>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <SnackbarContent
            message={snackbarMessage}
            action={
              <Button color="secondary" size="small" onClick={handleSnackbarClose}>
                Close
              </Button>
            }
          />
        </Snackbar>
      </Container>
    </ThemeProvider >
  );
};

export default App;
