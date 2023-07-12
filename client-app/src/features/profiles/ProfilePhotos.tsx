import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
    profile: Profile;
}

export default observer (function ProfilePhotos({profile} : Props) {
    const {profileStore: {isCurrentUser, uploadPhoto, uploading, setMainPhoto, loading, deletePhoto}} = useStore();
    const[addPhotoMode, setAddPhotoMode] = useState(false);

    const [target, setTarget] = useState('');

function handlePhotoUpload(file:Blob) {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
}

function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
}

function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
}

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button floated="right" basic 
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'} 
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                            />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                                  : (
                                    <Card.Group itemsPerRow={5}>
                                                    {profile.photos?.map(p => (
                                                    <Card key={p.id}>
                                                        <Image src={p.url} />
                                                        {isCurrentUser && (
                                                            <Button.Group fluid widths={2}>
                                                                <Button basic color="green" content='Main' name={p.id + '_SET'} disabled={p.isMain}
                                                                    loading={loading && target === p.id + '_SET'}
                                                                    onClick={e => handleSetMainPhoto(p, e)} />
                                                                    <Button basic color="red" icon='trash' name={p.id + '_DELETE'}
                                                                        loading={loading && target === p.id + '_DELETE'} disabled={p.isMain}
                                                                        onClick={e => handleDeletePhoto(p,e)} />
                                                            </Button.Group>
                                                        )}
                                                    </Card>
                                                    ))}                                  
                                                </Card.Group>
                                  )}
                </Grid.Column>
            </Grid>
            
        </Tab.Pane>
    )
})