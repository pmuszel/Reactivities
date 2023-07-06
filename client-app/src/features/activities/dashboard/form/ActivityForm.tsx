import React, { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActivityFormValues } from '../../../../app/models/activity';
import LoadingComponent from '../../../../app/layout/LoadingComponent';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../../app/common/form/MyTextInput';
import MyTextArea from '../../../../app/common/form/MyTextArea';
import MySelectInput from '../../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../../app/common/form/options/categoryOptions';
import MyDateInput from '../../../../app/common/form/MyDateInput';


export default observer(function ActivityForm() {

    const {activityStore} = useStore();
    const {loadActivity, loadingInitial} = activityStore;

    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required.'),
        description: Yup.string().required('The activity description is required.'),
        category: Yup.string().required('The activity title is required.'),
        date: Yup.string().required('The activity date is required.').nullable(),
        venue: Yup.string().required('The activity venue is required.'),
        city: Yup.string().required('The activity city is required.'),
    });

    useEffect(() => {
        if(id) {
            loadActivity(id).then(activity => {
                setActivity(new ActivityFormValues(activity));
            })
        }
    }, [id, loadActivity]);

    // const initialState = selectedActivity ?? {
    //     id: '',
    //     title: '',
    //     category: '',
    //     description: '',
    //     date: '',
    //     city: '',
    //     venue: ''
    // };

    // const [activity, setActivity] = useState(initialState);

    async function handleFormSubmit(activity: ActivityFormValues) {
        console.log(activity);

        let activityId: string;
        if(activity.id) {
            activityId = activity.id;
            await activityStore.updateActivity(activity);
        } else {
            activityId = await activityStore.createActivity(activity)
        };
        navigate(`/activities/${activityId}`);
    }

    // function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     const {name, value} = event.target;
    //     setActivity({
    //         ...activity, [name]: value
    //     });
    // }

    if(loadingInitial) return <LoadingComponent content='Loading activity...' />;


    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        {/* <FormField>
                            <Field placeholder='Title' name='title' />
                            <ErrorMessage name='title' render={(error: string) => <Label basic color='red' content={error}/>}  />
                        </FormField> */}

                        <MyTextInput name='title' placeholder='title' />                  
                        <MyTextArea placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput 
                            placeholderText='Date'
                            name='date' 
                            showTimeSelect
                            timeCaption='Czas'
                            timeFormat='HH:mm'
                            dateFormat='yyyy-MM-dd HH:mm'               
                            />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                    <Button 
                        loading={isSubmitting} 
                        disabled={isSubmitting || !dirty || !isValid}
                        floated='right' 
                        positive 
                        type='submit' 
                        content='Submit' />
                    <Button  as={Link} to={`/activities/${activity.id}`} floated='right' type='submit' content='Cancel' />
                </Form>
                )}
            </Formik>          
        </Segment>
    )
});