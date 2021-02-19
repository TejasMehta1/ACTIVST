import Figure from "react-bootstrap/Figure";
import "./CauseEdit.css"
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import NoImage from "./noImage.png";

function CauseEdit({ind,dbTitle, dbImage, dbDescription, handleDelete, updateDB}) {

    const [image, setImage] = useState(dbImage ? dbImage : "");
    const [title, setTitle] = useState(dbTitle ? dbTitle : "");
    const [description, setDescription] = useState(dbDescription ? dbDescription : "");
    const [isVisible, setIsVisible] = useState(true);
    const handleImageChange = (e) => {
        setImage(e);
        updateDB(ind, "image", e);
    };

    const handleTitleChange = (e) => {
        setTitle(e);
        updateDB(ind, "title", e);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e);
        updateDB(ind, "description", e);
    };

    const handleRemoveCause = (ind) => {
        setImage("");
        setTitle("");
        setDescription("");
        setIsVisible(false);
        handleDelete(ind);
    };



    return (

        <div style={{display: isVisible ? 'block' : 'none'}} className={"variableContainer container"}>

            <TextField className="input" value={title} label="Cause Title" fullWidth
                       onChange={event => handleTitleChange(event.target.value)}
            />
            <br/>
            <br/>
            <TextField className="input" value={image} fullWidth label="Cause Image Url: "
                       onChange={event => handleImageChange(event.target.value)}
            />
            <br/>
            <br/>
            <img className={"cropImage"} width={150} height={150} src={image} onError={(e)=>{e.target.onerror = null; e.target.src=NoImage}}/>

            <br/>
            <br/>
            <TextField className={"input"} value={description} label="Cause Description"
                       onChange={event => handleDescriptionChange(event.target.value)}
                       multiline
                       fullWidth
                       rows={4}
                       variant={"outlined"}
            />
            <br/>
            <br/>
            <IconButton onClick={() => handleRemoveCause(ind)} color="secondary" aria-label="delete">
                <DeleteIcon style={{fontSize: "1.5em"}} color={"secondary"}/>
            </IconButton>
        </div>
        // <Figure className={"cause"}>
        //     <Figure.Image
        //         width="300"
        //         height="300"
        //         alt="171x180"
        //         class="cause"
        //         src={picture}
        //         onClick={() => {
        //             handleOpen(title);
        //         }}
        //     />
        //     <Figure.Caption>
        //         {title}
        //
        //     </Figure.Caption>
        // </Figure>
    )
}

export default CauseEdit;
