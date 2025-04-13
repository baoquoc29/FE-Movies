"use client"

import { useState } from "react"
import { Add, Close, Person } from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
  Box,
  Grid
} from "@mui/material"
import styles from "./ActorSelector.module.scss"

// Sample data for existing actors
const existingActors = [
  { id: 1, name: "Tom Hanks" },
  { id: 2, name: "Meryl Streep" },
  { id: 3, name: "Leonardo DiCaprio" },
  { id: 4, name: "Viola Davis" },
  { id: 5, name: "Denzel Washington" },
  { id: 6, name: "Emma Stone" },
  { id: 7, name: "Brad Pitt" },
  { id: 8, name: "Cate Blanchett" },
]

export function ActorSelector({ actors, onChange }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [newActor, setNewActor] = useState({ name: "", character: "" })
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddActor = () => {
    if (newActor.name.trim()) {
      onChange([...actors, { ...newActor }])
      setNewActor({ name: "", character: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleSelectActor = (actor) => {
    onChange([...actors, { id: actor.id, name: actor.name, character: "" }])
    setIsSelectDialogOpen(false)
    setSearchTerm("")
  }

  const handleRemoveActor = (index) => {
    const updatedActors = [...actors]
    updatedActors.splice(index, 1)
    onChange(updatedActors)
  }

  const handleUpdateCharacter = (index, character) => {
    const updatedActors = [...actors]
    updatedActors[index] = { ...updatedActors[index], character }
    onChange(updatedActors)
  }

  const filteredActors = existingActors.filter(
    (actor) => actor.name.toLowerCase().includes(searchTerm.toLowerCase()) && !actors.some((a) => a.id === actor.id),
  )

  return (
    <div className={styles.actorSelector}>
      <div className={styles.buttonGroup}>
        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
          <DialogTitle>Add New Actor</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Box className={styles.formFields}>
              <TextField
                label="Actor Name"
                value={newActor.name}
                onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                placeholder="Enter actor name"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Character Name (Optional)"
                value={newActor.character || ""}
                onChange={(e) => setNewActor({ ...newActor, character: e.target.value })}
                placeholder="Enter character name"
                fullWidth
                margin="dense"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddActor} variant="contained">Add Actor</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isSelectDialogOpen} onClose={() => setIsSelectDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Select Actor</DialogTitle>
          <DialogContent>
            <TextField
              placeholder="Search actors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              className={styles.searchField}
            />
            <div className={styles.actorResults}>
              {filteredActors.length > 0 ? (
                <List>
                  {filteredActors.map((actor) => (
                    <ListItem key={actor.id} disablePadding>
                      <ListItemButton onClick={() => handleSelectActor(actor)}>
                        {actor.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" className={styles.noResults}>
                  No actors found
                </Typography>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsSelectDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
          size="small"
        >
          Add New Actor
        </Button>
        <Button
          variant="outlined"
          startIcon={<Person />}
          onClick={() => setIsSelectDialogOpen(true)}
          size="small"
        >
          Select Existing Actor
        </Button>
      </div>

      {actors.length > 0 ? (
        <Paper variant="outlined" className={styles.actorList}>
          <div className={styles.listHeader}>
            <div>Actor</div>
            <div>Character</div>
            <div></div>
          </div>
          {actors.map((actor, index) => (
            <div key={index} className={styles.listItem}>
              <div>{actor.name}</div>
              <TextField
                value={actor.character || ""}
                onChange={(e) => handleUpdateCharacter(index, e.target.value)}
                placeholder="Character name"
                fullWidth
                size="small"
              />
              <IconButton onClick={() => handleRemoveActor(index)} size="small">
                <Close />
              </IconButton>
            </div>
          ))}
        </Paper>
      ) : (
        <Paper variant="outlined" className={styles.emptyState}>
          <Typography color="text.secondary">No actors added yet</Typography>
        </Paper>
      )}
    </div>
  )
}