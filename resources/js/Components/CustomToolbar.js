import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { withStyles } from '@mui/styles';

const defaultToolbarStyles = {
    iconButton: {
    },
};

function CustomToolbar(props) {

    const { classes, handleClick } = props;

    return(
        <>
            <Tooltip title={"Ajouter Nouveau Element"}>
                <IconButton className={classes.iconButton} onClick={handleClick}>
                    <AddIcon className={classes.deleteIcon} />
                </IconButton>
            </Tooltip>
        </>
    )
}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);