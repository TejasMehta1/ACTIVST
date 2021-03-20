import Figure from "react-bootstrap/Figure";
import "./CauseEdit.css"
import Grid from "@material-ui/core/Grid";
import React, {useState, useCallback, useRef, useEffect} from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import NoImage from "./noImage.png";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import Web from "@material-ui/icons/WebAsset"
import autofillData from "./CauseAutofillData"
import Autocomplete from '@material-ui/lab/Autocomplete';
import ImageUploader from 'react-images-upload';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import toaster from "toasted-notes";
import PublishIcon from '@material-ui/icons/Publish';


function CauseEdit({ind, db, handleDelete, updateDB}) {

    const [image, setImage] = useState('image' in db ? db.image : "");
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const [title, setTitle] = useState('title' in db ? db.title : "");
    const [titleAuto, setTitleAuto] = useState( 'title' in db ? db.title : "");
    const [description, setDescription] = useState('description' in db ? db.description : "");
    const [isVisible, setIsVisible] = useState(true);
    const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 16/16 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const previewCanvasRef = useRef(null);
    const [open, setOpen] = React.useState(false);
    const autofillCauseData = autofillData();



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
        if(e.length > 0) {
            setTitle(e);
            updateDB(ind, "title", e);
        }
        else{
            setTitle("");
            updateDB(ind, "title", "");
        }
    };

    const handleAutoCompleteChange = (e) => {
        setTitleAuto(e);
        updateDB(ind, "title", e);
        for(let i=0; i<autofillCauseData.length; i++) {
            if(autofillCauseData[i].title === e) {
                let obj = autofillCauseData[i];
                handleDescriptionChange(obj.description);
                handleImageChange(obj.image);
                // for (let ke in obj.donations){
                //     let event = {
                //         target: {
                //             name: ke,
                //             checked: obj.donations[ke]
                //         }
                //     };
                //     handleChange(event);
                // }
            }
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e);
        updateDB(ind, "description", e);
    };

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    function generateDownload(canvas, crop) {
        if (!crop || !canvas) {
            return;
        }

        canvas.toBlob(
            (blob) => {
                const previewUrl = window.URL.createObjectURL(blob);
                console.log('Image file', previewUrl);
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    console.log(base64data);
                    let apiUrl = " https://us-central1-activst.cloudfunctions.net/addMessage\n";

                    const data = {
                        image: base64data
                    };
                    axios.post(apiUrl, data)
                        .then((response) => {
                            console.log(response);
                            setOpen(false);
                            try {
                                handleImageChange(response.data.result.url);
                            }
                            catch (e) {
                                toaster.createNotification("Failed to save image");
                            }
                        })


                }
                // const anchor = document.createElement('a');
                // anchor.download = 'cropPreview.png';
                // anchor.href = URL.createObjectURL(blob);
                // anchor.click();
                //
                // window.URL.revokeObjectURL(previewUrl);
            },
            'image/png',
            1
        );
    }

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

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);


    return (



        <div style={{display: isVisible ? 'block' : 'none'}} className={"variableContainer container"}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={"modal causeContainer"}
                open={open}
                onClose={() => {setOpen(false)}}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={"paper"}>
                        <h1>File Upload</h1>
                        <input
                            className={"uploadButton"}
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            onChange={onSelectFile}
                        />
                        <label htmlFor="contained-button-file">
                            <Button startIcon={<PublishIcon />} style={{marginBottom: "5px"}} variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                        </label>

                        <ReactCrop
                            src={upImg}
                            onImageLoaded={onLoad}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        />
                        <canvas
                            ref={previewCanvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0)
                            }}
                        />
                        <br/>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!completedCrop?.width || !completedCrop?.height}
                            size="large"
                            startIcon={<SaveIcon />}
                            onClick={() =>
                                generateDownload(previewCanvasRef.current, completedCrop)}
                        >
                            Save
                        </Button>
                    </div>
                </Fade>
            </Modal>

            <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={autofillCauseData.map((option) => option.title)}
                value={titleAuto}
                onChange={(event, newVal) => {
                    handleAutoCompleteChange(newVal);
                }}
                inputValue={title}
                onInputChange={(event, newInputValue) => {
                    handleTitleChange(newInputValue)
                }}
                renderInput={(params) => (
                    <TextField {...params} error={!title} label="Cause Title (*)" margin="normal"  />
                )}
            />


            {/*<TextField className="input" error={!title} value={title} label="Cause Title (*)" fullWidth*/}
            {/*           onChange={event => handleTitleChange(event.target.value)}*/}
            {/*/>*/}
            <br/>
            <br/>
            <TextField className="input" value={image} fullWidth label="Cause Image Url: "
                       onChange={event => handleImageChange(event.target.value)}
            />
            <br/>
            <br/>

            <div className={"hoverOverlayContainer"}>
            <img className={"cropImage"} width={150} height={150} src={image} onError={(e) => {
                e.target.onerror = null;
                e.target.src = NoImage
            }}
                 // onClick={()=> setOpen(true)}
            />
            <div onClick={()=> setOpen(true)} className="overlay">
                <a className="icon" title="User Profile">
                    <PublishIcon style={{fontSize: "40px"}}/>
                </a>
            </div>
            </div>
            <br/>
            <br/>
            <TextField className={"input"} error={!description} value={description} label="What is the cause, why is it important, how can we help? (*)"
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
                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
