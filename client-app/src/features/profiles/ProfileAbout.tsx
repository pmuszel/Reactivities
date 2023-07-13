import { useState } from "react";
import { Profile } from "../../app/models/profile";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileEdit from "./ProfileEdit";
import { observer } from "mobx-react-lite";

interface Props {
    profile: Profile;
}
export default observer (function ProfileAbout({profile} : Props) {
    const {profileStore: {isCurrentUser}} = useStore();
    
    const [isEditMode, setIsEditMode] = useState(false);



    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                <Header floated="left" icon='photo' content='About' />
                    {isCurrentUser && (
                        <Button floated="right" basic 
                            content={isEditMode ? 'Cancel' : 'Edit profile'} 
                            onClick={() => setIsEditMode(!isEditMode)}
                            />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {isEditMode ? <ProfileEdit setEditMode={setIsEditMode} /> : 
                    (
                        <span style={{whiteSpace: 'pre-wrap'}}>Bio: {profile.bio}</span>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})