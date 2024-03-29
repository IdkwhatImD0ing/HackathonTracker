'use client'
import React, {useState} from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Snackbar,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {addDoc, collection} from 'firebase/firestore'
import {useFirestore} from 'reactfire'
import moment from 'moment-timezone'
const AddHackathonPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    url: '',
    startDate: '',
    endDate: '',
    eventType: 'hackathon', // Default to 'hackathon'
  })
  const firestore = useFirestore()
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const startDateInZone = moment
        .tz(formData.startDate, 'YYYY-MM-DDTHH:mm', 'America/Los_Angeles')
        .format()
      const endDateInZone = moment
        .tz(formData.endDate, 'YYYY-MM-DDTHH:mm', 'America/Los_Angeles')
        .format()
      const newFormData = {
        ...formData,
        startDate: startDateInZone,
        endDate: endDateInZone,
      }
      await addDoc(
        collection(
          firestore,
          formData.eventType === 'hackathon' ? 'hackathons' : 'conferences',
        ),
        newFormData,
      )
      setOpenSnackbar(true) // Open the snackbar on successful submission
      setFormData({
        name: '',
        college: '',
        url: '',
        startDate: '',
        endDate: '',
        eventType: 'hackathon', // Reset to default
      }) // Clear the form
    } catch (error) {
      console.error(`Error adding ${formData.eventType}:`, error)
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: 'black',
      }}
    >
      <Paper elevation={6} sx={{p: 4, mt: 8, mb: 8}}>
        <Typography
          component="h1"
          variant="h5"
          sx={{mb: 4, textAlign: 'center'}}
        >
          Add Event
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="event-type-select-label">Event Type</InputLabel>
          <Select
            labelId="event-type-select-label"
            id="eventType"
            name="eventType"
            value={formData.eventType}
            label="Event Type"
            onChange={handleChange}
          >
            <MenuItem value="hackathon">Hackathon</MenuItem>
            <MenuItem value="conference">Conference</MenuItem>
          </Select>
        </FormControl>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Hackathon Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="college"
            label="College/Organization"
            name="college"
            autoComplete="college"
            value={formData.college}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="url"
            label="Website URL"
            name="url"
            autoComplete="url"
            value={formData.url}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="startDate"
            label="Start Date"
            name="startDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endDate"
            label="End Date"
            name="endDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.endDate}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{mt: 3, mb: 2}}
          >
            Add Event
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message="Hackathon added successfully!"
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default AddHackathonPage
