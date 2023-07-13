import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store"
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { Profile } from "../../app/models/profile";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";

interface Props {
    setEditMode: (editMode: boolean) => void;
   }

export default function ProfileEdit({setEditMode}: Props) {

    const {profileStore: {profile, updateProfile}} = useStore();

    function handleFormSubmit(profile: Partial<Profile>) {
        updateProfile(profile).then(() => setEditMode(false));
    }

    return (
        <Segment clearing>
            <Header content='Edit profile' sub color='teal' />
            <Formik
                validationSchema={Yup.object({
                    displayName: Yup.string().required('Display name is required.'),
                })}
                enableReinitialize
                initialValues={{displayName: profile?.displayName, bio: profile?.bio}}
                onSubmit={values => handleFormSubmit(values)}>
                    {({handleSubmit, isValid, isSubmitting, dirty}) => (
                        <Form className='ui form' autoComplete='off' onSubmit={handleSubmit}>
                            <MyTextInput name='displayName' placeholder='Display name' /> 
                            <MyTextArea placeholder='Bio' name='bio' />
                            <Button 
                                loading={isSubmitting} 
                                disabled={isSubmitting || !dirty || !isValid}
                                floated='right' 
                                positive 
                                type='submit' 
                                content='Submit' />
                        </Form>
                    )}
            </Formik>
        </Segment>
    )
}