import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Card } from "primereact/card"

const ForgotPassword = () => {

    const { forgotPassword } = useContext(AuthContext)
    const [ loading, setLoading ] = useState(false)

    return (
        <Card title='Recuperar contraseña'>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Email invalido').required('Campo requerido')
                })}
                onSubmit={async (values, { resetForm }) => {
                    setLoading(true)
                    const success = await forgotPassword(values.email)
                    if (success) resetForm()
                    setLoading(false)
                }}

            >
                {({ handleChange, values }) => (
                    <Form>
                        <label>Email</label>
                        <InputText id='email'  name='email' value={values.email} onChange={handleChange} placeholder='ejemplo@email.com' />
                        <span className="text-danger"> <ErrorMessage name='email' /> </span>

                        <Button 
                        label='Enviar link de recuperación' 
                        type='submit' 
                        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'} 
                        />
                    </Form>
                )}
            </Formik>
        </Card>
    )
}

export default ForgotPassword