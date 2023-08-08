import { Card, Grid, Header, Tab, TabProps, Image } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useEffect } from "react";
import { UserActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";

const panes = [
    {menuItem: 'Future Events', pane: {key: 'future'}},
    {menuItem: 'Past Events', pane: {key: 'past'}},
    {menuItem: 'Hosted Events', pane: {key: 'hosting'}},
];

export default observer( function ProfileActivities() {
    const {profileStore} = useStore();

    const {loadActivities, loadingActivities, userActivities} = profileStore;

useEffect(() => {
    loadActivities('future');
}, [loadActivities]);

const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadActivities(panes[data.activeIndex as number].pane.key);
};

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='calendar' content='Activities' />
                </Grid.Column>
                <Tab 
                    panes={panes}
                    menu={{secondary: true, pointing: true}}
                    onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                <br/>
                <Card.Group itemsPerRow={4}>
                    {userActivities.map((activity: UserActivity) => (
                        <Card
                            as={Link}
                            to={`/activities/${activity.id}`}
                            key={activity.id}>
                                <Image 
                                    src={`/assets/categoryImages/${activity.category}.jpg`}
                                    style={{minHeight: 100, objectFit: 'cover'}}/>
                                    <Card.Content>
                                        <Card.Header textAlign="center">{activity.title}</Card.Header>
                                        <Card.Meta textAlign="center">
                                            <div>{format(new Date(activity.date), 'do LLL')}</div>
                                            <div>{format(new Date(activity.date), 'HH:mm')}</div>
                                        </Card.Meta>
                                    </Card.Content>
                            </Card>
                    ))}
                </Card.Group>
            </Grid>
        </Tab.Pane>
    )
})