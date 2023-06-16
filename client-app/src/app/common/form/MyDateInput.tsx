import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker, {ReactDatePickerProps, registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
registerLocale("pl", pl);


export default function MyDateInput(props: Partial<ReactDatePickerProps>) {

    const [field, meta, helpers] = useField(props.name!);

    return (
        <Form.Field error={meta.touched && meta.error}>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
                locale='pl'
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
}