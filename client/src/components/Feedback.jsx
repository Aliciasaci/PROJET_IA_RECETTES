import React, { useState, useEffect } from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import styled from '@mui/material/styles/styled';
import { grey, blue } from '@mui/material/colors';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Feedback = ({ recette }) => {
    const { auth } = useAuth();
    const [newFeedback, setNewFeedback] = useState('');
    const [feedbackList, setFeedbackList] = useState([]);


    const addFeedback = async (event) => {
        event.preventDefault();
        try {
            const userId = auth.userId;
            const response = await axios.post(`http://localhost:5000/recettes/${recette}/feedback`, { userId, newFeedback });
            if (response.data) {
                const newFeedbackList = response.data.feedbackList;
                setFeedbackList(newFeedbackList);
                setNewFeedback('');
            }
        } catch (error) {
            console.error("Error adding to feedback", error);
        }
    }

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recettes/${recette}/feedback`);
                if (response.data && response.data.result && response.data.result.length > 0) {
                    setFeedbackList(response.data.result);
                }
            } catch (error) {
                console.error("Error fetching feedback", error);
                throw error;
            }
        }

        fetchFeedback();
    }, []);

    return (
        <div>
            <Typography variant="h6" component="h2">
                Tous les avis ({feedbackList ? feedbackList.length : "0"}) <ArrowDropDownIcon />
            </Typography>
            
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {feedbackList ? 
                feedbackList.length > 0 ? 
                    feedbackList.map((feedback) => (
                        <>
                            <ListItem alignItems="flex-start" key={feedback.id}>
                            <ListItemAvatar>
                            <Avatar alt={feedback.nom} src="" />
                            </ListItemAvatar>
                            <ListItemText
                            primary={feedback.nom + " " + feedback.prenom} 
                            secondary={
                                <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                   {new Date(feedback.created_at).toLocaleDateString()}
                                </Typography>
                                {" - " + feedback.commentaire}
                                </React.Fragment>
                            }
                            />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    ))
                : null
            : null}
            </List>

            <Box component="form" noValidate onSubmit={addFeedback}>
                <Grid container spacing={9}>
                    <Grid item xs={8}>
                        <Item>
                            <TextareaAutosize
                            minRows={3}
                            id="feedback"
                            name="feedback"
                            aria-label="empty textarea"
                            placeholder="Aimez-vous cette recette ?"
                            onChange={(e) => setNewFeedback(e.target.value)}
                            value={newFeedback}
                            />
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <Button type="submit" variant="contained">
                                Envoyer
                            </Button>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

export default Feedback;