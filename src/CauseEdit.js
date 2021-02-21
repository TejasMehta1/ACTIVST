import Figure from "react-bootstrap/Figure";
import "./CauseEdit.css"
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import NoImage from "./noImage.png";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import Web from "@material-ui/icons/WebAsset"

function CauseEdit({ind, db, handleDelete, updateDB}) {

    const [image, setImage] = useState('image' in db ? db.image : "");
    const [title, setTitle] = useState('title' in db ? db.title : "");
    const [description, setDescription] = useState('description' in db ? db.description : "");
    const [isVisible, setIsVisible] = useState(true);

    const [donations, setDonations] = React.useState({
        venmo: 'venmo' in db && db.venmo.length > 0,
        gofundme: 'gofundme' in db && db.gofundme.length > 0,
        cashapp: 'cashapp' in db && db.cashapp.length > 0,
        direct: 'direct' in db && db.direct.length > 0,
        petition: 'petition' in db && db.petition.length > 0,
        website: 'website' in db && db.website.length > 0,
    });

    const [donationData, setDonationData] = React.useState({
        venmo: 'venmo' in db ? db.venmo : "",
        gofundme: 'gofundme' in db ? db.gofundme : "",
        cashapp: 'cashapp' in db ? db.cashapp : "",
        direct: 'direct' in db ? db.direct : "",
        petition: 'petition' in db ? db.petition : "",
        website: 'website' in db ? db.website : "",
    });

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

    const handleChange = (event) => {
        setDonations({...donations, [event.target.name]: event.target.checked});
        if (event.target.checked === false){
            setDonationData({...donationData, [event.target.name]: ""});
            updateDB(ind, event.target.name, "");
        }
    };
    const handleChangeInfo = (event) => {
        setDonationData({...donationData, [event.target.name]: event.target.value});
        updateDB(ind, event.target.name, event.target.value);
    };

    const getDonations = (type) => {
        return donations[type];
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
            <img className={"cropImage"} width={150} height={150} src={image} onError={(e) => {
                e.target.onerror = null;
                e.target.src = NoImage
            }}/>

            <br/>
            <br/>
            <TextField className={"input"} value={description} label="What is the cause, why is it important, how can we help?"
                       onChange={event => handleDescriptionChange(event.target.value)}
                       multiline
                       fullWidth
                       rows={4}
                       type={"light"}
                       variant={"outlined"}
            />



            <div className={"donationInfo"}>
                <br/>

                <h6>External Resources: </h6>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={donations.website}
                            onChange={handleChange}
                            name="website"
                            color="primary"
                        />
                    }
                    label="Cause Website"
                    className={"paymentInfo"}
                />
                <TextField id="websiteUsername" label="Website" className={"paymentInfo"} value={donationData.website}
                           InputProps={{
                               startAdornment: <InputAdornment position="start"><Web></Web></InputAdornment>,
                           }}
                           name={"website"}
                           disabled={!donations.website}
                    // variant={"outlined"}
                           onChange={handleChangeInfo}
                           size={"small"}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={donations.petition}
                            onChange={handleChange}
                            name="petition"
                            color="primary"
                        />
                    }
                    className={"paymentInfo"}
                    label="Petition"
                />
                <TextField id="petitionUsername" label="Website" className={"paymentInfo"} value={donationData.petition}
                           InputProps={{
                               startAdornment: <InputAdornment position="start"><Web></Web></InputAdornment>,
                           }}
                           name={"petition"}
                           disabled={!donations.petition}
                    // variant={"outlined"}
                           onChange={handleChangeInfo}
                           size={"small"}
                />

                <h6>Donation Methods: </h6>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={donations.venmo}
                            onChange={handleChange}
                            name="venmo"
                            color="primary"
                        />
                    }
                    label="Venmo"
                    className={"paymentInfo"}
                />
                <TextField id="venmoUsername" label="Username" className={"paymentInfo"} value={donationData.venmo}
                           InputProps={{
                               startAdornment: <InputAdornment position="start">@</InputAdornment>,
                           }}
                           name={"venmo"}
                           disabled={!donations.venmo}
                           // variant={"outlined"}
                           onChange={handleChangeInfo}
                           size={"small"}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={donations.cashapp}
                            onChange={handleChange}
                            name="cashapp"
                            color="primary"
                        />
                    }
                    label="Cash App"
                    className={"paymentInfo"}
                />

                <TextField id="cashappUsername" label="Username" className={"paymentInfo"} value={donationData.cashapp}
                           InputProps={{
                               startAdornment: <InputAdornment position="start">@</InputAdornment>,
                           }}
                           disabled={!donations.cashapp}
                           // variant={"outlined"}
                           name="cashapp"
                           onChange={handleChangeInfo}
                           size={"small"}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={donations.gofundme}
                            onChange={handleChange}
                            name="gofundme"
                            color="primary"
                        />
                    }
                    className={"paymentInfo"}
                    label="Gofundme"
                />
                <TextField id="gofundmeUsername" label="Website" className={"paymentInfo"} value={donationData.gofundme}
                           InputProps={{
                               startAdornment: <InputAdornment position="start"><Web size={"small"}></Web></InputAdornment>,
                           }}
                           disabled={!donations.gofundme}
                           // variant={"outlined"}
                           name="gofundme"
                           onChange={handleChangeInfo}
                           size={"small"}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={donations.direct}
                            onChange={handleChange}
                            name="direct"
                            color="primary"
                        />
                    }
                    label="Other Website"
                    className={"paymentInfo"}
                />
                <TextField id="directUsername" label="Website" className={"paymentInfo"} value={donationData.direct}
                           InputProps={{
                               startAdornment: <InputAdornment position="start"><Web size={"small"}></Web></InputAdornment>,
                           }}
                           disabled={!donations.direct}
                    // variant={"outlined"}
                           name="direct"
                           onChange={handleChangeInfo}
                           size={"small"}
                />
            </div>
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
