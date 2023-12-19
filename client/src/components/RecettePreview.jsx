import * as React from 'react'
import { Card, CardHeader, CardMedia, CardContent, Typography, IconButton, Divider, Rating, Box } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

export default function RecettePreview({ recette }) {
    return (
        <Card sx={{ width: "15rem", margin: "3rem 1rem", overflow: "visible" }} className='cardboxshadow'>
            <CardMedia
                component="img"
                sx={{ height: "12rem", width: "80%" }}
                image={recette.photo}
                alt={recette.titre}
                className='recette-preview-img'
            />
            <CardContent sx={{ padding: "0"}}>
                <Typography variant="subtitle1" sx={{ padding: "0 2rem", margin: "2rem auto 1rem auto", fontWeight: "600"}}>
                    {recette.titre}
                </Typography>
            </CardContent>
            <Divider />
            <CardActions sx={{ display: 'flex', justifyContent: "space-around"}}>
                <IconButton aria-label="add to favorites" sx={{ borderRadius: "0" }}>
                    <FavoriteBorderIcon />
                    <Typography variant="subtitle1" sx={{ color: "rgba(0, 0, 0, 0.54)"}}>
                        34
                    </Typography>
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton sx={{ borderRadius: "0"}} aria-label="open" component={Link} to={`/recetteDetails/${recette.id}`} state={recette}>
                    <OpenInNewIcon />
                    <Typography variant="subtitle1">Voir plus</Typography>
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating name="read-only" value={1} max={1} readOnly size='small' />
                    <Typography variant="subtitle1" sx={{ color: "rgba(0, 0, 0, 0.54)"}}>
                        3.5
                    </Typography>
                    </Box>
            </CardActions>
            
        </Card>
    )
}