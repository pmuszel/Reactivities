import { observer } from "mobx-react-lite";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[];
}

export default observer (function ActivityListItemAttendee({attendees} : Props) {

    const styles = {
        borderColor: 'orange',
        borderWidth: 2
    }
    return (
        <List horizontal>
            {attendees.map(a => (
                <Popup 
                    hoverable
                    key={a.username}
                    trigger={
                        <List.Item key={a.username} as={Link} to={`/profiles/${a.username}`}>
                        <Image bordered style={a.following ? styles : null} size='mini' circular src={a.image || '/assets/user.png'} />
                    </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={a}/>
                    </Popup.Content>
                </Popup>

            ))}
        </List>
    );
})